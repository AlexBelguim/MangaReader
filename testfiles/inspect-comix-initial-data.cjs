const fs = require('fs');
const html = fs.readFileSync('testfiles/comix-page-full.html', 'utf8');
const m = html.match(/<script type="application\/json" id="initial-data">(.*?)<\/script>/s);
if (!m) { console.log('no initial-data'); process.exit(1); }
const data = JSON.parse(m[1]);
console.log('top-level keys:', Object.keys(data));
console.log('page:', data.page);
const q = data.queries || {};
for (const key of Object.keys(q)) {
  const val = q[key];
  const summary = JSON.stringify(val);
  console.log('\nQUERY KEY:', key);
  console.log('value length:', summary.length);
  console.log(summary.slice(0, 1500));
}
