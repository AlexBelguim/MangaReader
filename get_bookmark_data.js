import { bookmarkDb } from './src/database.js';

const id = 'mkrg10ir44fnray51sb';
const b = bookmarkDb.getById(id);
console.log(JSON.stringify(b, null, 2));
