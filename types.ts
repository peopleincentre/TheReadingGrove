

export interface User {
  id: string; // uuid
  memberId: string; // Auto-generated unique ID
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
}

export interface Subject {
  code: string; // Remains the unique ID for a subject
  name: string;
  color: string; // Tailwind color class e.g., 'bg-blue-500 text-white'
  cardColor: string; // Tailwind class for the book item card background
  borderColor: string; // Tailwind class for the book item card border
}

export interface Shelf {
  id: string; // uuid
  name: string; // e.g., S1-A1
}

export interface BorrowingRecord {
  borrowerId: string; // Links to User.id
  borrowedDate: string; // ISO String
  returnedDate: string | null; // ISO String or null
}

export interface Book {
  id: string; // Unique ID, can be the accession number
  accessionNumber: string;
  title: string;
  authors: string; // Comma-separated
  subjectCode: string; // Links to Subject.code
  keywords: string; // Comma-separated
  publisher: string;
  year: number;
  isbn: string;
  copies: number;
  shelfId: string; // Links to Shelf.id
  remarks: string;
  borrowingHistory?: BorrowingRecord[];
}

export type SortField = 'title' | 'year' | 'subjectCode' | 'shelfLocation' | 'keywords';
export type SortDirection = 'asc' | 'desc';

export interface LibraryData {
  books: Book[];
  subjects: Subject[];
  shelves: Shelf[];
  users: User[];
}