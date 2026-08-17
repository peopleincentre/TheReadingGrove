import React from 'react';
import { Subject } from '../types';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  subjects: Subject[];
  subjectCounts: Record<string, number>;
  activeSubject: string | null;
  setActiveSubject: (code: string | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  subjects,
  subjectCounts,
  activeSubject,
  setActiveSubject,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md mb-6 space-y-4">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by title, author, keyword, publisher, subject, accession no…"
          className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSubject(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
            activeSubject === null
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'
          }`}
        >
          All subjects
        </button>
        {subjects.map(subject => (
          <button
            key={subject.code}
            type="button"
            onClick={() => setActiveSubject(activeSubject === subject.code ? null : subject.code)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${subject.color} ${
              activeSubject === subject.code
                ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-800'
                : 'opacity-90 hover:opacity-100'
            }`}
          >
            {subject.name}
            <span className="ml-1 opacity-80">({subjectCounts[subject.code] || 0})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;