import React from 'react';
import { Book, Subject } from '../types';
import BookSpine from './BookSpine';

interface ShelfProps {
  subject: Subject;
  books: Book[];
  onSelect: (book: Book) => void;
}

const Shelf: React.FC<ShelfProps> = ({ subject, books, onSelect }) => {
  return (
    <section className="relative">
      {/* Shelf label placard */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-bold text-white shadow-sm ${subject.cardColor}`}>
          {subject.name}
        </h2>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      {/* Books standing on a wooden shelf bar */}
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex flex-col min-w-full">
          <div className="flex items-end gap-1 px-3 pt-4">
            {books.map(book => (
              <BookSpine key={book.id} book={book} subject={subject} onSelect={onSelect} />
            ))}
          </div>
          <div
            className="mx-3 -mt-1 h-4 rounded shadow-md"
            style={{
              background: 'linear-gradient(to bottom, #d19a54 0%, #b07a3a 45%, #8a5a26 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 3px 6px rgba(0,0,0,0.35)',
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Shelf;