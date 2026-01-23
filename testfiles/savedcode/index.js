import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { scraperFactory } from './scrapers/index.js';
import { bookmarkManager } from './bookmarks.js';
import { downloader } from './downloader.js';
import { CONFIG } from './config.js';

const program = new Command();

// Initialize components
async function init() {
  await scraperFactory.init();
}

// Cleanup
async function cleanup() {
  await scraperFactory.close();
}

// Add a new manga bookmark
async function addManga(url) {
  const spinner = ora('Fetching manga info...').start();

  try {
    const scraper = scraperFactory.getScraperForUrl(url);
    if (!scraper) {
      spinner.fail(`No scraper found for URL: ${url}`);
      console.log(chalk.yellow('\nSupported websites:'));
      scraperFactory.getSupportedWebsites().forEach(site => {
        console.log(chalk.gray(`  - ${site}`));
      });
      return;
    }

    const mangaInfo = await scraper.getMangaInfo(url);
    spinner.succeed(`Found: ${chalk.cyan(mangaInfo.title)}`);

    console.log(chalk.gray(`  Website: ${mangaInfo.website}`));
    console.log(chalk.gray(`  Chapters: ${mangaInfo.totalChapters}`));

    const result = await bookmarkManager.add(mangaInfo);
    
    if (result.success) {
      console.log(chalk.green(`\n✓ Manga bookmarked successfully!`));
      console.log(chalk.gray(`  ID: ${result.bookmark.id}`));
    } else {
      console.log(chalk.yellow(`\n${result.message}`));
    }

    // Ask if user wants to set an alias
    const { setAlias } = await inquirer.prompt([{
      type: 'confirm',
      name: 'setAlias',
      message: 'Do you want to set a custom name (alias) for this manga?',
      default: false
    }]);

    if (setAlias) {
      const { alias } = await inquirer.prompt([{
        type: 'input',
        name: 'alias',
        message: 'Enter alias:',
        validate: input => input.trim().length > 0 || 'Alias cannot be empty'
      }]);

      await bookmarkManager.setAlias(result.bookmark.id, alias.trim());
      console.log(chalk.green(`✓ Alias set to: ${alias.trim()}`));
    }

    return result.bookmark;

  } catch (error) {
    spinner.fail(`Failed to fetch manga info`);
    console.error(chalk.red(error.message));
  }
}

// List all bookmarks
async function listBookmarks() {
  const bookmarks = await bookmarkManager.getAll();

  if (bookmarks.length === 0) {
    console.log(chalk.yellow('\nNo bookmarks yet. Add one with: manga-scraper add <url>'));
    return;
  }

  console.log(chalk.cyan(`\n📚 Your Manga Bookmarks (${bookmarks.length}):\n`));

  for (const b of bookmarks) {
    const displayName = bookmarkManager.getDisplayName(b);
    const hasAlias = b.alias ? chalk.gray(` (Original: ${b.title})`) : '';
    
    console.log(chalk.white.bold(`  ${displayName}${hasAlias}`));
    console.log(chalk.gray(`    ID: ${b.id}`));
    console.log(chalk.gray(`    Website: ${b.website}`));
    console.log(chalk.gray(`    Chapters: ${b.totalChapters}`));
    console.log(chalk.gray(`    Downloaded: ${b.downloadedChapters.length}`));
    console.log(chalk.gray(`    Last checked: ${new Date(b.lastChecked).toLocaleString()}`));
    console.log();
  }
}

// Check for updates on all bookmarks
async function checkUpdates() {
  const bookmarks = await bookmarkManager.getAll();

  if (bookmarks.length === 0) {
    console.log(chalk.yellow('\nNo bookmarks to check.'));
    return;
  }

  console.log(chalk.cyan(`\n🔍 Checking ${bookmarks.length} bookmarked manga for updates...\n`));

  const updates = [];

  for (const bookmark of bookmarks) {
    const displayName = bookmarkManager.getDisplayName(bookmark);
    const spinner = ora(`Checking ${displayName}...`).start();

    try {
      const scraper = scraperFactory.getScraperForUrl(bookmark.url);
      if (!scraper) {
        spinner.warn(`No scraper for ${bookmark.website}`);
        continue;
      }

      const mangaInfo = await scraper.getMangaInfo(bookmark.url);
      const newChapters = mangaInfo.totalChapters - bookmark.totalChapters;

      if (newChapters > 0) {
        spinner.succeed(`${displayName}: ${chalk.green(`+${newChapters} new chapters!`)} (${bookmark.totalChapters} → ${mangaInfo.totalChapters})`);
        updates.push({
          bookmark,
          oldCount: bookmark.totalChapters,
          newCount: mangaInfo.totalChapters,
          newChapters
        });
      } else {
        spinner.succeed(`${displayName}: ${chalk.gray('No new chapters')}`);
      }

      // Update the bookmark with new chapter count
      await bookmarkManager.updateChapterCount(
        bookmark.id,
        mangaInfo.totalChapters,
        mangaInfo.chapters
      );

      // Delay between checks
      await new Promise(r => setTimeout(r, CONFIG.delays.betweenPages));

    } catch (error) {
      spinner.fail(`${displayName}: ${chalk.red('Failed to check')}`);
      console.error(chalk.gray(`    ${error.message}`));
    }
  }

  // Summary
  console.log(chalk.cyan('\n📊 Summary:'));
  if (updates.length > 0) {
    console.log(chalk.green(`  ${updates.length} manga with new chapters:`));
    for (const u of updates) {
      const name = bookmarkManager.getDisplayName(u.bookmark);
      console.log(chalk.white(`    - ${name}: +${u.newChapters} chapters`));
    }
  } else {
    console.log(chalk.gray('  No new chapters found.'));
  }
}

// Download chapters
async function downloadChapters(bookmarkId, options = {}) {
  const bookmark = await bookmarkManager.getById(bookmarkId);
  
  if (!bookmark) {
    console.log(chalk.red(`Bookmark not found: ${bookmarkId}`));
    return;
  }

  const displayName = bookmarkManager.getDisplayName(bookmark);
  console.log(chalk.cyan(`\n📥 Download: ${displayName}`));
  console.log(chalk.gray(`   Website: ${bookmark.website}`));
  console.log(chalk.gray(`   Total chapters: ${bookmark.totalChapters}`));

  // Determine which chapters to download
  let chaptersToDownload = [];

  if (options.all) {
    chaptersToDownload = bookmark.chapters.map(c => c.number);
  } else if (options.chapters) {
    // Parse chapter range (e.g., "1-10" or "1,2,3,5")
    chaptersToDownload = parseChapterRange(options.chapters, bookmark.totalChapters);
  } else if (options.new) {
    // Download only new (not yet downloaded) chapters
    const downloaded = bookmark.downloadedChapters;
    chaptersToDownload = bookmark.chapters
      .map(c => c.number)
      .filter(n => !downloaded.includes(n));
  } else {
    // Interactive selection
    const { selection } = await inquirer.prompt([{
      type: 'list',
      name: 'selection',
      message: 'What would you like to download?',
      choices: [
        { name: 'All chapters', value: 'all' },
        { name: 'New chapters only', value: 'new' },
        { name: 'Specific range (e.g., 1-10)', value: 'range' },
        { name: 'Cancel', value: 'cancel' }
      ]
    }]);

    if (selection === 'cancel') return;

    if (selection === 'all') {
      chaptersToDownload = bookmark.chapters.map(c => c.number);
    } else if (selection === 'new') {
      const downloaded = bookmark.downloadedChapters;
      chaptersToDownload = bookmark.chapters
        .map(c => c.number)
        .filter(n => !downloaded.includes(n));
    } else if (selection === 'range') {
      const { range } = await inquirer.prompt([{
        type: 'input',
        name: 'range',
        message: 'Enter chapter range (e.g., 1-10, 15, 20-25):',
        validate: input => input.trim().length > 0 || 'Please enter a range'
      }]);
      chaptersToDownload = parseChapterRange(range, bookmark.totalChapters);
    }
  }

  if (chaptersToDownload.length === 0) {
    console.log(chalk.yellow('\nNo chapters to download.'));
    return;
  }

  console.log(chalk.gray(`\nDownloading ${chaptersToDownload.length} chapters...`));

  const scraper = scraperFactory.getScraperForUrl(bookmark.url);
  if (!scraper) {
    console.log(chalk.red(`No scraper available for ${bookmark.website}`));
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const chapterNum of chaptersToDownload) {
    const chapter = bookmark.chapters.find(c => c.number === chapterNum);
    if (!chapter) {
      console.log(chalk.yellow(`  Chapter ${chapterNum} not found`));
      continue;
    }

    // Check if already downloaded
    if (await downloader.isChapterDownloaded(bookmark.title, chapterNum, bookmark.alias)) {
      console.log(chalk.gray(`  Chapter ${chapterNum}: Already downloaded, skipping`));
      continue;
    }

    const spinner = ora(`Chapter ${chapterNum}: Fetching images...`).start();

    try {
      const images = await scraper.getChapterImages(chapter.url);
      spinner.text = `Chapter ${chapterNum}: Downloading ${images.length} images...`;

      const result = await downloader.downloadChapter(
        bookmark.title,
        chapterNum,
        images,
        bookmark.alias,
        (current, total, status) => {
          spinner.text = `Chapter ${chapterNum}: ${current}/${total} images (${status})`;
        }
      );

      await bookmarkManager.markChapterDownloaded(bookmark.id, chapterNum);
      spinner.succeed(`Chapter ${chapterNum}: ${result.success} downloaded, ${result.skipped} skipped`);
      successCount++;

      // Delay between chapters
      await new Promise(r => setTimeout(r, CONFIG.delays.betweenChapters));

    } catch (error) {
      spinner.fail(`Chapter ${chapterNum}: Failed - ${error.message}`);
      failCount++;
    }
  }

  console.log(chalk.cyan('\n📊 Download complete:'));
  console.log(chalk.green(`  ✓ ${successCount} chapters downloaded`));
  if (failCount > 0) {
    console.log(chalk.red(`  ✗ ${failCount} chapters failed`));
  }
}

// Parse chapter range string
function parseChapterRange(rangeStr, maxChapter) {
  const chapters = new Set();
  const parts = rangeStr.split(',').map(p => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()));
      for (let i = start; i <= Math.min(end, maxChapter); i++) {
        chapters.add(i);
      }
    } else {
      const num = parseInt(part);
      if (!isNaN(num) && num <= maxChapter) {
        chapters.add(num);
      }
    }
  }

  return Array.from(chapters).sort((a, b) => a - b);
}

// Rename/set alias for a bookmark
async function renameBookmark(bookmarkId, newAlias) {
  const bookmark = await bookmarkManager.getById(bookmarkId);
  
  if (!bookmark) {
    console.log(chalk.red(`Bookmark not found: ${bookmarkId}`));
    return;
  }

  const oldName = bookmarkManager.getDisplayName(bookmark);
  await bookmarkManager.setAlias(bookmark.id, newAlias);
  
  console.log(chalk.green(`✓ Renamed "${oldName}" to "${newAlias}"`));
  console.log(chalk.gray(`  Original title preserved: ${bookmark.title}`));
}

// Remove a bookmark
async function removeBookmark(bookmarkId) {
  const bookmark = await bookmarkManager.getById(bookmarkId);
  
  if (!bookmark) {
    console.log(chalk.red(`Bookmark not found: ${bookmarkId}`));
    return;
  }

  const displayName = bookmarkManager.getDisplayName(bookmark);
  
  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: `Are you sure you want to remove "${displayName}"?`,
    default: false
  }]);

  if (confirm) {
    await bookmarkManager.remove(bookmarkId);
    console.log(chalk.green(`✓ Removed: ${displayName}`));
  } else {
    console.log(chalk.gray('Cancelled'));
  }
}

// Interactive menu
async function interactiveMenu() {
  while (true) {
    console.log(chalk.cyan('\n📚 Manga Scraper\n'));

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '➕ Add new manga', value: 'add' },
        { name: '📋 List bookmarks', value: 'list' },
        { name: '🔍 Check for updates', value: 'check' },
        { name: '📥 Download chapters', value: 'download' },
        { name: '✏️  Rename manga', value: 'rename' },
        { name: '🗑️  Remove bookmark', value: 'remove' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }]);

    if (action === 'exit') {
      console.log(chalk.gray('Goodbye! 👋'));
      break;
    }

    try {
      switch (action) {
        case 'add': {
          const { url } = await inquirer.prompt([{
            type: 'input',
            name: 'url',
            message: 'Enter manga URL:',
            validate: input => input.startsWith('http') || 'Please enter a valid URL'
          }]);
          await addManga(url);
          break;
        }

        case 'list':
          await listBookmarks();
          break;

        case 'check':
          await checkUpdates();
          break;

        case 'download': {
          const bookmarks = await bookmarkManager.getAll();
          if (bookmarks.length === 0) {
            console.log(chalk.yellow('\nNo bookmarks yet.'));
            break;
          }

          const { selectedId } = await inquirer.prompt([{
            type: 'list',
            name: 'selectedId',
            message: 'Select manga to download:',
            choices: bookmarks.map(b => ({
              name: `${bookmarkManager.getDisplayName(b)} (${b.totalChapters} chapters)`,
              value: b.id
            }))
          }]);

          await downloadChapters(selectedId);
          break;
        }

        case 'rename': {
          const bookmarks = await bookmarkManager.getAll();
          if (bookmarks.length === 0) {
            console.log(chalk.yellow('\nNo bookmarks yet.'));
            break;
          }

          const { selectedId } = await inquirer.prompt([{
            type: 'list',
            name: 'selectedId',
            message: 'Select manga to rename:',
            choices: bookmarks.map(b => ({
              name: bookmarkManager.getDisplayName(b),
              value: b.id
            }))
          }]);

          const { newName } = await inquirer.prompt([{
            type: 'input',
            name: 'newName',
            message: 'Enter new name:',
            validate: input => input.trim().length > 0 || 'Name cannot be empty'
          }]);

          await renameBookmark(selectedId, newName.trim());
          break;
        }

        case 'remove': {
          const bookmarks = await bookmarkManager.getAll();
          if (bookmarks.length === 0) {
            console.log(chalk.yellow('\nNo bookmarks yet.'));
            break;
          }

          const { selectedId } = await inquirer.prompt([{
            type: 'list',
            name: 'selectedId',
            message: 'Select manga to remove:',
            choices: bookmarks.map(b => ({
              name: bookmarkManager.getDisplayName(b),
              value: b.id
            }))
          }]);

          await removeBookmark(selectedId);
          break;
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  }
}

// Setup CLI commands
program
  .name('manga-scraper')
  .description('Manga scraper with bookmark management')
  .version('1.0.0');

program
  .command('add <url>')
  .description('Add a new manga bookmark')
  .action(async (url) => {
    await init();
    await addManga(url);
    await cleanup();
  });

program
  .command('list')
  .description('List all bookmarked manga')
  .action(async () => {
    await listBookmarks();
  });

program
  .command('check')
  .description('Check all bookmarks for new chapters')
  .action(async () => {
    await init();
    await checkUpdates();
    await cleanup();
  });

program
  .command('download <id>')
  .description('Download chapters for a bookmarked manga')
  .option('-a, --all', 'Download all chapters')
  .option('-n, --new', 'Download only new chapters')
  .option('-c, --chapters <range>', 'Download specific chapters (e.g., 1-10,15,20-25)')
  .action(async (id, options) => {
    await init();
    await downloadChapters(id, options);
    await cleanup();
  });

program
  .command('rename <id> <name>')
  .description('Set an alias for a bookmarked manga')
  .action(async (id, name) => {
    await renameBookmark(id, name);
  });

program
  .command('remove <id>')
  .description('Remove a bookmark')
  .action(async (id) => {
    await removeBookmark(id);
  });

program
  .command('interactive')
  .alias('i')
  .description('Start interactive menu')
  .action(async () => {
    await init();
    await interactiveMenu();
    await cleanup();
  });

// Default to interactive mode if no command given
if (process.argv.length <= 2) {
  (async () => {
    await init();
    await interactiveMenu();
    await cleanup();
  })();
} else {
  program.parse();
}
