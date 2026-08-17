

import React, { useState, useMemo } from 'react';
import { Book, SortField, SortDirection, BorrowingRecord, User } from '../types';
import { useLibrary } from '../context/BookContext';
import Header from './Header';
import BookList from './BookList';
import BookForm from './BookForm';
import Modal from './common/Modal';
import SearchBar from './SearchBar';
import SettingsModal from './SettingsModal';
import Button from './common/Button';
import BorrowReturnModal from './BorrowReturnModal';
import DefaultersModal from './DefaultersModal';
import PrintableListModal from './PrintableListModal';

const LibraryManager: React.FC = () => {
  const { books, subjects, shelves, users } = useLibrary();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDefaultersModalOpen, setIsDefaultersModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleAddNew = () => {
    setSelectedBook(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenStatus = (book: Book) => {
    setSelectedBook(book);
    setIsStatusModalOpen(true);
  }

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsStatusModalOpen(false); // Close status modal
    setIsFormModalOpen(true); // Open edit form
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedBook(null);
  };
  
  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedBook(null);
  }

  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          (book.title.toLowerCase().includes(lowerSearchTerm) ||
           book.authors.toLowerCase().includes(lowerSearchTerm) ||
           (book.keywords && book.keywords.toLowerCase().includes(lowerSearchTerm))) &&
          (subjectFilter === '' || book.subjectCode === subjectFilter) &&
          (yearFilter === '' || book.year.toString() === yearFilter)
        );
      })
      .sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;

        switch (sortField) {
            case 'year':
                aVal = a.year;
                bVal = b.year;
                break;
            case 'shelfLocation':
                aVal = shelves.find(s => s.id === a.shelfId)?.name.toLowerCase() || '';
                bVal = shelves.find(s => s.id === b.shelfId)?.name.toLowerCase() || '';
                break;
            case 'subjectCode':
                aVal = subjects.find(s => s.code === a.subjectCode)?.name.toLowerCase() || '';
                bVal = subjects.find(s => s.code === b.subjectCode)?.name.toLowerCase() || '';
                break;
            case 'keywords':
                aVal = a.keywords?.split(',')[0]?.trim().toLowerCase() || '';
                bVal = b.keywords?.split(',')[0]?.trim().toLowerCase() || '';
                break;
            case 'title':
            default:
                aVal = a.title.toLowerCase();
                bVal = b.title.toLowerCase();
                break;
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [books, searchTerm, subjectFilter, yearFilter, sortField, sortDirection, subjects, shelves]);
  
  const booksByShelf = useMemo(() => {
    return filteredBooks.reduce((acc, book) => {
      const shelfId = book.shelfId || '';
      if (!acc[shelfId]) {
        acc[shelfId] = [];
      }
      acc[shelfId].push(book);
      return acc;
    }, {} as Record<string, Book[]>);
  }, [filteredBooks]);

  const defaulters = useMemo(() => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    return books.map(book => {
        const activeLoan = book.borrowingHistory?.find(r => r.returnedDate === null);
        if (activeLoan && new Date(activeLoan.borrowedDate) < twoWeeksAgo) {
            const user = users.find(u => u.id === activeLoan.borrowerId);
            if(user) {
              return { book, loan: activeLoan, user };
            }
        }
        return null;
    }).filter((item): item is { book: Book, loan: BorrowingRecord, user: User } => item !== null);
  }, [books, users]);


  return (
    <div className="pb-24">
      <Header 
        onOpenSettings={() => setIsSettingsModalOpen(true)} 
        onOpenDefaulters={() => setIsDefaultersModalOpen(true)}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        defaulterCount={defaulters.length}
        totalBooks={books.length}
      />
      <main className="container mx-auto p-4 md:p-6">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          subjects={subjects}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
        <BookList booksByShelf={booksByShelf} onOpenStatus={handleOpenStatus} />
      </main>

      <div className="fixed bottom-6 right-6 z-40 no-print">
        <Button variant="fab" onClick={handleAddNew} aria-label="Add new book">
            <span className="material-symbols-outlined">add</span>
        </Button>
      </div>

      {isFormModalOpen && (
        <Modal onClose={handleCloseFormModal} title={selectedBook ? 'Edit Book' : 'Add New Book'}>
          <BookForm bookToEdit={selectedBook} onFinished={handleCloseFormModal} />
        </Modal>
      )}
      {isStatusModalOpen && selectedBook && (
        <BorrowReturnModal 
            book={selectedBook} 
            onClose={handleCloseStatusModal} 
            onEdit={handleEdit}
        />
      )}
      {isSettingsModalOpen && (
        <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
      )}
      {isDefaultersModalOpen && (
        <DefaultersModal 
            defaulters={defaulters}
            onClose={() => setIsDefaultersModalOpen(false)}
        />
      )}
      {isPrintModalOpen && (
        <PrintableListModal onClose={() => setIsPrintModalOpen(false)} />
      )}
    </div>
  );
};

export default LibraryManager;
