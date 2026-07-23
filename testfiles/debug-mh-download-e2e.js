import { downloader } from '../src/downloader.js';

const images = [
  { index: 1, url: 'https://zjcdn.mangahere.org/store/manga/106/98-1186.0/compressed/rop_1186_nnd_001.jpg', headers: { Referer: 'https://www.mangahere.cc/manga/one_piece/v98/c1186/1.html' } },
  { index: 2, url: 'https://zjcdn.mangahere.org/store/manga/106/98-1186.0/compressed/rop_1186_nnd_002.jpg', headers: { Referer: 'https://www.mangahere.cc/manga/one_piece/v98/c1186/1.html' } },
];

const res = await downloader.downloadChapter('TEST_delete_me', 999, images);
console.log(JSON.stringify(res, null, 2));
// cleanup
const fs = await import('fs-extra');
await fs.remove(downloader.getMangaDir('TEST_delete_me'));
console.log('cleaned up test dir');
