// Regenerates data/seedBooks.json from the per-book markdown files in
// data/books/. The markdown files are the source of truth; this script
// runs automatically before every build.
//   node scripts/generate-json.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const booksDir = join(root, 'data', 'books');
const outFile = join(root, 'data', 'seedBooks.json');

function parseMarkdown(raw) {
  const lines = raw.split(/\r?\n/);
  if (!lines.length || lines[0].trim() !== '---') {
    throw new Error('Missing opening frontmatter delimiter');
  }
  const fm = {};
  let i = 1;
  for (; i < lines.length; i++) {
    if (lines[i].trim() === '---') break;
    const m = lines[i].match(/^([A-Za-z]+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].replace(/^"|"$/g, '').replace(/\\"/g, '"').trim();
  }
  const body = lines.slice(i + 1).join('\n').trim();
  return { fm, body };
}

const toInt = value => {
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : 0;
};

const files = readdirSync(booksDir).filter(f => f.endsWith('.md'));
const books = files
  .map(file => {
    const raw = readFileSync(join(booksDir, file), 'utf8');
    const { fm, body } = parseMarkdown(raw);

    if (!fm.title) {
      throw new Error(`Missing title in ${file}`);
    }

    const remarks = (body || fm.remarks || '').trim();

    return {
      id: String(fm.accession || file.replace(/\.md$/, '')),
      accessionNumber: String(fm.accession || file.replace(/\.md$/, '')),
      title: fm.title,
      authors: fm.authors || '',
      subjectCode: fm.subject || '',
      keywords: fm.keywords || '',
      publisher: fm.publisher || '',
      year: toInt(fm.year),
      isbn: fm.isbn || '',
      copies: toInt(fm.copies) || 1,
      remarks,
    };
  })
  .sort((a, b) => Number(a.accessionNumber) - Number(b.accessionNumber));

writeFileSync(outFile, JSON.stringify(books, null, 2) + '\n');
console.log(`Wrote ${books.length} books to ${outFile}`);