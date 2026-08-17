export interface Subject {
  code: string; // Unique ID for a subject
  name: string;
  color: string; // Hex background for the pill/badge, e.g. '#EF4444'
  accentColor: string; // Hex for the card's top accent bar, e.g. '#B91C1C'
  cardGradientFrom: string; // Hex for the top of the card gradient
  cardGradientTo: string; // Hex for the bottom of the card gradient
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