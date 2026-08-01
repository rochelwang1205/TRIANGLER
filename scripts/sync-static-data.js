import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(__dirname, '../server/db.json');
const targetDir = path.join(__dirname, '../public/data');
const target = path.join(targetDir, 'db.json');

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);
console.log(`Synced static data → ${target}`);
