/**
 * Read manga release names the way they show up on torrent indexers:
 *
 *   Ichi the Witch v01 (2025) (Digital) (1r0n)
 *   [Group] Title Vol. 03 [Digital]
 *   Title Volume 3
 *   Title v01-v05 (Digital) (Danke-Empire)
 *   Title c001-c010 (2024) (Digital)
 *
 * There is no scene convention for manga, so this is deliberately loose:
 * it finds the volume (or volume range), the year, whether it says
 * Digital, and treats whatever came before the volume marker as the title.
 */

const VOLUME_RE = /(?:^|[\s._\-(\[])(?:v|vol\.?|volume)\s*0*(\d{1,3})(?:\s*(?:-|~|to)\s*(?:v|vol\.?|volume)?\s*0*(\d{1,3}))?(?=$|[\s._\-)\].,])/i;
const CHAPTER_RE = /(?:^|[\s._\-(\[])(?:c|ch\.?|chapter)\s*0*(\d{1,4}(?:\.\d+)?)(?:\s*(?:-|~|to)\s*(?:c|ch\.?|chapter)?\s*0*(\d{1,4}(?:\.\d+)?))?(?=$|[\s._\-)\].,])/i;
const YEAR_RE = /\((19|20)\d{2}\)/;

/**
 * @returns {{ title: string, volume: number|null, volumeEnd: number|null, volumes: number[], chapter: number|null, chapterEnd: number|null, year: number|null, digital: boolean, group: string|null, raw: string }}
 */
export function parseReleaseName(raw) {
  const name = String(raw || '').replace(/\.(cbz|cbr|zip|rar|7z|pdf|epub|torrent)$/i, '').trim();
  const out = { title: '', volume: null, volumeEnd: null, volumes: [], chapter: null, chapterEnd: null, year: null, digital: /\bdigital\b/i.test(name), group: null, raw: String(raw || '') };

  const year = name.match(YEAR_RE);
  if (year) out.year = parseInt(year[0].slice(1, 5), 10);

  // A leading "[Group]" tag, or the last "(Group)" tag that is not a year/format word
  const leading = name.match(/^\[([^\]]+)\]\s*/);
  if (leading) out.group = leading[1].trim();
  const tags = [...name.matchAll(/\(([^)]+)\)/g)].map(m => m[1].trim());
  const groupTag = tags.reverse().find(t => !/^(19|20)\d{2}$/.test(t) && !/^(digital|scan|scans?|webrip|ebook|f\d+|v\d+|\d+p)$/i.test(t));
  if (!out.group && groupTag) out.group = groupTag;

  let markerIndex = name.length;
  const vol = name.match(VOLUME_RE);
  if (vol) {
    out.volume = parseInt(vol[1], 10);
    out.volumeEnd = vol[2] ? parseInt(vol[2], 10) : null;
    markerIndex = Math.min(markerIndex, vol.index + (vol[0].match(/^[\s._\-(\[]/) ? 1 : 0));
    const end = out.volumeEnd ?? out.volume;
    for (let v = out.volume; v <= end && out.volumes.length < 200; v++) out.volumes.push(v);
  }
  const ch = name.match(CHAPTER_RE);
  if (ch && !vol) {
    out.chapter = parseFloat(ch[1]);
    out.chapterEnd = ch[2] ? parseFloat(ch[2]) : null;
    markerIndex = Math.min(markerIndex, ch.index + (ch[0].match(/^[\s._\-(\[]/) ? 1 : 0));
  }
  if (year && !vol && !ch) markerIndex = Math.min(markerIndex, year.index);

  let title = name.slice(0, markerIndex);
  title = title.replace(/^\[[^\]]*\]\s*/, '');            // leading group tag
  title = title.replace(/\([^)]*\)|\[[^\]]*\]/g, ' ');     // any remaining tags
  // Dotted names ("Some.Series.v04") use dots as spaces; a normal title keeps its dots ("Kaiju No. 8")
  if (!/\s/.test(title.trim())) title = title.replace(/\./g, ' ');
  title = title.replace(/_+/g, ' ').replace(/\s*[-–]\s*$/, '').replace(/\s+/g, ' ').trim();
  out.title = title;
  return out;
}

/** "Volume 03", "Vol. 3", "v3" style names for a number */
export function volumeLabel(n) {
  return `Volume ${String(n).padStart(2, '0')}`;
}

export default { parseReleaseName, volumeLabel };
