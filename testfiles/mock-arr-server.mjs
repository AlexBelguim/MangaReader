/**
 * A stand-in for Prowlarr and qBittorrent, for exercising the torrent
 * flow (settings test, search, grab, progress, completion, import) without
 * real services. One HTTP server, two prefixes:
 *
 *   http://localhost:18191/prowlarr   Prowlarr  (X-Api-Key must be "test-key")
 *   http://localhost:18191/qbt        qBittorrent WebUI API v2 (login admin / adminadmin)
 *
 * Added torrents "download" 25% per /torrents/info poll. On completion the
 * mock writes the release into SAVE_PATH as <name>/<name>.cbz built from
 * the images in SOURCE_IMAGES (any folder of jpg/png), so an import has
 * real pages to extract.
 *
 *   MOCK_PORT=18191 SAVE_PATH=<dir> SOURCE_IMAGES=<dir with images> node testfiles/mock-arr-server.mjs
 */
import http from 'node:http';
import path from 'node:path';
import fs from 'fs-extra';
import AdmZip from 'adm-zip';
import { encodeBencode, readTorrent, infoHashFromMagnet, nameFromMagnet } from '../src/services/torrent-file.js';

const PORT = parseInt(process.env.MOCK_PORT || '18191', 10);
const SAVE_PATH = process.env.SAVE_PATH || path.resolve('mock-torrents');
const SOURCE_IMAGES = process.env.SOURCE_IMAGES || '';
const API_KEY = 'test-key';
const RELEASES = [
  { id: 1, title: 'Ichi the Witch v01 (2025) (Digital) (1r0n)', size: 180 * 1024 * 1024, seeders: 42, leechers: 3, indexer: 'Nyaa', magnet: false },
  { id: 2, title: 'Ichi the Witch v02 (2025) (Digital) (1r0n)', size: 175 * 1024 * 1024, seeders: 31, leechers: 1, indexer: 'Nyaa', magnet: false },
  { id: 3, title: 'Ichi the Witch v01-v02 (Digital) (Danke-Empire)', size: 360 * 1024 * 1024, seeders: 12, leechers: 0, indexer: 'Nyaa', magnet: true },
  { id: 4, title: 'Chained Soldier v07 (2024) (Digital) (Uncensored)', size: 210 * 1024 * 1024, seeders: 9, leechers: 2, indexer: 'AnimeBytes', magnet: false },
];

function torrentFor(release) {
  const info = { name: release.title, 'piece length': 262144, pieces: Buffer.alloc(20, release.id), files: [{ length: release.size, path: [`${release.title}.cbz`] }] };
  return encodeBencode({ announce: 'http://tracker.local/announce', info });
}

const torrents = new Map(); // hash -> { hash, name, size, progress, state, category, save_path, added_on, completion_on }

async function materialise(t) {
  const dir = path.join(t.save_path || SAVE_PATH, t.name);
  await fs.ensureDir(dir);
  const zip = new AdmZip();
  let images = [];
  if (SOURCE_IMAGES && await fs.pathExists(SOURCE_IMAGES)) {
    images = (await fs.readdir(SOURCE_IMAGES)).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  }
  if (images.length === 0) {
    // 1x1 jpeg placeholder so extraction still has files
    const px = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==', 'base64');
    for (let i = 1; i <= 5; i++) zip.addFile(`${String(i).padStart(3, '0')}.jpg`, px);
  } else {
    let i = 0;
    for (const f of images) zip.addFile(`${String(++i).padStart(3, '0')}${path.extname(f).toLowerCase()}`, await fs.readFile(path.join(SOURCE_IMAGES, f)));
  }
  await fs.writeFile(path.join(dir, `${t.name}.cbz`), zip.toBuffer());
  t.content_path = dir;
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

// Minimal multipart parser: fields and one file part
function parseMultipart(buf, contentType) {
  const boundary = (contentType.match(/boundary=(.+)$/) || [])[1];
  const out = { fields: {}, file: null };
  if (!boundary) return out;
  const sep = Buffer.from(`--${boundary}`);
  let start = buf.indexOf(sep) + sep.length;
  while (start < buf.length) {
    const next = buf.indexOf(sep, start);
    if (next < 0) break;
    const part = buf.subarray(start, next);
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd > 0) {
      const headers = part.subarray(0, headerEnd).toString();
      const body = part.subarray(headerEnd + 4, part.length - 2);
      const name = (headers.match(/name="([^"]+)"/) || [])[1];
      const filename = (headers.match(/filename="([^"]*)"/) || [])[1];
      if (filename !== undefined) out.file = { name, filename, data: body };
      else if (name) out.fields[name] = body.toString();
    }
    start = next + sep.length;
  }
  return out;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;
  console.log(`[mock] ${req.method} ${p}${url.search}`);

  // ---- Prowlarr ----
  if (p.startsWith('/prowlarr/')) {
    if (req.headers['x-api-key'] !== API_KEY && !url.searchParams.get('apikey')) return json(res, 401, { message: 'Unauthorized' });
    if (p === '/prowlarr/api/v1/system/status') return json(res, 200, { appName: 'Prowlarr', version: '1.30.0-mock' });
    if (p === '/prowlarr/api/v1/indexer') return json(res, 200, [{ id: 1, name: 'Nyaa', enable: true }, { id: 2, name: 'AnimeBytes', enable: true }]);
    if (p === '/prowlarr/api/v1/search') {
      const q = (url.searchParams.get('query') || '').toLowerCase();
      const hits = RELEASES.filter(r => r.title.toLowerCase().includes(q)).map(r => ({
        guid: `mock-${r.id}`, title: r.title, size: r.size, seeders: r.seeders, leechers: r.leechers, indexer: r.indexer, indexerId: 1,
        protocol: 'torrent', publishDate: '2026-08-01T00:00:00Z', categories: [{ id: 7030, name: 'Books/Comics' }],
        downloadUrl: r.magnet ? null : `http://localhost:${PORT}/prowlarr/download/${r.id}?apikey=${API_KEY}`,
        // Like Prowlarr: the magnet is proxied through /download too, which answers with a redirect to the magnet URI
        magnetUrl: r.magnet ? `http://localhost:${PORT}/prowlarr/download/${r.id}?apikey=${API_KEY}` : null,
        infoUrl: `https://nyaa.si/view/${1000 + r.id}`
      }));
      return json(res, 200, hits);
    }
    const dl = p.match(/^\/prowlarr\/download\/(\d+)$/);
    if (dl) {
      const r = RELEASES.find(x => x.id === parseInt(dl[1], 10));
      if (!r) return json(res, 404, { message: 'no such release' });
      if (r.magnet) {
        res.writeHead(302, { Location: `magnet:?xt=urn:btih:${readTorrent(torrentFor(r)).infoHash}&dn=${encodeURIComponent(r.title)}` });
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'application/x-bittorrent', 'Content-Disposition': `attachment; filename="${r.title}.torrent"` });
      return res.end(torrentFor(r));
    }
    return json(res, 404, { message: 'not found' });
  }

  // ---- qBittorrent ----
  if (p.startsWith('/qbt/')) {
    if (p === '/qbt/api/v2/auth/login') {
      const body = new URLSearchParams((await readBody(req)).toString());
      if (body.get('username') === 'admin' && body.get('password') === 'adminadmin') {
        res.writeHead(200, { 'Set-Cookie': 'SID=mocksid; HttpOnly; path=/', 'Content-Type': 'text/plain' });
        return res.end('Ok.');
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('Fails.');
    }
    if (!/SID=mocksid/.test(req.headers.cookie || '')) { res.writeHead(403); return res.end('Forbidden'); }
    if (p === '/qbt/api/v2/app/version') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('v5.0.2-mock'); }
    if (p === '/qbt/api/v2/app/preferences') return json(res, 200, { save_path: SAVE_PATH });
    if (p === '/qbt/api/v2/torrents/add') {
      const body = await readBody(req);
      const { fields, file } = parseMultipart(body, req.headers['content-type'] || '');
      let hash, name, size = 0;
      if (file) {
        const t = readTorrent(file.data);
        hash = t.infoHash; name = t.name; size = t.totalSize;
      } else if (fields.urls) {
        hash = infoHashFromMagnet(fields.urls); name = nameFromMagnet(fields.urls) || hash; size = 300 * 1024 * 1024;
      } else { res.writeHead(415); return res.end('Fails.'); }
      torrents.set(hash, { hash, name, size, progress: 0, state: 'downloading', category: fields.category || '', save_path: fields.savepath || SAVE_PATH, content_path: '', added_on: Math.floor(Date.now() / 1000), completion_on: 0, dlspeed: 4 * 1024 * 1024, eta: 60, num_seeds: 12, ratio: 0 });
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('Ok.');
    }
    if (p === '/qbt/api/v2/torrents/info') {
      const category = url.searchParams.get('category');
      const hashes = url.searchParams.get('hashes')?.split('|');
      const list = [];
      for (const t of torrents.values()) {
        if (category && t.category !== category) continue;
        if (hashes && !hashes.includes(t.hash)) continue;
        if (t.progress < 1) {
          t.progress = Math.min(1, t.progress + 0.25);
          if (t.progress >= 1) { t.state = 'uploading'; t.completion_on = Math.floor(Date.now() / 1000); t.dlspeed = 0; t.eta = 8640000; await materialise(t); }
        }
        list.push({ ...t, total_size: t.size });
      }
      return json(res, 200, list);
    }
    if (p === '/qbt/api/v2/torrents/files') {
      const t = torrents.get(url.searchParams.get('hash'));
      return json(res, 200, t ? [{ name: `${t.name}/${t.name}.cbz`, size: t.size, progress: t.progress }] : []);
    }
    if (p === '/qbt/api/v2/torrents/delete') {
      const body = new URLSearchParams((await readBody(req)).toString());
      for (const h of (body.get('hashes') || '').split('|')) torrents.delete(h);
      res.writeHead(200); return res.end();
    }
    if (/\/qbt\/api\/v2\/torrents\/(stop|pause|start|resume)$/.test(p)) {
      const body = new URLSearchParams((await readBody(req)).toString());
      for (const h of (body.get('hashes') || '').split('|')) { const t = torrents.get(h); if (t) t.state = /stop|pause/.test(p) ? 'pausedDL' : 'downloading'; }
      res.writeHead(200); return res.end();
    }
    res.writeHead(404); return res.end('not found');
  }
  res.writeHead(404); res.end('not found');
});

server.listen(PORT, () => console.log(`[mock] Prowlarr at http://localhost:${PORT}/prowlarr (key ${API_KEY}); qBittorrent at http://localhost:${PORT}/qbt (admin/adminadmin); save path ${SAVE_PATH}`));
