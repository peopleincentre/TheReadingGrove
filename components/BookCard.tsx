import React from 'react';
import { Book, Subject } from '../types';

interface BookCardProps {
  book: Book;
  subject: Subject;
  onSelect: (book: Book) => void;
}

const MAX_KEYWORDS = 3;

const BookCard: React.FC<BookCardProps> = ({ book, subject, onSelect }) => {
  const keywords = (book.keywords || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean)
    .slice(0, MAX_KEYWORDS);

  const copiesText = `${book.copies} ${book.copies === 1 ? 'copy' : 'copies'}`;
  const publisherLine = [book.publisher, book.year ? String(book.year) : '', copiesText]
    .filter(Boolean)
    .join(' · ') || 'N/A';

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      style={{
        backgroundImage: `linear-gradient(to bottom, ${subject.cardGradientFrom}, ${subject.cardGradientTo})`,
      }}
      className={`
        h-full w-full text-left flex flex-col
        border border-slate-200 dark:border-slate-700
        rounded-lg shadow-sm hover:shadow-md overflow-hidden
        transition-all duration-200 ease-in-out
        hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      `}
      aria-label={`View details for book: ${book.title}`}
      title={book.title}
    >
      <div className="h-1 shrink-0" style={{ backgroundColor: subject.accentColor }} />

      <div className="p-3 md:p-4 flex flex-col gap-1.5">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-3">
          {book.title}
        </h3>

        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
          {book.authors || 'Unknown author'}
        </p>

        <div className="mt-auto pt-1.5 space-y-1 text-[11px] md:text-xs text-slate-500 dark:text-slate-400">
          <p className="line-clamp-1">{publisherLine}</p>
          {book.isbn && <p className="line-clamp-1">ISBN: {book.isbn}</p>}
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {keywords.map(kw => (
              <span
                key={kw}
                className="px-1.5 py-px rounded bg-white/70 text-slate-700 text-[10px] md:text-xs line-clamp-1"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
};

export default BookCard;