/**
 * Chapter deduplication and versioning utility.
 * Extracted from comix scraper's getMangaInfo post-processing.
 * 
 * When multiple chapters share the same number (e.g. different release groups),
 * they are kept as separate versions with version metadata.
 */

/**
 * Deduplicate chapters by number, keeping all unique URLs as versions.
 * 
 * @param {Array} allChapters - Raw array of chapter objects, each with { number, url, ... }
 * @returns {{ chapters: Array, duplicateChapters: Array, uniqueCount: number }}
 */
export function deduplicateChapters(allChapters) {
  const chaptersByNumber = new Map();

  for (const ch of allChapters) {
    const existing = chaptersByNumber.get(ch.number) || [];
    const isDuplicateUrl = existing.some(e => e.url === ch.url);
    if (!isDuplicateUrl) {
      existing.push(ch);
      chaptersByNumber.set(ch.number, existing);
    }
  }

  // Build final chapter list with version info
  const chapters = [];
  const duplicateChapters = [];

  for (const [num, versions] of chaptersByNumber) {
    if (versions.length === 1) {
      chapters.push(versions[0]);
    } else {
      versions.forEach((v, i) => {
        chapters.push({
          ...v,
          version: i + 1,
          totalVersions: versions.length,
          originalNumber: num
        });
      });
      duplicateChapters.push({
        number: num,
        versions: versions.map((v, i) => ({ ...v, version: i + 1 }))
      });
    }
  }

  chapters.sort((a, b) => a.number - b.number);

  return {
    chapters,
    duplicateChapters,
    uniqueCount: chaptersByNumber.size
  };
}
