# Manga Scraper - Copilot Instructions

This is a Node.js Puppeteer-based manga scraper application.

## Project Overview

- **Language**: JavaScript (ES Modules)
- **Runtime**: Node.js
- **Main Dependencies**: puppeteer, commander, chalk, ora, inquirer, fs-extra

## Key Files

- `src/index.js` - Main CLI entry point with interactive menu
- `src/config.js` - Configuration settings
- `src/bookmarks.js` - Bookmark management (CRUD operations)
- `src/downloader.js` - Image downloading functionality
- `src/scrapers/base.js` - Base scraper class
- `src/scrapers/comix.js` - comix.to website scraper
- `src/scrapers/index.js` - Scraper factory

## Adding New Website Scrapers

1. Create a new file in `src/scrapers/` extending `BaseScraper`
2. Implement `websiteName`, `urlPatterns`, `getMangaInfo()`, and `getChapterImages()`
3. Add the scraper class to the `SCRAPERS` array in `src/scrapers/index.js`

## Bookmark Structure

```javascript
{
  id: string,
  url: string,
  title: string,
  alias: string | null,  // Custom name for the manga
  website: string,       // Which website it's from
  totalChapters: number,
  chapters: Array<{ number, title, url }>,
  lastChecked: string,   // ISO date
  downloadedChapters: number[],
  createdAt: string,
  updatedAt: string
}
```

## Common Commands

- `npm start` - Run interactive mode
- `node src/index.js add <url>` - Add manga
- `node src/index.js check` - Check for updates
- `node src/index.js download <id> --all` - Download chapters
