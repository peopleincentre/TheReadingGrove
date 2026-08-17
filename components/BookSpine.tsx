import React from 'react';
import { Book, Subject } from '../types';
import { BOOK_SPINE_COLORS, BOOK_SPINE_HEIGHTS } from '../constants';

interface BookSpineProps {
  book: Book;
  subject: Subject;
  onSelect: (book: Book) => void;
}

// Pick a font size class based on title length so longer titles shrink to fit.
function titleFontClass(len: number): string {
  if (len <= 12) return 'text-sm';
  if (len <= 20) return 'text-xs';
  if (len <= 34) return 'text-[10px]';
  return 'text-[9px]';
}

// Rough vertical line height of one character for the selected font size.
function charHeightPx(fontClass: string): number {
  switch (fontClass) {
    case 'text-sm': return 17;
    case 'text-xs': return 15;
    case 'text-[10px]': return 12;
    default: return 11;
  }
}

// Truncate the title so it never overflows the spine, appending an ellipsis.
function fitTitle(title: string, heightPx: number, fontClass: string): string {
  const available = heightPx - 20; // room for the top cap and bottom base strip
  const maxChars = Math.max(4, Math.floor(available / charHeightPx(fontClass)));
  if (title.length <= maxChars) return title;
  return title.slice(0, maxChars - 1).trimEnd() + '…';
}

const BookSpine: React.FC<BookSpineProps> = ({ book, subject, onSelect }) => {
  // Deterministic but varied color and height so each shelf looks like a real library
  const spineColorIndex = (book.title.charCodeAt(0) + book.title.length) % BOOK_SPINE_COLORS.length;
  const spineColorClass = BOOK_SPINE_COLORS[spineColorIndex];

  const heightIndex = (book.title.charCodeAt(1) || 0) % BOOK_SPINE_HEIGHTS.length;
  const { heightClass, heightPx } = BOOK_SPINE_HEIGHTS[heightIndex];

  const fontClass = titleFontClass(book.title.length);
  const displayTitle = fitTitle(book.title, heightPx, fontClass);

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className={`
        !p-0 !w-10 !min-w-0 !rounded-t-sm !rounded-b-none
        group relative flex-shrink-0
        ${heightClass} ${spineColorClass}
        shadow-md hover:shadow-xl
        transition-all duration-200 ease-in-out
        transform hover:-translate-y-2
        z-10 hover:z-20
      `}
      aria-label={`View details for book: ${book.title}`}
      title={book.title}
    >
      {/* Top cap line (decorative, stays above the title text) */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-white/25 rounded-t-sm"></div>

      {/* Left highlight and right shadow for a 3D book edge */}
      <div className="absolute left-0 inset-y-0 w-[3px] bg-white/10"></div>
      <div className="absolute right-0 inset-y-0 w-[3px] bg-black/30"></div>

      {/* Title on the spine, truncated to fit */}
      <div className="absolute inset-0 overflow-hidden rounded-t-sm">
        <span
          className={`absolute h-full w-full left-0 top-0 text-white font-bold select-none ${fontClass}`}
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
        >
          <span className="block text-center whitespace-nowrap px-1 pt-2 pb-3">
            {displayTitle}
          </span>
        </span>
      </div>

      {/* Category color at the base of the book */}
      <div
        className={`absolute bottom-0 inset-x-0 h-3 ${subject.cardColor}`}
        style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.35), rgba(255,255,255,0.25))' }}
      ></div>

      {/* Subtle lighting effect */}
      <div className="absolute inset-0 bg-black/5 group-hover:bg-white/10 transition-colors duration-200 rounded-t-sm"></div>
    </button>
  );
};

export default BookSpine;