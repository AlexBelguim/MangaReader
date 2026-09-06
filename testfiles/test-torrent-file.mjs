/**
 * Bencode round trip and info-hash computation for src/services/torrent-file.js.
 *   node testfiles/test-torrent-file.mjs
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { decodeBencode, encodeBencode, readTorrent, infoHashFromMagnet, nameFromMagnet } from '../src/services/torrent-file.js';

const info = { name: 'Ichi the Witch v01 (2025) (Digital)', 'piece length': 262144, pieces: Buffer.alloc(20, 1), files: [{ length: 1234, path: ['Ichi the Witch v01.cbz'] }] };
const torrent = encodeBencode({ announce: 'http://tracker.example/announce', info });
const expectedHash = createHash('sha1').update(encodeBencode(info)).digest('hex');

const parsed = readTorrent(torrent);
assert.equal(parsed.infoHash, expectedHash, 'info hash is the sha1 of the raw info dict');
assert.equal(parsed.name, info.name);
assert.deepEqual(parsed.files, [{ path: 'Ichi the Witch v01.cbz', length: 1234 }]);
assert.equal(parsed.totalSize, 1234);
console.log('  ok   readTorrent: hash, name, files');

const { value } = decodeBencode(torrent, { strings: 'utf8' });
assert.equal(value.announce, 'http://tracker.example/announce');
assert.equal(value.info.files[0].length, 1234);
console.log('  ok   decodeBencode round trip');

assert.equal(infoHashFromMagnet(`magnet:?xt=urn:btih:${expectedHash.toUpperCase()}&dn=Ichi+the+Witch+v01`), expectedHash);
assert.equal(nameFromMagnet('magnet:?xt=urn:btih:abc&dn=Ichi+the+Witch+v01%20(Digital)'), 'Ichi the Witch v01 (Digital)');
// base32 form of the same hash
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const bytes = Buffer.from(expectedHash, 'hex');
let bits = ''; for (const b of bytes) bits += b.toString(2).padStart(8, '0');
let b32 = ''; for (let i = 0; i < bits.length; i += 5) b32 += alphabet[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)];
assert.equal(infoHashFromMagnet(`magnet:?xt=urn:btih:${b32}`), expectedHash, 'base32 magnet hash converts to hex');
console.log('  ok   magnet hashes (hex and base32) and names');

assert.throws(() => readTorrent(Buffer.from('not a torrent')), /torrent|bencode/);
console.log('  ok   garbage rejected');
console.log('\nall torrent-file checks passed');
