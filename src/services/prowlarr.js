/**
 * Prowlarr client: the indexer layer, the same way Sonarr and Radarr use it.
 * One URL and API key; searches fan out to every indexer enabled in Prowlarr
 * and come back as normalised releases with a download link (a .torrent
 * proxied through Prowlarr, or a magnet).
 *
 * API: https://prowlarr.com/docs/api/  (X-Api-Key header)
 */

import { infoHashFromMagnet } from './torrent-file.js';

const TIMEOUT_MS = 30000;

// Newznab/Torznab category ids Prowlarr uses for manga: Books and Comics.
export const MANGA_CATEGORIES = [7000, 7030];

function baseUrlOf(settings) {
  const raw = String(settings?.baseUrl || '').trim();
  if (!raw) throw new Error('Prowlarr URL is not set');
  return raw.replace(/\/+$/, '');
}

async function request(settings, path, { method = 'GET', query, timeout = TIMEOUT_MS } = {}) {
  const url = new URL(`${baseUrlOf(settings)}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      if (Array.isArray(v)) v.forEach(item => url.searchParams.append(k, String(item)));
      else url.searchParams.set(k, String(v));
    }
  }
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: { 'X-Api-Key': settings.apiKey || '', 'Accept': 'application/json' },
      signal: AbortSignal.timeout(timeout)
    });
  } catch (e) {
    throw new Error(`Prowlarr unreachable at ${url.origin}: ${e.message}`);
  }
  if (response.status === 401) throw new Error('Prowlarr rejected the API key');
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Prowlarr answered HTTP ${response.status}${text ? `: ${text.slice(0, 200)}` : ''}`);
  }
  return response.json();
}

/** @returns {{ ok: true, version: string, appName: string, indexers: number }} */
export async function testConnection(settings) {
  const status = await request(settings, '/api/v1/system/status');
  let indexers = null;
  try {
    const list = await request(settings, '/api/v1/indexer');
    indexers = Array.isArray(list) ? list.filter(i => i.enable !== false).length : null;
  } catch (e) {
    // status is enough to call it connected
  }
  return { ok: true, version: status.version || '', appName: status.appName || 'Prowlarr', indexers };
}

/**
 * Search every enabled indexer. Torrent releases only, newest first among
 * equal seeders is left to the caller; this returns Prowlarr's order.
 * Falls back to an uncategorised search when the manga categories return
 * nothing (some indexers map manga elsewhere).
 * @returns {Promise<Array<{ guid, title, size, seeders, leechers, indexer, indexerId, downloadUrl, magnetUrl, infoUrl, publishDate, infoHash }>>}
 */
export async function search(settings, query, { categories = MANGA_CATEGORIES, limit = 100 } = {}) {
  const q = String(query || '').trim();
  if (!q) return [];
  const run = (cats) => request(settings, '/api/v1/search', {
    query: { query: q, type: 'search', limit, categories: cats },
    timeout: 60000
  });
  let results = await run(categories);
  if ((!Array.isArray(results) || results.length === 0) && categories.length) results = await run([]);
  return (Array.isArray(results) ? results : [])
    .filter(r => !r.protocol || r.protocol === 'torrent')
    .map(r => ({
      guid: r.guid || r.downloadUrl || r.magnetUrl || r.title,
      title: r.title || '',
      size: Number(r.size) || 0,
      seeders: r.seeders ?? null,
      leechers: r.leechers ?? null,
      indexer: r.indexer || '',
      indexerId: r.indexerId ?? null,
      downloadUrl: r.downloadUrl || null,
      magnetUrl: r.magnetUrl || null,
      infoUrl: r.infoUrl || null,
      publishDate: r.publishDate || null,
      infoHash: r.infoHash || (r.magnetUrl ? infoHashFromMagnet(r.magnetUrl) : null),
      categories: (r.categories || []).map(c => c.name || c.id).filter(Boolean)
    }));
}

/**
 * Get what qBittorrent needs to start a release: either a magnet link or
 * the .torrent bytes. Prowlarr's download link may serve the file, or
 * redirect to a magnet.
 * @returns {Promise<{ magnet: string } | { torrent: Buffer, filename: string }>}
 */
export async function fetchRelease(settings, release) {
  if (release.magnetUrl && !release.downloadUrl) {
    if (!String(release.magnetUrl).startsWith('magnet:')) throw new Error('Invalid magnet link');
    return { magnet: release.magnetUrl };
  }
  if (!release.downloadUrl) throw new Error('This release has no download link');
  if (release.downloadUrl.startsWith('magnet:')) return { magnet: release.downloadUrl };

  // The release object comes from the client. Only Prowlarr's own download
  // links get the API key, and only http(s) is fetched at all.
  let target;
  try {
    target = new URL(release.downloadUrl);
  } catch (e) {
    throw new Error('Invalid download link');
  }
  if (!/^https?:$/.test(target.protocol)) throw new Error('Download link must be http(s)');
  const prowlarrOrigin = new URL(baseUrlOf(settings)).origin;
  const headers = target.origin === prowlarrOrigin ? { 'X-Api-Key': settings.apiKey || '' } : {};

  let response;
  try {
    response = await fetch(target, {
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
  } catch (e) {
    throw new Error(`Could not fetch the release from Prowlarr: ${e.message}`);
  }
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location') || '';
    if (location.startsWith('magnet:')) return { magnet: location };
    // A redirect to another http location: follow it once
    const followed = await fetch(location, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!followed.ok) throw new Error(`Release download answered HTTP ${followed.status}`);
    return { torrent: Buffer.from(await followed.arrayBuffer()), filename: filenameFrom(followed, release) };
  }
  if (!response.ok) throw new Error(`Release download answered HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  const body = Buffer.from(await response.arrayBuffer());
  if (/text\/html/.test(contentType) && !body.subarray(0, 1).equals(Buffer.from('d'))) {
    throw new Error('Prowlarr returned a web page instead of a torrent file (check the URL and API key)');
  }
  if (release.magnetUrl && body.length === 0) return { magnet: release.magnetUrl };
  return { torrent: body, filename: filenameFrom(response, release) };
}

function filenameFrom(response, release) {
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const name = match ? decodeURIComponent(match[1]) : `${release.title || 'release'}.torrent`;
  return name.endsWith('.torrent') ? name : `${name}.torrent`;
}

export default { testConnection, search, fetchRelease, MANGA_CATEGORIES };
