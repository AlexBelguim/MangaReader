/**
 * Release-name parsing for src/services/release-name.js.
 *   node testfiles/test-release-name.mjs
 */
import assert from 'node:assert/strict';
import { parseReleaseName } from '../src/services/release-name.js';

const cases = [
  ['Ichi the Witch v01 (2025) (Digital) (1r0n)', { title: 'Ichi the Witch', volume: 1, volumeEnd: null, year: 2025, digital: true, group: '1r0n' }],
  ['[Danke-Empire] Chainsaw Man Vol. 03 [Digital]', { title: 'Chainsaw Man', volume: 3, digital: true, group: 'Danke-Empire' }],
  ['Chained Soldier Volume 7 (Uncensored)', { title: 'Chained Soldier', volume: 7, group: 'Uncensored' }],
  ['One Piece v01-v05 (Digital) (aKraa)', { title: 'One Piece', volume: 1, volumeEnd: 5, digital: true }],
  ['Kaiju No. 8 v012 (2024) (Digital) (LuCaZ)', { title: 'Kaiju No. 8', volume: 12, year: 2024 }],
  ['Blue Lock c001-c010 (2023) (Digital)', { title: 'Blue Lock', volume: null, chapter: 1, chapterEnd: 10, year: 2023 }],
  ['Ichi the Witch v02.cbz', { title: 'Ichi the Witch', volume: 2 }],
  ['Some.Series.v04.2021.Digital', { title: 'Some Series', volume: 4 }],
  ['Frieren - Beyond Journey End (2021) (Digital)', { title: 'Frieren - Beyond Journey End', volume: null, year: 2021 }],
];
let ok = 0;
for (const [name, expected] of cases) {
  const got = parseReleaseName(name);
  for (const [k, v] of Object.entries(expected)) {
    assert.deepEqual(got[k], v, `${name} -> ${k}: expected ${JSON.stringify(v)}, got ${JSON.stringify(got[k])}`);
  }
  ok++;
  console.log(`  ok   ${name}  ->  "${got.title}" vol=${got.volume}${got.volumeEnd ? '-' + got.volumeEnd : ''}`);
}
const range = parseReleaseName('One Piece v01-v05');
assert.deepEqual(range.volumes, [1, 2, 3, 4, 5]);
console.log(`\n${ok} release names parsed as expected`);
