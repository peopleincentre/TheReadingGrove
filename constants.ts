import { Subject } from './types';

// The subjects the library is organized into. Each subject gets its own
// shelf on the browse page, color-coded for easy scanning.

export const SUBJECTS: Subject[] = [
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

export const BORROW_EMAIL = 'office@peopleincentre.com';

// Spine colors for the book spines, varied deterministically per book so
// each shelf looks like a colorful real library shelf. Full literal classes
// so Tailwind's CDN build generates them.
export const BOOK_SPINE_COLORS = [
  'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950',
  'bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-950',
  'bg-gradient-to-b from-stone-600 via-stone-800 to-stone-950',
  'bg-gradient-to-b from-red-700 via-red-800 to-red-950',
  'bg-gradient-to-b from-orange-600 via-orange-800 to-orange-950',
  'bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900',
  'bg-gradient-to-b from-yellow-600 via-yellow-700 to-yellow-900',
  'bg-gradient-to-b from-lime-600 via-lime-800 to-lime-950',
  'bg-gradient-to-b from-green-700 via-green-800 to-green-950',
  'bg-gradient-to-b from-emerald-600 via-emerald-800 to-emerald-950',
  'bg-gradient-to-b from-teal-600 via-teal-800 to-teal-950',
  'bg-gradient-to-b from-cyan-700 via-cyan-800 to-cyan-950',
  'bg-gradient-to-b from-sky-600 via-sky-800 to-sky-950',
  'bg-gradient-to-b from-blue-700 via-blue-800 to-blue-950',
  'bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-950',
  'bg-gradient-to-b from-violet-700 via-violet-800 to-violet-950',
  'bg-gradient-to-b from-purple-700 via-purple-800 to-purple-950',
  'bg-gradient-to-b from-fuchsia-700 via-fuchsia-800 to-fuchsia-950',
  'bg-gradient-to-b from-pink-600 via-pink-800 to-pink-950',
  'bg-gradient-to-b from-rose-700 via-rose-800 to-rose-950',
];

// Deterministic height variance for the book spines, so a shelf looks like a
// real (uneven) library shelf rather than identical blocks.
export const BOOK_SPINE_HEIGHTS: { heightClass: string; heightPx: number }[] = [
  { heightClass: 'h-48', heightPx: 192 },
  { heightClass: 'h-52', heightPx: 208 },
  { heightClass: 'h-56', heightPx: 224 },
  { heightClass: 'h-60', heightPx: 240 },
  { heightClass: 'h-64', heightPx: 256 },
];