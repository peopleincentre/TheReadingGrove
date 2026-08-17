import React from 'react';
import { Subject } from '../types';
import { BookFilters } from '../lib/search';
import { contrastText } from '../lib/color';

interface SearchBarProps {
  filters: BookFilters;
  onFiltersChange: (patch: Partial<BookFilters>) => void;
  subjects: Subject[];
  subjectCounts: Record<string, number>;
}

const FIELD_LABELS: { key: 'title' | 'author' | 'publisher' | 'keyword'; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'keyword', label: 'Keyword' },
];

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange, subjects, subjectCounts }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md mb-6 space-y-4">
      {/* Subject pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onFiltersChange({ subjectCode: null })}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
            filters.subjectCode === null
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'
          }`}
        >
          All subjects
        </button>
        {subjects.map(subject => {
          const active = filters.subjectCode === subject.code;
          return (
            <button
              key={subject.code}
              type="button"
              onClick={() => onFiltersChange({ subjectCode: active ? null : subject.code })}
              style={{ backgroundColor: subject.color, color: contrastText(subject.color) }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
                active ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-800' : 'opacity-90 hover:opacity-100'
              }`}
            >
              {subject.name}
              <span className="ml-1 opacity-80">({subjectCounts[subject.code] || 0})</span>
            </button>
          );
        })}
      </div>

      {/* General search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={filters.q}
          onChange={e => onFiltersChange({ q: e.target.value })}
          placeholder="Search any field (title, author, keyword, publisher, subject, ISBN…)"
          className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Field-specific filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FIELD_LABELS.map(({ key, label }) => (
          <div key={key}>
            <label htmlFor={`filter-${key}`} className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
              {label}
            </label>
            <input
              id={`filter-${key}`}
              type="text"
              value={filters[key]}
              onChange={e => onFiltersChange({ [key]: e.target.value })}
              placeholder={label}
              className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;