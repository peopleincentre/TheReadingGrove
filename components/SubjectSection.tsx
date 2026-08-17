import React, { useEffect, useState } from 'react';
import { Book, Subject } from '../types';
import BookCard from './BookCard';

interface SubjectSectionProps {
  subject: Subject;
  books: Book[];
  onSelect: (book: Book) => void;
}

const INITIAL_CARDS = 24;

const SubjectSection: React.FC<SubjectSectionProps> = ({ subject, books, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  // Reset expansion whenever the visible book set changes (e.g. a search filter).
  useEffect(() => {
    setExpanded(false);
  }, [books]);

  const visibleBooks = expanded ? books : books.slice(0, INITIAL_CARDS);
  const hasMore = books.length > visibleBooks.length;

  return (
    <section className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-bold text-white shadow-sm ${subject.cardColor}`}>
          {subject.name}
        </h2>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {visibleBooks.map(book => (
          <BookCard key={book.id} book={book} subject={subject} onSelect={onSelect} />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
        >
          <span className="material-symbols-outlined text-lg">
            {expanded ? 'unfold_less' : 'unfold_more'}
          </span>
          {expanded ? 'Show less' : `Show all ${books.length} books`}
        </button>
      )}
    </section>
  );
};

export default SubjectSection;