import { bookmarkDb } from './src/database.js';

const id = 'miqvd14iq0krsfkusod';
const b = bookmarkDb.getById(id);

if (b) {
    console.log(JSON.stringify(b, null, 2));
} else {
    console.log('Bookmark not found');
}
