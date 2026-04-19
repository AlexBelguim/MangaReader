const local_covers = [
    "/mnt/smb/Apps/manga/media/downloads/Shounen ga Otona ni Natta Natsu/covers/cover_from_chapter.jpg", // Linux
    "Z:\\Apps\\manga\\media\\downloads\\My Sexy Dress-Up Darling\\covers\\cover_from_chapter.jpg", // Windows
    "/downloads/My%20Series/covers/img.jpg" // Relative URL encoded
];

local_covers.forEach(path => {
    console.log(`\nTesting: ${path}`);
    try {
        const decodedPath = decodeURIComponent(path);
        const normalized = decodedPath.replace(/\\/g, '/');

        if (normalized.includes('/covers/')) {
            const parts = normalized.split('/covers/');
            const parentPath = parts[0];
            const folderName = parentPath.split('/').filter(p => p).pop();
            console.log(`-> Extracted Folder: "${folderName}"`);
        } else {
            console.log('-> No /covers/ found.');
        }
    } catch (e) {
        console.error(e);
    }
});
