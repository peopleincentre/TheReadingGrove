import { Book } from '../types';
import { BORROW_EMAIL } from '../constants';

/**
 * Builds a mailto: link that lets a visitor request a book.
 * The subject line is fixed ("The Reading Grove") and the body is
 * pre-filled with the book's details plus editable fields for the sender,
 * so they can add their name, contact details, and a message in their own
 * mail client before sending.
 */
export function buildBorrowMailto(book: Book, subjectName: string): string {
  const subject = 'The Reading Grove';

  const body = [
    'Hi,',
    '',
    'I would like to borrow the following book from The Reading Grove:',
    '',
    `Title: ${book.title}`,
    `Accession No: ${book.accessionNumber}`,
    `Author(s): ${book.authors || 'N/A'}`,
    `Subject: ${subjectName || 'N/A'}`,
    `Publisher: ${book.publisher || 'N/A'}${book.year ? ` (${book.year})` : ''}`,
    `ISBN: ${book.isbn || 'N/A'}`,
    '',
    'My name:',
    'My contact / email:',
    '',
    'Your message:',
  ].join('\n');

  const params = new URLSearchParams({ subject, body });
  return `mailto:${BORROW_EMAIL}?${params.toString()}`;
}