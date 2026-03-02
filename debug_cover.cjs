const db = require('./src/db/connection.js').getDb();
const bms = db.prepare("SELECT id, local_cover, title, alias FROM bookmarks WHERE local_cover IS NOT NULL AND local_cover != '' LIMIT 10").all();
console.log(JSON.stringify(bms, null, 2));
