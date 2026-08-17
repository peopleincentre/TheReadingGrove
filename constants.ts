import { Subject } from './types';

// The subjects the library is organized into. Each subject gets its own
// color, used for the category pills, the card backgrounds (gradient),
// and small accents.

export const SUBJECTS: Subject[] = [
  { code: 'ARC', name: 'Architecture', color: 'bg-rose-500 text-white', cardColor: 'bg-rose-500', borderColor: 'border-rose-700', cardGradient: 'bg-gradient-to-b from-rose-100 to-rose-200' },
  { code: 'HOU', name: 'Housing', color: 'bg-orange-500 text-white', cardColor: 'bg-orange-500', borderColor: 'border-orange-700', cardGradient: 'bg-gradient-to-b from-orange-100 to-orange-200' },
  { code: 'ENV', name: 'Environment', color: 'bg-lime-500 text-white', cardColor: 'bg-lime-500', borderColor: 'border-lime-700', cardGradient: 'bg-gradient-to-b from-lime-100 to-lime-200' },
  { code: 'URB', name: 'Urban Planning', color: 'bg-sky-500 text-white', cardColor: 'bg-sky-500', borderColor: 'border-sky-700', cardGradient: 'bg-gradient-to-b from-sky-100 to-sky-200' },
  { code: 'DIS', name: 'Disasters', color: 'bg-red-500 text-white', cardColor: 'bg-red-500', borderColor: 'border-red-700', cardGradient: 'bg-gradient-to-b from-red-100 to-red-200' },
  { code: 'WAT', name: 'Water', color: 'bg-blue-500 text-white', cardColor: 'bg-blue-500', borderColor: 'border-blue-700', cardGradient: 'bg-gradient-to-b from-blue-100 to-blue-200' },
  { code: 'CON', name: 'Construction', color: 'bg-amber-500 text-white', cardColor: 'bg-amber-500', borderColor: 'border-amber-700', cardGradient: 'bg-gradient-to-b from-amber-100 to-amber-200' },
  { code: 'RUR', name: 'Rural Development', color: 'bg-green-500 text-white', cardColor: 'bg-green-500', borderColor: 'border-green-700', cardGradient: 'bg-gradient-to-b from-green-100 to-green-200' },
  { code: 'SOC', name: 'Society', color: 'bg-purple-500 text-white', cardColor: 'bg-purple-500', borderColor: 'border-purple-700', cardGradient: 'bg-gradient-to-b from-purple-100 to-purple-200' },
  { code: 'GEN', name: 'General', color: 'bg-indigo-500 text-white', cardColor: 'bg-indigo-500', borderColor: 'border-indigo-700', cardGradient: 'bg-gradient-to-b from-indigo-100 to-indigo-200' },
  { code: 'THE', name: 'Theory', color: 'bg-fuchsia-500 text-white', cardColor: 'bg-fuchsia-500', borderColor: 'border-fuchsia-700', cardGradient: 'bg-gradient-to-b from-fuchsia-100 to-fuchsia-200' },
  { code: 'TEC', name: 'Technology', color: 'bg-cyan-500 text-white', cardColor: 'bg-cyan-500', borderColor: 'border-cyan-700', cardGradient: 'bg-gradient-to-b from-cyan-100 to-cyan-200' },
];

export const BORROW_EMAIL = 'office@peopleincentre.com';