

import React from 'react';
import { Book } from '../types';
import BookItem from './BookItem';
import { useLibrary } from '../context/BookContext';

interface BookListProps {
  booksByShelf: Record<string, Book[]>;
  onOpenStatus: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({ booksByShelf, onOpenStatus }) => {
  const { shelves, books } = useLibrary();
  const sortedShelves = [...shelves].sort((a, b) => a.name.localeCompare(b.name));
  const unshelvedBooks = booksByShelf[''] || [];

  if (books.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">menu_book</span>
        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No books found</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Get started by adding a new book to your library.</p>
      </div>
    );
  }

  const hasVisibleBooks = sortedShelves.some(shelf => (booksByShelf[shelf.id] || []).length > 0) || unshelvedBooks.length > 0;

  if (!hasVisibleBooks) {
      return (
          <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
              <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">filter_alt_off</span>
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No Books Match Filters</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
          </div>
      );
  }


  return (
    <div className="space-y-12">
      {sortedShelves.map(shelf => {
        const booksOnThisShelf = booksByShelf[shelf.id] || [];
        if (booksOnThisShelf.length === 0) return null;

        return (
          <div key={shelf.id} className="relative">
            {/* Shelf */}
            <div className="relative h-6 bg-slate-200 dark:bg-slate-700 rounded-md shadow-sm flex items-center justify-start px-4">
               <span className="font-medium text-sm text-slate-600 dark:text-slate-300">{shelf.name}</span>
            </div>
            {/* Books */}
            <div className="relative flex items-end h-64 -mt-2 px-4 space-x-2 overflow-x-auto pb-4">
              {booksOnThisShelf.map(book => (
                <BookItem key={book.id} book={book} onOpenStatus={onOpenStatus} />
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Unshelved books section */}
      {unshelvedBooks.length > 0 && (
         <div key="unshelved" className="relative">
            <div className="relative h-6 bg-slate-200 dark:bg-slate-700 rounded-md shadow-sm flex items-center justify-start px-4">
               <span className="font-medium text-sm text-slate-600 dark:text-slate-300">Unshelved</span>
            </div>
            <div className="relative flex items-end h-64 -mt-2 px-4 space-x-2 overflow-x-auto pb-4">
              {unshelvedBooks.map(book => (
                <BookItem key={book.id} book={book} onOpenStatus={onOpenStatus} />
              ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default BookList;
