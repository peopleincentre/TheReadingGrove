import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Book } from '../types';
import { SUBJECTS } from '../constants';
import { filterBooks, BookFilters, EMPTY_FILTERS } from '../lib/search';
import seedBooks from '../data/seedBooks.json';
import Header from './Header';
import SearchBar from './SearchBar';
import BookCard from './BookCard';
import BookDetailModal from './BookDetailModal';

const CARDS_PER_LOAD = 60;

const Library: React.FC = () => {
  const books = useMemo(() => seedBooks as Book[], []);

  const [filters, setFilters] = useState<BookFilters>(EMPTY_FILTERS);
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_LOAD);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Read URL hash (#subject=DIS&keyword=water&author=iyer) on load and changes
  useEffect(() => {
    const parseHash = () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const next: BookFilters = {
        q: params.get('q') || '',
        title: params.get('title') || '',
        author: params.get('author') || '',
        publisher: params.get('publisher') || '',
        keyword: params.get('keyword') || '',
        subjectCode: params.get('subject'),
      };
      setFilters(next);
      setVisibleCount(CARDS_PER_LOAD);
    };
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Keep the URL hash in sync so filtered views are shareable
  useEffect(() => {
    const params = new URLSearchParams();
    (Object.keys(filters) as (keyof BookFilters)[]).forEach(key => {
      const value = filters[key];
      if (value) params.set(key === 'subjectCode' ? 'subject' : key, value);
    });

    const query = params.toString();
    const target = query ? `#${query}` : '';
    if (target) {
      if (window.location.hash !== target) {
        window.location.hash = target;
      }
    } else if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [filters]);

  const onFiltersChange = useCallback((patch: Partial<BookFilters>) => {
    setFilters(prev => ({ ...prev, ...patch }));
    setVisibleCount(CARDS_PER_LOAD);
  }, []);

  const booksBySubject = useMemo(() => {
    const map: Record<string, number> = {};
    for (const book of books) {
      map[book.subjectCode] = (map[book.subjectCode] || 0) + 1;
    }
    return map;
  }, [books]);

  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const subject of SUBJECTS) {
      counts[subject.code] = booksBySubject[subject.code] || 0;
    }
    return counts;
  }, [booksBySubject]);

  const filtered = useMemo(
    () =>
      filterBooks(books, filters, SUBJECTS).sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      ),
    [books, filters]
  );

  const visibleBooks = filtered.slice(0, visibleCount);
  const hasActiveFilters = useMemo(
    () => Object.values(filters).some(v => v !== null && v !== ''),
    [filters]
  );

  const selectedSubject =
    selectedBook && SUBJECTS.find(s => s.code === selectedBook.subjectCode);

  return (
    <div className="pb-16">
      <Header totalBooks={books.length} totalSubjects={SUBJECTS.filter(s => booksBySubject[s.code]).length} />

      <main className="container mx-auto p-4 md:p-6">
        <SearchBar filters={filters} onFiltersChange={onFiltersChange} subjects={SUBJECTS} subjectCounts={subjectCounts} />

        {hasActiveFilters && (
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            {filtered.length} {filtered.length === 1 ? 'book matches' : 'books match'} your filters
          </p>
        )}

        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {visibleBooks.map(book => {
                const subject = SUBJECTS.find(s => s.code === book.subjectCode);
                if (!subject) return null;
                return <BookCard key={book.id} book={book} subject={subject} onSelect={setSelectedBook} />;
              })}
            </div>

            {filtered.length > visibleCount && (
              <button
                type="button"
                onClick={() => setVisibleCount(c => c + CARDS_PER_LOAD)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
              >
                <span className="material-symbols-outlined text-lg">expand_more</span>
                Load more ({Math.min(filtered.length - visibleCount, CARDS_PER_LOAD)} more)
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">filter_alt_off</span>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No books match</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Try a different search term or clear some filters.
            </p>
          </div>
        )}
      </main>

      {selectedBook && selectedSubject && (
        <BookDetailModal book={selectedBook} subject={selectedSubject} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default Library;