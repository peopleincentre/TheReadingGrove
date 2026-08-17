export interface Subject {
  code: string; // Unique ID for a subject
  name: string;
  color: string; // Tailwind color class e.g., 'bg-blue-500 text-white'
  cardColor: string; // Tailwind class for the book item card background
  borderColor: string; // Tailwind class for the book item card border
}

export interface Book {
  id: string; // Unique ID, the accession number
  accessionNumber: string;
  title: string;
  authors: string; // Comma-separated
  subjectCode: string; // Links to Subject.code
  keywords: string; // Comma-separated
  publisher: string;
  year: number;
  isbn: string;
  copies: number;
  remarks: string;
}