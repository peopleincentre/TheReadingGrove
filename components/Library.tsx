import React, { useEffect, useMemo, useState } from 'react';
import { Book } from '../types';
import { SUBJECTS } from '../constants';
import { searchBooks } from '../lib/search';
import seedBooks from '../data/seedBooks.json';
import Header from './Header';
import SearchBar from './SearchBar';
import SubjectSection from './SubjectSection';
import BookDetailModal from './BookDetailModal';

const Library: React.FC = () => {
  const books = useMemo(() => seedBooks as Book[], []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Read URL hash (#subject=DIS&q=water) on load and when it changes
  useEffect(() => {
    const parseHash = () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      setSearchTerm(params.get('q') || '');
      setActiveSubject(params.get('subject') || null);
    };
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Keep the URL hash in sync so views are shareable
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (activeSubject) params.set('subject', activeSubject);

    const query = params.toString();
    const target = query ? `#${query}` : '';
    if (target) {
      if (window.location.hash !== target) {
        window.location.hash = target;
      }
    } else if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [searchTerm, activeSubject]);

  const currentSubject =
    activeSubject && SUBJECTS.some(s => s.code === activeSubject) ? activeSubject : null;

  const booksBySubject = useMemo(() => {
    const map: Record<string, Book[]> = {};
    for (const book of books) {
      (map[book.subjectCode] ||= []).push(book);
    }
    return map;
  }, [books]);

  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const subject of SUBJECTS) {
      counts[subject.code] = booksBySubject[subject.code]?.length || 0;
    }
    return counts;
  }, [booksBySubject]);

  const filtered = useMemo(
    () => searchBooks(books, { term: searchTerm, subjects: SUBJECTS }),
    [books, searchTerm]
  );

  const filteredBySubject = useMemo(() => {
    const map: Record<string, Book[]> = {};
    for (const book of filtered) {
      (map[book.subjectCode] ||= []).push(book);
    }
    return map;
  }, [filtered]);

  const shelves = useMemo(
    () =>
      SUBJECTS.filter(subject => {
        if (currentSubject && subject.code !== currentSubject) return false;
        return (filteredBySubject[subject.code]?.length || 0) > 0;
      }).map(subject => ({
        subject,
        books: [...(filteredBySubject[subject.code] || [])].sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
        ),
      })),
    [SUBJECTS, currentSubject, filteredBySubject]
  );

  const selectedSubject =
    selectedBook && SUBJECTS.find(s => s.code === selectedBook.subjectCode);

  return (
    <div className="pb-16">
      <Header totalBooks={books.length} totalSubjects={SUBJECTS.filter(s => booksBySubject[s.code]?.length).length} />

      <main className="container mx-auto p-4 md:p-6">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subjects={SUBJECTS}
          subjectCounts={subjectCounts}
          activeSubject={activeSubject}
          setActiveSubject={setActiveSubject}
        />

        {searchTerm.trim() && (
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            {filtered.length} {filtered.length === 1 ? 'book matches' : 'books match'} your search
          </p>
        )}

        {shelves.length > 0 ? (
          <div className="space-y-10">
            {shelves.map(({ subject, books: shelfBooks }) => (
              <SubjectSection key={subject.code} subject={subject} books={shelfBooks} onSelect={setSelectedBook} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">filter_alt_off</span>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No books match</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Try a different search term or clear the subject filter.
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