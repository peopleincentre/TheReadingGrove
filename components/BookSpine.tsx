import React from 'react';
import { Book, Subject } from '../types';
import { BOOK_SPINE_COLORS } from '../constants';

interface BookSpineProps {
  book: Book;
  subject: Subject;
  onSelect: (book: Book) => void;
}

const BookSpine: React.FC<BookSpineProps> = ({ book, subject, onSelect }) => {
  // Deterministic but varied color so each shelf looks like a real library
  const spineColorIndex = (book.title.charCodeAt(0) + book.title.length) % BOOK_SPINE_COLORS.length;
  const spineColorClass = BOOK_SPINE_COLORS[spineColorIndex];

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className={`
        !p-0 !h-56 !w-10 !min-w-0 !rounded-t-sm !rounded-b-none
        group relative flex-shrink-0
        ${spineColorClass}
        shadow-md hover:shadow-xl
        border-b-4 ${subject.borderColor}
        transition-all duration-200 ease-in-out
        transform hover:-translate-y-2
        z-10 hover:z-20
      `}
      aria-label={`View details for book: ${book.title}`}
      title={book.title}
    >
      {/* Subject color band at the top */}
      <div className={`h-6 w-full ${subject.cardColor} rounded-t-sm`}></div>

      {/* Title on the spine */}
      <div className="absolute inset-0 overflow-hidden rounded-t-sm">
        <span
          className="absolute h-full w-full left-0 top-0 text-white font-bold text-sm select-none"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
        >
          <span className="block text-center whitespace-nowrap px-1 py-2">
            {book.title}
          </span>
        </span>
      </div>

      {/* Subtle lighting effect */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-white/10 transition-colors duration-200 rounded-t-sm"></div>
    </button>
  );
};

export default BookSpine;