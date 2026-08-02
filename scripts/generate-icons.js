/**
 * Generates the PWA / favicon set from the Ink & Vermillion panel mark.
 *
 *   node scripts/generate-icons.js
 *
 * Run from the repo root so it picks up the root node_modules (sharp).
 * The mark geometry is duplicated from frontend/src/brand.js — if you change
 * the logo there, mirror it here and re-run, then bump CACHE_NAME in
 * frontend/sw.js so installed PWAs pick the new icons up.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'F:/git/pupeteer/frontend';

const INK = '#14110F';
const PAPER = '#F2EDE4';
const VERMILLION = '#E03A2F';

/** The mark, drawn into a `size` canvas with the glyph occupying `scale` of it. */
function markSvg(size, { scale = 0.62, bg = INK, radius = null } = {}) {
  const g = size * scale;          // glyph box
  const off = (size - g) / 2;      // centring offset
  const k = g / 24;                // 24-grid -> px
  const sw = 2 * k;                // stroke scales with the glyph

  const p = (pts) => pts.split(' ')
    .map(pair => {
      const [x, y] = pair.split(',').map(Number);
      return `${off + x * k},${off + y * k}`;
    }).join(' ');

  const bgShape = radius === null
    ? `<rect width="${size}" height="${size}" fill="${bg}"/>`
    : `<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bg}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bgShape}
  <g fill="none" stroke="${PAPER}" stroke-width="${sw}" stroke-linejoin="round">
    <polygon points="${p('3,3 10.5,3 8.5,21 3,21')}"/>
    <polygon points="${p('13,3 21,3 21,10.5 12.17,10.5')}" fill="${VERMILLION}" stroke="${VERMILLION}"/>
    <polygon points="${p('11.89,13 21,13 21,21 11,21')}"/>
  </g>
</svg>`;
}

/**
 * Small-size variant. Below ~32px the 2px strokes blur together and the mark
 * reads as a coloured blob, so the panels become SOLID fills separated by ink
 * gutters instead. Solid shapes survive downsampling; hairlines don't.
 */
function markSvgSmall(size, { scale = 0.84, bg = INK } = {}) {
  const g = size * scale;
  const off = (size - g) / 2;
  const k = g / 24;

  const p = (pts) => pts.split(' ')
    .map(pair => {
      const [x, y] = pair.split(',').map(Number);
      return `${off + x * k},${off + y * k}`;
    }).join(' ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <polygon points="${p('3,2 10.5,2 8.5,22 3,22')}" fill="${PAPER}"/>
  <polygon points="${p('13,2 21,2 21,10.5 12.1,10.5')}" fill="${VERMILLION}"/>
  <polygon points="${p('11.85,13.5 21,13.5 21,22 11,22')}" fill="${PAPER}"/>
</svg>`;
}

const jobs = [
  // Standard icons: rounded tile, generous glyph.
  { file: 'icon-192.png', size: 192, opts: { scale: 0.62, radius: 192 * 0.22 } },
  { file: 'icon-512.png', size: 512, opts: { scale: 0.62, radius: 512 * 0.22 } },
  // Maskable: full-bleed square, glyph pulled in to survive the circle crop.
  // Android masks to ~80% diameter, so the safe zone is the centre 80%.
  { file: 'icon-maskable-192.png', size: 192, opts: { scale: 0.46, radius: null } },
  { file: 'icon-maskable-512.png', size: 512, opts: { scale: 0.46, radius: null } },
  // Apple touch icon: no rounding (iOS applies its own), full-bleed ink.
  { file: 'apple-touch-icon.png', size: 180, opts: { scale: 0.58, radius: null } },
  // Small favicons use the solid-fill variant — see markSvgSmall.
  { file: 'favicon-32.png', size: 32, opts: { scale: 0.82 }, small: true },
  { file: 'favicon-16.png', size: 16, opts: { scale: 0.88 }, small: true }
];

const written = [];
for (const { file, size, opts, small } of jobs) {
  const svg = small ? markSvgSmall(size, opts) : markSvg(size, opts);
  const dest = path.join(OUT, file);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(dest);
  written.push([file, fs.statSync(dest).size]);
}

// Scalable favicon — what modern browsers actually prefer.
fs.writeFileSync(path.join(OUT, 'favicon.svg'), markSvg(64, { scale: 0.72, radius: null }), 'utf8');
written.push(['favicon.svg', fs.statSync(path.join(OUT, 'favicon.svg')).size]);

console.log('generated:');
for (const [f, b] of written) console.log('  ' + f.padEnd(26) + (b / 1024).toFixed(1) + ' KB');
