# Manga Scraper

A Puppeteer-based manga scraper with bookmark management. Scrape manga from multiple websites, track your reading progress, and download chapters.

## Features

- 🔍 **Scrape manga info** - Get chapter lists from supported websites
- 📚 **Bookmark management** - Save and organize your favorite manga
- 📥 **Download chapters** - Download manga chapters as images
- 🔄 **Check for updates** - Check all bookmarks for new chapters
- ✏️ **Alias support** - Rename manga (e.g., "English" vs "Raw") without losing tracking
- 🌐 **Multi-website support** - Easily add support for new websites

## Supported Websites

- comix.to

## Installation

```bash
npm install
```

### Raspberry Pi Deployment

1. Install dependencies (skipping Chromium download to save space/RAM):
   ```bash
   export PUPPETEER_SKIP_DOWNLOAD=true
   npm install
   ```
   *Note: If installation stalls, try:* `npm install --maxsockets=1`

2. Create a `.env` file with your paths and system Chromium:
   ```env
   CHROME_EXECUTABLE_PATH=/usr/bin/chromium-browser
   ```

## Usage

### Interactive Mode (Recommended)

Just run without arguments for an interactive menu:

```bash
npm start
```

Or:

```bash
node src/index.js
```

### Command Line Interface

#### Add a manga

```bash
node src/index.js add https://comix.to/title/69l6g-chained-soldier
```

#### List all bookmarks

```bash
node src/index.js list
```

#### Check for new chapters

```bash
node src/index.js check
```

#### Download chapters

```bash
# Download all chapters
node src/index.js download <bookmark-id> --all

# Download only new chapters
node src/index.js download <bookmark-id> --new

# Download specific chapters
node src/index.js download <bookmark-id> --chapters "1-10,15,20-25"
```

#### Rename/Alias a manga

```bash
node src/index.js rename <bookmark-id> "Chained Soldier (English)"
```

#### Remove a bookmark

```bash
node src/index.js remove <bookmark-id>
```

## Project Structure

```
manga-scraper/
├── src/
│   ├── index.js          # Main entry point & CLI
│   ├── config.js         # Configuration settings
│   ├── bookmarks.js      # Bookmark management
│   ├── downloader.js     # Image downloading
│   └── scrapers/
│       ├── index.js      # Scraper factory
│       ├── base.js       # Base scraper class
│       └── comix.js      # comix.to scraper
├── data/
│   └── bookmarks.json    # Stored bookmarks
├── downloads/            # Downloaded manga chapters
└── package.json
```

## Adding Support for New Websites

1. Create a new scraper in `src/scrapers/` extending `BaseScraper`
2. Implement `getMangaInfo(url)` and `getChapterImages(chapterUrl)`
3. Add the scraper to the `SCRAPERS` array in `src/scrapers/index.js`

Example:

```javascript
import { BaseScraper } from './base.js';

export class NewSiteScraper extends BaseScraper {
  get websiteName() {
    return 'newsite.com';
  }

  get urlPatterns() {
    return ['newsite.com'];
  }

  async getMangaInfo(url) {
    // Implementation
  }

  async getChapterImages(chapterUrl) {
    // Implementation
  }
}
```

## Configuration

Edit `src/config.js` to customize:

- Download directories
- Request delays (to avoid rate limiting)
- Puppeteer settings
- Retry settings

## Data Storage

- **Bookmarks**: Stored in `data/bookmarks.json`
- **Downloads**: Saved in `downloads/<manga-name>/Chapter XXXX/`

## Tips

1. **Avoid rate limiting**: The scraper has built-in delays between requests. Adjust in `config.js` if needed.

2. **Multiple versions**: Use aliases to track the same manga from different sources (e.g., English and Raw):
   - Add the English version and rename it to "Manga Name (English)"
   - Add the Raw version and rename it to "Manga Name (Raw)"

3. **Resume downloads**: The downloader skips already downloaded images, so you can safely resume interrupted downloads.

## License

MIT
