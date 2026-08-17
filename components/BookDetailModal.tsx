import React from 'react';
import { Book, Subject } from '../types';
import Modal from './common/Modal';
import { buildBorrowMailto } from '../lib/borrow';
import { BORROW_EMAIL } from '../constants';

interface BookDetailModalProps {
  book: Book;
  subject: Subject;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, subject, onClose }) => {
  const mailto = buildBorrowMailto(book, subject.name);
  const keywords = (book.keywords || '').split(',').map(k => k.trim()).filter(Boolean);

  const rows: { label: string; value: string }[] = [
    { label: 'Accession No', value: book.accessionNumber },
    { label: 'Author(s)', value: book.authors || 'N/A' },
    { label: 'Publisher', value: book.publisher || 'N/A' },
    { label: 'Year', value: book.year ? String(book.year) : 'N/A' },
    { label: 'ISBN', value: book.isbn || 'N/A' },
    { label: 'Copies', value: String(book.copies) },
  ];

  return (
    <Modal onClose={onClose} title={book.title}>
      <div className="space-y-5">
        <div>
          <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold text-white ${subject.cardColor}`}>
            {subject.name}
          </span>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {rows.map(row => (
            <div key={row.label} className="flex justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-1">
              <dt className="text-slate-500 dark:text-slate-400 font-medium">{row.label}</dt>
              <dd className="text-slate-900 dark:text-slate-100 text-right font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>

        {keywords.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map(kw => (
                <span key={kw} className="px-2 py-0.5 rounded-full text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {book.remarks && (
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Remarks</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{book.remarks}</p>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <a
            href={mailto}
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-md bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 transition-colors duration-200"
          >
            <span className="material-symbols-outlined">mail</span>
            Borrow this book
          </a>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
            Opens your email app with the book details prefilled. Add your name and message, then send to {BORROW_EMAIL}.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default BookDetailModal;