// Generates one markdown file per book in data/books/, from data/seedBooks.json.
// Run once (or whenever seedBooks.json changes) to sync the editable catalog:
//   node scripts/generate-md.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'data', 'seedBooks.json');
const outDir = join(root, 'data', 'books');

if (!existsSync(src)) {
  console.error(`Missing ${src}`);
  process.exit(1);
}

const books = JSON.parse(readFileSync(src, 'utf8'));

mkdirSync(outDir, { recursive: true });

const quote = value => `"${String(value).replace(/"/g, '\\"')}"`;

for (const book of books) {
  const lines = [
    '---',
    `accession: ${quote(book.accessionNumber)}`,
    `title: ${quote(book.title)}`,
    `authors: ${quote(book.authors || '')}`,
    `subject: ${book.subjectCode}`,
    `publisher: ${quote(book.publisher || '')}`,
    `year: ${book.year || 0}`,
    `isbn: ${quote(book.isbn || '')}`,
    `copies: ${book.copies || 1}`,
    `keywords: ${quote(book.keywords || '')}`,
    '---',
  ];

  const body = (book.remarks || '').trim();
  if (body) lines.push('', body);

  writeFileSync(join(outDir, `${book.accessionNumber}.md`), lines.join('\n') + '\n');
}

console.log(`Wrote ${books.length} markdown files to ${outDir}`);