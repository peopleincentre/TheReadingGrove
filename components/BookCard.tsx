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
      className={`
        h-full w-full text-left
        ${subject.cardGradient}
        border border-white/10
        rounded-lg shadow-md hover:shadow-lg
        transition-all duration-200 ease-in-out
        hover:-translate-y-0.5
        p-3 md:p-4 flex flex-col gap-1.5
        focus:outline-none focus:ring-2 focus:ring-white/60
      `}
      aria-label={`View details for book: ${book.title}`}
      title={book.title}
    >
      <h3 className="text-base md:text-lg font-bold text-white leading-snug line-clamp-3">
        {book.title}
      </h3>

      <p className="text-xs md:text-sm text-white/85 line-clamp-2">
        {book.authors || 'Unknown author'}
      </p>

      <div className="mt-auto pt-1.5 space-y-1 text-[11px] md:text-xs text-white/70">
        <p className="line-clamp-1">{publisherLine}</p>
        {book.isbn && <p className="line-clamp-1">ISBN: {book.isbn}</p>}
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {keywords.map(kw => (
            <span
              key={kw}
              className="px-1.5 py-px rounded bg-white/20 text-white text-[10px] md:text-xs line-clamp-1"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </button>
  );
};

export default BookCard;