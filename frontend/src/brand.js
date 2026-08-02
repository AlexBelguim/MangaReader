/**
 * Brand marks for Manga Reader.
 *
 * The mark is a manga page layout: three panels split by a diagonal gutter,
 * with the top-right panel filled vermillion. The diagonal is the point —
 * orthogonal panels read as a generic "grid/layout" icon, while a slanted
 * gutter is specific to comics. It holds down to 16px because it is only
 * three shapes with a 2px stroke.
 *
 * Geometry note: the two gutters are parallel. The left panel's right edge
 * runs (10.5,3) -> (8.5,21); the right column's left edge is the same slope
 * shifted +2.5 in x. Keep them parallel if you ever redraw this.
 */

/**
 * The panel mark on its own, for use next to the wordmark or as a favicon.
 *
 * @param {object} [opts]
 * @param {number} [opts.size]        pixel size; omit to inherit (1em)
 * @param {string} [opts.stroke]      panel outline colour
 * @param {string} [opts.accent]      filled-panel colour
 * @param {number} [opts.strokeWidth] 2 at 24-48px; go to 2.4 at 16px
 * @param {string} [opts.cls]         extra classes
 */
export function logoMark(opts = {}) {
  const {
    size,
    stroke = 'currentColor',
    accent = 'var(--accent-primary, #E03A2F)',
    strokeWidth = 2,
    cls = ''
  } = opts;
  const dim = size ? ` width="${size}" height="${size}"` : '';
  const classes = `logo-mark ${cls}`.trim();
  return `<svg class="${classes}"${dim} viewBox="0 0 24 24" fill="none" ` +
    `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" aria-hidden="true">` +
    `<polygon points="3,3 10.5,3 8.5,21 3,21"/>` +
    `<polygon points="13,3 21,3 21,10.5 12.17,10.5" fill="${accent}" stroke="${accent}"/>` +
    `<polygon points="11.89,13 21,13 21,21 11,21"/>` +
    `</svg>`;
}

/**
 * Full lockup: mark plus wordmark, as used in the header.
 */
export function logoLockup() {
  return `${logoMark()}<span class="logo-text">Manga<span>Reader</span></span>`;
}

export default { logoMark, logoLockup };
