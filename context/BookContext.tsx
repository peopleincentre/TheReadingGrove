

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { Book, Subject, Shelf, LibraryData, User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_SUBJECTS, INITIAL_SHELVES } from '../constants';
import { parseCSV } from '../utils/csv';
import seedBooks from '../data/seedBooks.json';

interface LibraryContextType {
  books: Book[];
  subjects: Subject[];
  shelves: Shelf[];
  users: User[];
  isInitialized: boolean;
  addBook: (book: Omit<Book, 'id' | 'accessionNumber'>) => Book;
  updateBook: (updatedBook: Book) => void;
  deleteBook: (bookId: string) => void;
  generateAccessionNumber: (subjectCode: string) => string;
  addSubject: (subject: Subject) => void;
  updateSubject: (updatedSubject: Subject) => void;
  deleteSubject: (subjectCode: string) => void;
  addShelf: (shelf: Omit<Shelf, 'id'>) => void;
  updateShelf: (updatedShelf: Shelf) => void;
  deleteShelf: (shelfId: string) => void;
  addUser: (user: Omit<User, 'id' | 'memberId'>) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  borrowBook: (bookId: string, borrowerId: string) => void;
  returnBook: (bookId: string, loanIndex?: number) => void;
  exportLibrary: () => void;
  importLibrary: (file: File) => Promise<void>;
  importBooksFromCSV: (file: File) => Promise<{ imported: number; skipped: number }>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const initialLibraryData: LibraryData = {
    books: seedBooks,
    subjects: INITIAL_SUBJECTS,
    shelves: INITIAL_SHELVES,
    users: [],
};

// Data migration and validation function for imported data
const migrateLibraryData = (data: any): LibraryData => {
  if (!data || typeof data !== 'object') {
    return initialLibraryData;
  }

  const migratedUsers: User[] = (data.users || []).map((user: any) => ({
      ...user,
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
  }));
  const nameToIdMap = new Map<string, string>();
  migratedUsers.forEach(u => nameToIdMap.set(u.name, u.id));

  const migratedBooks = (data.books || []).map((book: any) => {
    const bookWithCopies = { ...book, copies: book.copies ?? 1 };
    if (!bookWithCopies.borrowingHistory) {
      return { ...bookWithCopies, borrowingHistory: [] };
    }
    // Migrate old borrowing records that used borrowerName
    const newHistory = bookWithCopies.borrowingHistory.map((record: any) => {
      if (record.borrowerName && !record.borrowerId) {
        let userId = nameToIdMap.get(record.borrowerName);
        if (!userId) {
          const newUser: User = {
            id: crypto.randomUUID(),
            name: record.borrowerName,
            memberId: `MIGRATED-${migratedUsers.length + 1}`,
            email: '',
            phoneNumber: '',
          };
          migratedUsers.push(newUser);
          nameToIdMap.set(newUser.name, newUser.id);
          userId = newUser.id;
        }
        const { borrowerName, ...rest } = record;
        return { ...rest, borrowerId: userId };
      }
      return record;
    });
    return { ...bookWithCopies, borrowingHistory: newHistory };
  });

  const existingAccessionNumbers = new Set(migratedBooks.map((b: any) => b.accessionNumber));
  const missingSeedBooks = seedBooks.filter((book: Book) => !existingAccessionNumbers.has(book.accessionNumber));

  return { 
    books: [...migratedBooks, ...missingSeedBooks],
    subjects: data.subjects || INITIAL_SUBJECTS,
    shelves: data.shelves || INITIAL_SHELVES,
    users: migratedUsers
  };
};

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [libraryData, setLibraryData] = useLocalStorage<LibraryData>('library_data_v2', initialLibraryData);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const migratedData = migrateLibraryData(libraryData);
    if (JSON.stringify(migratedData) !== JSON.stringify(libraryData)) {
      setLibraryData(migratedData);
    }
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateAccessionNumber = useCallback((subjectCode: string): string => {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `${subjectCode}-${year}-`;
    const booksThisYear = libraryData.books.filter(b => b.accessionNumber.startsWith(prefix));
    let maxNum = 0;
    booksThisYear.forEach(b => {
      const numPart = parseInt(b.accessionNumber.slice(-3), 10);
      if (numPart > maxNum) maxNum = numPart;
    });
    const newNum = (maxNum + 1).toString().padStart(3, '0');
    return `${prefix}${newNum}`;
  }, [libraryData.books]);

  const addBook = (bookData: Omit<Book, 'id' | 'accessionNumber'>): Book => {
    const accessionNumber = generateAccessionNumber(bookData.subjectCode);
    const newBook: Book = { ...bookData, id: accessionNumber, accessionNumber, copies: bookData.copies ?? 1, borrowingHistory: [] };
    setLibraryData(prev => ({ ...prev, books: [...prev.books, newBook] }));
    return newBook;
  };

  const updateBook = (updatedBook: Book) => {
    setLibraryData(prev => ({ ...prev, books: prev.books.map(book => (book.id === updatedBook.id ? updatedBook : book)) }));
  };

  const deleteBook = (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      setLibraryData(prev => ({ ...prev, books: prev.books.filter(book => book.id !== bookId) }));
    }
  };

  const addSubject = (subject: Subject) => setLibraryData(prev => ({...prev, subjects: [...prev.subjects, subject]}));
  const updateSubject = (updatedSubject: Subject) => setLibraryData(prev => ({ ...prev, subjects: prev.subjects.map(s => s.code === updatedSubject.code ? updatedSubject : s) }));
  const deleteSubject = (subjectCode: string) => {
    if (libraryData.books.some(b => b.subjectCode === subjectCode)) {
      alert("Cannot delete subject. It is currently assigned to one or more books.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setLibraryData(prev => ({ ...prev, subjects: prev.subjects.filter(s => s.code !== subjectCode) }));
    }
  };

  const addShelf = (shelfData: Omit<Shelf, 'id'>) => {
    const newShelf = { ...shelfData, id: crypto.randomUUID() };
    setLibraryData(prev => ({ ...prev, shelves: [...prev.shelves, newShelf] }));
  };
  const updateShelf = (updatedShelf: Shelf) => setLibraryData(prev => ({ ...prev, shelves: prev.shelves.map(s => s.id === updatedShelf.id ? updatedShelf : s) }));
  const deleteShelf = (shelfId: string) => {
    if (libraryData.books.some(b => b.shelfId === shelfId)) {
      alert("Cannot delete shelf. It is currently assigned to one or more books.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this shelf location?')) {
      setLibraryData(prev => ({...prev, shelves: prev.shelves.filter(s => s.id !== shelfId)}));
    }
  };
  
  const generateMemberId = useCallback((): string => {
    const userMemberIds = libraryData.users
        .map(u => u.memberId)
        .filter(id => id.startsWith('U-'))
        .map(id => parseInt(id.substring(2), 10))
        .filter(num => !isNaN(num));

    const maxId = userMemberIds.length > 0 ? Math.max(...userMemberIds) : 0;
    return `U-${(maxId + 1).toString().padStart(3, '0')}`;
  }, [libraryData.users]);


  const addUser = (userData: Omit<User, 'id' | 'memberId'>) => {
    const memberId = generateMemberId();
    const newUser: User = { ...userData, id: crypto.randomUUID(), memberId };
    setLibraryData(prev => ({ ...prev, users: [...prev.users, newUser] }));
  };
  const updateUser = (updatedUser: User) => setLibraryData(prev => ({ ...prev, users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u) }));
  const deleteUser = (userId: string) => {
    const hasActiveLoan = libraryData.books.some(book => book.borrowingHistory?.some(r => r.borrowerId === userId && r.returnedDate === null));
    if (hasActiveLoan) {
      alert("Cannot delete user. They have one or more books currently borrowed.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setLibraryData(prev => ({ ...prev, users: prev.users.filter(u => u.id !== userId) }));
    }
  };

  const borrowBook = (bookId: string, borrowerId: string) => {
    const book = libraryData.books.find(b => b.id === bookId);
    if (book) {
      const activeLoans = (book.borrowingHistory || []).filter(r => r.returnedDate === null).length;
      if (activeLoans >= (book.copies || 1)) {
        alert('All copies of this book are currently borrowed.');
        return;
      }
    }
    setLibraryData(prev => {
      const newBooks = prev.books.map(book => {
        if (book.id === bookId) {
          const newHistory = [...(book.borrowingHistory || [])];
          newHistory.push({
            borrowerId,
            borrowedDate: new Date().toISOString(),
            returnedDate: null,
          });
          return { ...book, borrowingHistory: newHistory };
        }
        return book;
      });
      return { ...prev, books: newBooks };
    });
  };

  const returnBook = (bookId: string, loanIndex?: number) => {
    setLibraryData(prev => {
      const newBooks = prev.books.map(book => {
        if (book.id === bookId) {
          const newHistory = [...(book.borrowingHistory || [])];

          if (typeof loanIndex === 'number' && loanIndex >= 0 && loanIndex < newHistory.length && newHistory[loanIndex].returnedDate === null) {
            newHistory[loanIndex] = {
              ...newHistory[loanIndex],
              returnedDate: new Date().toISOString(),
            };
            return { ...book, borrowingHistory: newHistory };
          }

          let lastRecordIndex = -1;
          for (let i = newHistory.length - 1; i >= 0; i--) {
            if (newHistory[i].returnedDate === null) {
              lastRecordIndex = i;
              break;
            }
          }
          
          if (lastRecordIndex > -1) {
            newHistory[lastRecordIndex] = {
              ...newHistory[lastRecordIndex],
              returnedDate: new Date().toISOString(),
            };
            return { ...book, borrowingHistory: newHistory };
          }
        }
        return book;
      });
      return { ...prev, books: newBooks };
    });
  };

  const exportLibrary = () => {
    try {
        const dataStr = JSON.stringify(libraryData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'the_reading_grove_library.json';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Error exporting library:", err);
        alert("Failed to export library data.");
    }
  };

  const importLibrary = (file: File) => {
    return new Promise<void>((resolve, reject) => {
        if (!window.confirm("This will replace your current library with the contents of the file. This action cannot be undone. Are you sure you want to proceed?")) {
            return reject(new Error("Import cancelled by user."));
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result;
                if (typeof text !== 'string') throw new Error("File could not be read.");
                
                const data = JSON.parse(text);
                
                if (data && typeof data === 'object' && 'books' in data && 'subjects' in data && 'shelves' in data) {
                    const migratedData = migrateLibraryData(data);
                    setLibraryData(migratedData);
                    resolve();
                } else {
                    throw new Error("Invalid library file format.");
                }
            } catch (err) {
                console.error("Error importing library:", err);
                alert(`Failed to import library: ${(err as Error).message}`);
                reject(err);
            }
        };
        reader.onerror = (err) => {
            console.error("Error reading file:", err);
            alert("Failed to read the selected file.");
            reject(err);
        };
        reader.readAsText(file);
    });
  };

  const importBooksFromCSV = (file: File): Promise<{ imported: number; skipped: number }> => {
    return new Promise((resolve, reject) => {
        if (!window.confirm("This will add books from the CSV file. Books with existing accession numbers will be skipped. Are you sure?")) {
            return reject(new Error("Import cancelled by user."));
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                if (!text) throw new Error("File could not be read.");

                const parsedData = parseCSV(text);
                if (parsedData.length === 0) throw new Error("CSV file is empty or invalid.");

                const { books, subjects, shelves } = libraryData;
                
                const requiredHeaders = ['title', 'authors', 'subject'];
                const csvHeaders = Object.keys(parsedData[0]);
                const hasAllHeaders = requiredHeaders.every(h => csvHeaders.includes(h));

                if (!hasAllHeaders) {
                    throw new Error(`CSV file is missing one or more required headers. Required: ${requiredHeaders.join(', ')}.`);
                }

                const subjectNameToCode = new Map(subjects.map(s => [s.name.toLowerCase(), s.code]));
                const shelfNameToId = new Map(shelves.map(s => [s.name.toLowerCase(), s.id]));
                const existingAccessionNumbers = new Set(books.map(b => b.accessionNumber));
                
                const newBooks: Book[] = [];
                let skippedCount = 0;
                const errors: string[] = [];
                
                const year = new Date().getFullYear().toString().slice(-2);
                const prefixCounters = new Map<string, number>();
                subjects.forEach(subject => {
                    const prefix = `${subject.code}-${year}-`;
                    const booksThisYear = books.filter(b => b.accessionNumber.startsWith(prefix));
                    let maxNum = 0;
                    booksThisYear.forEach(b => {
                        const numPart = parseInt(b.accessionNumber.slice(-3), 10);
                        if (!isNaN(numPart) && numPart > maxNum) maxNum = numPart;
                    });
                    prefixCounters.set(prefix, maxNum + 1);
                });


                for (const [index, row] of parsedData.entries()) {
                    if (!row.title || !row.authors) {
                       errors.push(`Row ${index + 2}: Skipped, missing title or authors.`);
                       skippedCount++;
                       continue;
                    }
                    
                    const subjectName = row.subject;
                    const subjectCode = subjectNameToCode.get(subjectName?.toLowerCase());
                    if (!subjectCode) {
                        errors.push(`Row ${index + 2}: Skipped, Subject "${subjectName}" not found for book "${row.title}". Please add it in Settings first.`);
                        skippedCount++;
                        continue;
                    }

                    let accessionNumber = row.accessionNumber?.trim();
                    if (accessionNumber) {
                        if (existingAccessionNumbers.has(accessionNumber)) {
                            errors.push(`Row ${index + 2}: Skipped, accessionNumber "${accessionNumber}" already exists.`);
                            skippedCount++;
                            continue;
                        }
                    } else {
                        const prefix = `${subjectCode}-${year}-`;
                        const nextNum = prefixCounters.get(prefix) || 1;
                        accessionNumber = `${prefix}${nextNum.toString().padStart(3, '0')}`;
                        prefixCounters.set(prefix, nextNum + 1);
                    }

                    const shelfName = row.shelfLocation;
                    const shelfId = shelfNameToId.get(shelfName?.trim().toLowerCase()) || '';

                    const newBook: Book = {
                        id: accessionNumber,
                        accessionNumber: accessionNumber,
                        title: row.title,
                        authors: row.authors,
                        subjectCode: subjectCode,
                        keywords: row.keywords || '',
                        publisher: row.publisher || '',
                        year: parseInt(row.year, 10) || new Date().getFullYear(),
                        isbn: row.isbn || '',
                        copies: parseInt(row.copies, 10) || 1,
                        shelfId: shelfId,
                        remarks: row.remarks || '',
                        borrowingHistory: [],
                    };
                    newBooks.push(newBook);
                    existingAccessionNumbers.add(accessionNumber);
                }

                if (newBooks.length > 0) {
                    setLibraryData(prev => ({
                        ...prev,
                        books: [...prev.books, ...newBooks],
                    }));
                }

                if (errors.length > 0) {
                    console.warn('--- CSV Import Errors ---');
                    errors.forEach(e => console.warn(e));
                    console.warn('--------------------------');
                }

                resolve({ imported: newBooks.length, skipped: skippedCount });

            } catch (err) {
                console.error("Error importing from CSV:", err);
                reject(err as Error);
            }
        };
        reader.onerror = (err) => {
            console.error("Error reading CSV file:", err);
            reject(err);
        };
        reader.readAsText(file);
    });
  };

  const value = {
    ...libraryData,
    isInitialized,
    addBook, updateBook, deleteBook, generateAccessionNumber,
    addSubject, updateSubject, deleteSubject,
    addShelf, updateShelf, deleteShelf,
    addUser, updateUser, deleteUser,
    borrowBook, returnBook,
    exportLibrary, importLibrary, importBooksFromCSV,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
};
