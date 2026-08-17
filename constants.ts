import { Subject, Shelf } from './types';

// These are the default subjects and shelves for a new library.
// Users can add, edit, or delete these from the settings menu.

export const INITIAL_SUBJECTS: Subject[] = [
  { code: 'ARC', name: 'Architecture', color: 'bg-rose-500 text-white', cardColor: 'bg-rose-500', borderColor: 'border-rose-700' },
  { code: 'HOU', name: 'Housing', color: 'bg-orange-500 text-white', cardColor: 'bg-orange-500', borderColor: 'border-orange-700' },
  { code: 'ENV', name: 'Environment', color: 'bg-lime-500 text-white', cardColor: 'bg-lime-500', borderColor: 'border-lime-700' },
  { code: 'URB', name: 'Urban Planning', color: 'bg-sky-500 text-white', cardColor: 'bg-sky-500', borderColor: 'border-sky-700' },
  { code: 'DIS', name: 'Disasters', color: 'bg-red-500 text-white', cardColor: 'bg-red-500', borderColor: 'border-red-700' },
  { code: 'WAT', name: 'Water', color: 'bg-blue-500 text-white', cardColor: 'bg-blue-500', borderColor: 'border-blue-700' },
  { code: 'CON', name: 'Construction', color: 'bg-amber-500 text-white', cardColor: 'bg-amber-500', borderColor: 'border-amber-700' },
  { code: 'RUR', name: 'Rural Development', color: 'bg-green-500 text-white', cardColor: 'bg-green-500', borderColor: 'border-green-700' },
  { code: 'SOC', name: 'Society', color: 'bg-purple-500 text-white', cardColor: 'bg-purple-500', borderColor: 'border-purple-700' },
  { code: 'GEN', name: 'General', color: 'bg-indigo-500 text-white', cardColor: 'bg-indigo-500', borderColor: 'border-indigo-700' },
  { code: 'THE', name: 'Theory', color: 'bg-fuchsia-500 text-white', cardColor: 'bg-fuchsia-500', borderColor: 'border-fuchsia-700' },
  { code: 'TEC', name: 'Technology', color: 'bg-cyan-500 text-white', cardColor: 'bg-cyan-500', borderColor: 'border-cyan-700' },
];

export const INITIAL_SHELVES: Shelf[] = [
  { id: 's1-a1', name: 'S1-A1' },
  { id: 's1-a2', name: 'S1-A2' },
  { id: 's1-b1', name: 'S1-B1' },
  { id: 's1-b2', name: 'S1-B2' },
  { id: 's2-a1', name: 'S2-A1' },
  { id: 's2-a2', name: 'S2-A2' },
  { id: 's2-b1', name: 'S2-B1' },
  { id: 's2-b2', name: 'S2-B2' },
  { id: 's2-b3', name: 'S2-B3' },
  { id: 's3-a1', name: 'S3-A1' },
  { id: 's3-b1', 'name': 'S3-B1' },
  { id: 's4-a1', name: 'S4-A1' },
  { id: 's4-a2', name: 'S4-A2' },
];

export const COLOR_PALETTE = [
    { name: 'Rose', color: 'bg-rose-500 text-white', cardColor: 'bg-rose-500', borderColor: 'border-rose-700' },
    { name: 'Pink', color: 'bg-pink-500 text-white', cardColor: 'bg-pink-500', borderColor: 'border-pink-700' },
    { name: 'Fuchsia', color: 'bg-fuchsia-500 text-white', cardColor: 'bg-fuchsia-500', borderColor: 'border-fuchsia-700' },
    { name: 'Purple', color: 'bg-purple-500 text-white', cardColor: 'bg-purple-500', borderColor: 'border-purple-700' },
    { name: 'Violet', color: 'bg-violet-500 text-white', cardColor: 'bg-violet-500', borderColor: 'border-violet-700' },
    { name: 'Indigo', color: 'bg-indigo-500 text-white', cardColor: 'bg-indigo-500', borderColor: 'border-indigo-700' },
    { name: 'Blue', color: 'bg-blue-500 text-white', cardColor: 'bg-blue-500', borderColor: 'border-blue-700' },
    { name: 'Sky', color: 'bg-sky-500 text-white', cardColor: 'bg-sky-500', borderColor: 'border-sky-700' },
    { name: 'Cyan', color: 'bg-cyan-500 text-white', cardColor: 'bg-cyan-500', borderColor: 'border-cyan-700' },
    { name: 'Teal', color: 'bg-teal-500 text-white', cardColor: 'bg-teal-500', borderColor: 'border-teal-700' },
    { name: 'Emerald', color: 'bg-emerald-500 text-white', cardColor: 'bg-emerald-500', borderColor: 'border-emerald-700' },
    { name: 'Green', color: 'bg-green-500 text-white', cardColor: 'bg-green-500', borderColor: 'border-green-700' },
    { name: 'Lime', color: 'bg-lime-500 text-white', cardColor: 'bg-lime-500', borderColor: 'border-lime-700' },
    { name: 'Yellow', color: 'bg-yellow-500 text-white', cardColor: 'bg-yellow-500', borderColor: 'border-yellow-700' },
    { name: 'Amber', color: 'bg-amber-500 text-white', cardColor: 'bg-amber-500', borderColor: 'border-amber-700' },
    { name: 'Orange', color: 'bg-orange-500 text-white', cardColor: 'bg-orange-500', borderColor: 'border-orange-700' },
    { name: 'Red', color: 'bg-red-500 text-white', cardColor: 'bg-red-500', borderColor: 'border-red-700' },
    { name: 'Slate', color: 'bg-slate-500 text-white', cardColor: 'bg-slate-500', borderColor: 'border-slate-700' },
];

export const BOOK_SPINE_COLORS = [
    'bg-slate-700',
    'bg-gray-700',
    'bg-zinc-700',
    'bg-neutral-700',
    'bg-stone-700',
    'bg-red-800',
    'bg-orange-800',
    'bg-amber-800',
    'bg-lime-800',
    'bg-green-800',
    'bg-emerald-800',
    'bg-teal-800',
    'bg-cyan-800',
    'bg-sky-800',
    'bg-blue-800',
    'bg-indigo-800',
    'bg-violet-800',
    'bg-purple-800',
    'bg-fuchsia-800',
    'bg-pink-800',
    'bg-rose-800',
];
