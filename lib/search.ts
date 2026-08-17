import { Book, Subject } from '../types';

export interface SearchOptions {
  term: string;
  subjects: Subject[];
}

/**
 * Returns books matching `term` across all searchable metadata fields:
 * title, authors, keywords, publisher, subject name, accession number, and ISBN.
 * Matching is case-insensitive and substring-based.
 */
export function searchBooks(books: Book[], options: SearchOptions): Book[] {
  const term = options.term.trim().toLowerCase();
  if (!term) return books;

  return books.filter(book => {
    const haystack = [
      book.title,
      book.authors,
      book.keywords,
      book.publisher,
      book.accessionNumber,
      book.isbn,
      subjectName(book, options.subjects),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  });
}

function subjectName(book: Book, subjects: Subject[]): string {
  return subjects.find(s => s.code === book.subjectCode)?.name || '';
}