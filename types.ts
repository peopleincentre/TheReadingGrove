export interface Subject {
  code: string; // Unique ID for a subject
  name: string;
  color: string; // Tailwind pill/badge class, e.g. 'bg-red-500 text-white'
  accentColor: string; // Tailwind class for the card's top accent bar, e.g. 'bg-pink-700'
  cardGradient: string; // Tailwind gradient class for the card background
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