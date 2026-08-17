
import React from 'react';
import { Book } from '../types';
import { useLibrary } from '../context/BookContext';
import Button from './common/Button';
import { BOOK_SPINE_COLORS } from '../constants';

interface BookItemProps {
  book: Book;
  onOpenStatus: (book: Book) => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, onOpenStatus }) => {
  const { subjects } = useLibrary();
  const subject = subjects.find(s => s.code === book.subjectCode);
  
  const activeLoans = (book.borrowingHistory || []).filter(r => r.returnedDate === null).length;
  const copies = book.copies || 1;
  const allBorrowed = activeLoans >= copies;
  const available = Math.max(copies - activeLoans, 0);

  // Deterministic but varied color based on title to make the shelf more colorful
  const spineColorIndex = (book.title.charCodeAt(0) + book.title.length) % BOOK_SPINE_COLORS.length;
  const spineColorClass = BOOK_SPINE_COLORS[spineColorIndex];
  
  const subjectColorClass = subject?.cardColor || 'bg-slate-500';
  const borderColorClass = subject?.borderColor || 'border-slate-700';

  return (
    <Button
      onClick={() => onOpenStatus(book)}
      className={`
        !p-0 !h-56 !w-10 !min-w-0 !rounded-t-sm !rounded-b-none !normal-case !font-normal
        group relative flex-shrink-0
        ${spineColorClass}
        shadow-md hover:shadow-xl focus:shadow-xl
        border-b-4 ${borderColorClass}
        transition-all duration-200 ease-in-out
        transform hover:-translate-y-2 focus:-translate-y-2
        z-10 hover:z-20
        ${allBorrowed ? 'grayscale' : ''}
      `}
      aria-label={`View status for book: ${book.title}`}
    >
      {/* Container for colored parts */}
      <div className="absolute inset-0 rounded-t-sm overflow-hidden">
        {/* Subject color band at the top */}
        <div className={`h-6 w-full ${subjectColorClass}`}></div>
        {/* The rest of the space is covered by the parent Button's bg color */}
      </div>

      {/* Copies availability badge */}
      {copies > 1 && (
        <div className="absolute inset-x-0 top-0 flex justify-center pt-0.5 z-20">
          <span className={`text-[9px] leading-none font-bold px-0.5 py-px rounded-sm ${allBorrowed ? 'bg-red-600 text-white' : 'bg-black/40 text-white'}`}>
            {available}/{copies}
          </span>
        </div>
      )}
      
      {/* Title container - overlay */}
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
      
      {/* Subtle lighting effect - overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-white/10 transition-colors duration-200 rounded-t-sm"></div>
    </Button>
  );
};

export default BookItem;