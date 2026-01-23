
const downloader = {
    sanitizeFileName(name) {
        return name
            .replace(/[<>:"/\\|?*]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 200);
    }
};

const folderNameOnDisk = "[Herio] Bokura ga SeFri ja Nakunaru Hi -Zenpen- _ The Day We Became More Than Fuckbuddies - Part 1  (Bitter Sweet Complex) (COMIC ExE 41) [English] [cutegyaruTL] [Digital]";
const bookmarkTitle = folderNameOnDisk; // When imported, title = folderName

console.log("Folder on disk:", folderNameOnDisk);
console.log("Bookmark title:", bookmarkTitle);

const sanitizedTitle = downloader.sanitizeFileName(bookmarkTitle);
console.log("Sanitized title:", sanitizedTitle);

const matchOriginal = sanitizedTitle === folderNameOnDisk;
console.log("Current Match Logic (sanitizedTitle === folderName):", matchOriginal);

const matchSanitized = sanitizedTitle === downloader.sanitizeFileName(folderNameOnDisk);
console.log("Proposed Match Logic (sanitizedTitle === sanitizedFolder):", matchSanitized);

// Check if double spaces exist
console.log("Has double spaces:", folderNameOnDisk.includes("  "));
console.log("Sanitized has double spaces:", sanitizedTitle.includes("  "));
