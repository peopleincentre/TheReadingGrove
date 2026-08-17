import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Book, Subject } from '../types';
import BookSpine from './BookSpine';

interface ShelfProps {
  subject: Subject;
  books: Book[];
  onSelect: (book: Book) => void;
}

const SPINE_WIDTH = 40; // w-10
const SPINE_GAP = 4; // gap-1
const ROW_PADDING = 24; // px-3 on each side
const ROWS_TO_SHOW = 2; // default visible rows before expanding
const DEFAULT_PER_ROW = 8;

function booksPerRowForWidth(width: number): number {
  const usable = width - ROW_PADDING;
  return Math.max(1, Math.floor((usable + SPINE_GAP) / (SPINE_WIDTH + SPINE_GAP)));
}

const Shelf: React.FC<ShelfProps> = ({ subject, books, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [booksPerRow, setBooksPerRow] = useState(DEFAULT_PER_ROW);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure the container width and split books into rows that fit, so the
  // number of shelves adapts to the screen size (no horizontal scrolling).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setBooksPerRow(booksPerRowForWidth(el.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset expansion whenever the visible book set changes (e.g. a search filter).
  useEffect(() => {
    setExpanded(false);
  }, [books]);

  const visibleBooks = expanded ? books : books.slice(0, booksPerRow * ROWS_TO_SHOW);

  const rows: Book[][] = [];
  for (let i = 0; i < visibleBooks.length; i += booksPerRow) {
    rows.push(visibleBooks.slice(i, i + booksPerRow));
  }

  const barBg = subject.borderColor.replace('border-', 'bg-');
  const hasMore = books.length > visibleBooks.length;

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

      <div ref={containerRef} className="space-y-3">
        {rows.map((rowBooks, rowIndex) => (
          <div key={rowIndex}>
            <div className="flex items-end gap-1 px-3">
              {rowBooks.map(book => (
                <BookSpine key={book.id} book={book} subject={subject} onSelect={onSelect} />
              ))}
            </div>
            {/* Shelf bar under each row, in the category color */}
            <div
              className={`mx-3 -mt-px h-4 rounded shadow-md ${barBg}`}
              style={{
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 3px 6px rgba(0,0,0,0.35)',
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(0,0,0,0.22))',
              }}
            ></div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
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

export default Shelf;