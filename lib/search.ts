import { Book, Subject } from '../types';

export interface BookFilters {
  q: string; // General search across all fields
  title: string;
  author: string;
  publisher: string;
  keyword: string;
  subjectCode: string | null;
}

export const EMPTY_FILTERS: BookFilters = {
  q: '',
  title: '',
  author: '',
  publisher: '',
  keyword: '',
  subjectCode: null,
};

const lower = (value: string | null | undefined): string => (value || '').toLowerCase();

const matches = (haystack: string, needle: string): boolean =>
  needle === '' || lower(haystack).includes(lower(needle));

/**
 * Returns books matching the given filters. Matching is case-insensitive and
 * substring-based; every non-empty filter must match (AND), and `q` matches
 * across all searchable metadata fields.
 */
export function filterBooks(books: Book[], filters: BookFilters, subjects: Subject[]): Book[] {
  const { q, title, author, publisher, keyword, subjectCode } = filters;

  return books.filter(book => {
    if (subjectCode && book.subjectCode !== subjectCode) return false;
    if (!matches(book.title, title)) return false;
    if (!matches(book.authors, author)) return false;
    if (!matches(book.publisher, publisher)) return false;
    if (!matches(book.keywords, keyword)) return false;

    if (q) {
      const haystack = [
        book.title,
        book.authors,
        book.keywords,
        book.publisher,
        book.accessionNumber,
        book.isbn,
        subjectName(book, subjects),
      ]
        .filter(Boolean)
        .join(' ');
      if (!matches(haystack, q)) return false;
    }

    return true;
  });
}

function subjectName(book: Book, subjects: Subject[]): string {
  return subjects.find(s => s.code === book.subjectCode)?.name || '';
}
