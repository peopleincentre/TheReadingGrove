import { Subject } from './types';

// The subjects the library is organized into. Each subject gets its own
// color, used for the category pills, the card backgrounds (gradient),
// and small accents.

export const SUBJECTS: Subject[] = [
  { code: 'ARC', name: 'Architecture', color: 'bg-rose-500 text-white', cardColor: 'bg-rose-500', borderColor: 'border-rose-700', cardGradient: 'bg-gradient-to-b from-rose-500 to-rose-700' },
  { code: 'HOU', name: 'Housing', color: 'bg-orange-500 text-white', cardColor: 'bg-orange-500', borderColor: 'border-orange-700', cardGradient: 'bg-gradient-to-b from-orange-500 to-orange-700' },
  { code: 'ENV', name: 'Environment', color: 'bg-lime-500 text-white', cardColor: 'bg-lime-500', borderColor: 'border-lime-700', cardGradient: 'bg-gradient-to-b from-lime-500 to-lime-700' },
  { code: 'URB', name: 'Urban Planning', color: 'bg-sky-500 text-white', cardColor: 'bg-sky-500', borderColor: 'border-sky-700', cardGradient: 'bg-gradient-to-b from-sky-500 to-sky-700' },
  { code: 'DIS', name: 'Disasters', color: 'bg-red-500 text-white', cardColor: 'bg-red-500', borderColor: 'border-red-700', cardGradient: 'bg-gradient-to-b from-red-500 to-red-700' },
  { code: 'WAT', name: 'Water', color: 'bg-blue-500 text-white', cardColor: 'bg-blue-500', borderColor: 'border-blue-700', cardGradient: 'bg-gradient-to-b from-blue-500 to-blue-700' },
  { code: 'CON', name: 'Construction', color: 'bg-amber-500 text-white', cardColor: 'bg-amber-500', borderColor: 'border-amber-700', cardGradient: 'bg-gradient-to-b from-amber-500 to-amber-700' },
  { code: 'RUR', name: 'Rural Development', color: 'bg-green-500 text-white', cardColor: 'bg-green-500', borderColor: 'border-green-700', cardGradient: 'bg-gradient-to-b from-green-500 to-green-700' },
  { code: 'SOC', name: 'Society', color: 'bg-purple-500 text-white', cardColor: 'bg-purple-500', borderColor: 'border-purple-700', cardGradient: 'bg-gradient-to-b from-purple-500 to-purple-700' },
  { code: 'GEN', name: 'General', color: 'bg-indigo-500 text-white', cardColor: 'bg-indigo-500', borderColor: 'border-indigo-700', cardGradient: 'bg-gradient-to-b from-indigo-500 to-indigo-700' },
  { code: 'THE', name: 'Theory', color: 'bg-fuchsia-500 text-white', cardColor: 'bg-fuchsia-500', borderColor: 'border-fuchsia-700', cardGradient: 'bg-gradient-to-b from-fuchsia-500 to-fuchsia-700' },
  { code: 'TEC', name: 'Technology', color: 'bg-cyan-500 text-white', cardColor: 'bg-cyan-500', borderColor: 'border-cyan-700', cardGradient: 'bg-gradient-to-b from-cyan-500 to-cyan-700' },
];

export const BORROW_EMAIL = 'office@peopleincentre.com';