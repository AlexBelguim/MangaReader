import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setCookie({ name: 'isAdult', value: '1', domain: '.mangahere.cc' });
await page.goto('https://www.mangahere.cc/manga/one_piece/v98/c1186/1.html', { waitUntil: 'networkidle2', timeout: 60000 });

const out = await page.evaluate(async () => {
  const results = {};
  // Attempt 1: plain relative fetch
  try {
    const r = await fetch('chapterfun.ashx?cid=1705877&page=1&key=', { credentials: 'include' });
    const t = await r.text();
    results.plain = { status: r.status, len: t.length, head: t.slice(0, 80) };
  } catch (e) { results.plain = { error: String(e) }; }
  // Attempt 2: with XHR header
  try {
    const r = await fetch('chapterfun.ashx?cid=1705877&page=1&key=', {
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    const t = await r.text();
    results.xhr = { status: r.status, len: t.length, head: t.slice(0, 80) };
    // Attempt eval
    try {
      const d = eval(t + '\n;d');
      results.eval = Array.isArray(d) ? d : String(d).slice(0, 100);
    } catch (e) { results.eval = 'EVAL ERR: ' + String(e); }
  } catch (e) { results.xhr = { error: String(e) }; }
  results.chapterid = window.chapterid;
  return results;
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
