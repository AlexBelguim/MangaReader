// Decode mangahere chapterfun.ashx packed response from C:/Users/alexw/AppData/Local/Temp/mh_p1.js
const src = require('fs').readFileSync('C:/Users/alexw/AppData/Local/Temp/mh_p1.js', 'utf8');

function unpack(p, a, c, k) {
  const e = (cc) => (cc < a ? '' : e(Math.floor(cc / a))) + ((cc %= a) > 35 ? String.fromCharCode(cc + 29) : cc.toString(36));
  const d = {};
  while (c--) d[e(c)] = k[c] || e(c);
  return p.replace(/\b\w+\b/g, (w) => d[w] || w);
}

// Extract ('<p>',a,c,'<k|k|k>') — parse from the end since k has no quotes
const m = src.match(/\('(.*)',(\d+),(\d+),'(.*)'\);\)?\s*$/s);
if (!m) { console.log('NO MATCH'); process.exit(1); }
const p = m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
const a = +m[2], c = +m[3];
const k = m[4].replace(/\\'/g, "'").replace(/\\\\/g, '\\').split('|');
console.log(unpack(p, a, c, k));
