/**
 * Just enough bencode to read a .torrent file: decode it, and compute the
 * v1 info hash (SHA-1 of the raw bytes of the `info` dictionary), which is
 * how qBittorrent identifies the torrent afterwards. Encoding is here for
 * tests and for building tiny torrents in a mock client.
 */

import { createHash } from 'crypto';

/**
 * Decode bencoded bytes.
 * @returns {{ value: any, infoRange: [number, number] | null }} the decoded
 *   value (dictionaries as plain objects with Buffer values for strings
 *   unless `strings` is 'utf8') and the byte range of the top-level `info`
 *   dictionary when present.
 */
export function decodeBencode(buf, { strings = 'buffer' } = {}) {
  let pos = 0;
  let infoRange = null;

  const readString = () => {
    const colon = buf.indexOf(0x3a, pos); // ':'
    if (colon < 0) throw new Error('bencode: bad string length');
    const len = parseInt(buf.subarray(pos, colon).toString('ascii'), 10);
    if (!Number.isFinite(len) || len < 0) throw new Error('bencode: bad string length');
    const start = colon + 1;
    pos = start + len;
    if (pos > buf.length) throw new Error('bencode: string runs past the end');
    const bytes = buf.subarray(start, pos);
    return strings === 'utf8' ? bytes.toString('utf8') : Buffer.from(bytes);
  };

  const readValue = (depth = 0) => {
    if (depth > 64) throw new Error('bencode: nesting too deep');
    const c = buf[pos];
    if (c === 0x69) { // 'i'
      const end = buf.indexOf(0x65, pos); // 'e'
      if (end < 0) throw new Error('bencode: unterminated integer');
      const n = Number(buf.subarray(pos + 1, end).toString('ascii'));
      if (!Number.isFinite(n)) throw new Error('bencode: bad integer');
      pos = end + 1;
      return n;
    }
    if (c === 0x6c) { // 'l'
      pos++;
      const list = [];
      while (buf[pos] !== 0x65) {
        if (pos >= buf.length) throw new Error('bencode: unterminated list');
        list.push(readValue(depth + 1));
      }
      pos++;
      return list;
    }
    if (c === 0x64) { // 'd'
      pos++;
      const dict = {};
      while (buf[pos] !== 0x65) {
        if (pos >= buf.length) throw new Error('bencode: unterminated dictionary');
        const keyBytes = readString();
        const key = Buffer.isBuffer(keyBytes) ? keyBytes.toString('utf8') : keyBytes;
        const valueStart = pos;
        dict[key] = readValue(depth + 1);
        if (depth === 0 && key === 'info') infoRange = [valueStart, pos];
      }
      pos++;
      return dict;
    }
    if (c >= 0x30 && c <= 0x39) return readString();
    throw new Error(`bencode: unexpected byte ${c} at ${pos}`);
  };

  const value = readValue();
  return { value, infoRange };
}

export function encodeBencode(value) {
  if (Buffer.isBuffer(value)) return Buffer.concat([Buffer.from(`${value.length}:`), value]);
  if (typeof value === 'string') {
    const bytes = Buffer.from(value, 'utf8');
    return Buffer.concat([Buffer.from(`${bytes.length}:`), bytes]);
  }
  if (typeof value === 'number') return Buffer.from(`i${Math.trunc(value)}e`);
  if (Array.isArray(value)) return Buffer.concat([Buffer.from('l'), ...value.map(encodeBencode), Buffer.from('e')]);
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort(); // bencode dictionaries are key-sorted
    return Buffer.concat([
      Buffer.from('d'),
      ...keys.flatMap(k => [encodeBencode(k), encodeBencode(value[k])]),
      Buffer.from('e')
    ]);
  }
  throw new Error(`bencode: cannot encode ${typeof value}`);
}

/**
 * What a .torrent file says about itself.
 * @returns {{ infoHash: string, name: string, totalSize: number, files: Array<{ path: string, length: number }> }}
 */
export function readTorrent(buf) {
  const { value, infoRange } = decodeBencode(buf);
  const info = value?.info;
  if (!info || !infoRange) throw new Error('Not a torrent file (no info dictionary)');
  const infoHash = createHash('sha1').update(buf.subarray(infoRange[0], infoRange[1])).digest('hex');
  const name = Buffer.isBuffer(info.name) ? info.name.toString('utf8') : String(info.name || '');
  let files;
  if (Array.isArray(info.files)) {
    files = info.files.map(f => ({
      path: (f.path || []).map(p => Buffer.isBuffer(p) ? p.toString('utf8') : String(p)).join('/'),
      length: Number(f.length) || 0
    }));
  } else {
    files = [{ path: name, length: Number(info.length) || 0 }];
  }
  return { infoHash, name, totalSize: files.reduce((s, f) => s + f.length, 0), files };
}

/** The info hash inside a magnet link, as lowercase hex (base32 forms converted). */
export function infoHashFromMagnet(magnet) {
  const match = String(magnet).match(/xt=urn:btih:([a-zA-Z0-9]+)/);
  if (!match) return null;
  const raw = match[1];
  if (/^[0-9a-fA-F]{40}$/.test(raw)) return raw.toLowerCase();
  if (/^[A-Za-z2-7]{32}$/.test(raw)) return base32ToHex(raw);
  return null;
}

function base32ToHex(s) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const ch of s.toUpperCase()) {
    const i = alphabet.indexOf(ch);
    if (i < 0) return null;
    bits += i.toString(2).padStart(5, '0');
  }
  let hex = '';
  for (let i = 0; i + 4 <= bits.length; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  return hex.slice(0, 40);
}

/** The display name inside a magnet link (dn=), if any. */
export function nameFromMagnet(magnet) {
  const match = String(magnet).match(/[?&]dn=([^&]+)/);
  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
}

export default { decodeBencode, encodeBencode, readTorrent, infoHashFromMagnet, nameFromMagnet };
