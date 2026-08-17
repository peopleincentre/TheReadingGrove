
import React from 'react';
import { SortField, SortDirection, Subject } from '../types';
import Input from './common/Input';
import Select from './common/Select';
import Button from './common/Button';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  subjectFilter: string;
  setSubjectFilter: (code: string) => void;
  subjects: Subject[];
  yearFilter: string;
  setYearFilter: (year: string) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  subjectFilter,
  setSubjectFilter,
  subjects,
  yearFilter,
  setYearFilter,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
        <Input
          label="Search"
          id="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="md:col-span-2"
        />
        <Select
          label="Subject"
          id="subject-filter"
          value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}
        >
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </Select>
        <Input
          type="number"
          label="Year"
          id="year-filter"
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Select label="Sort by" id="sort-field" value={sortField} onChange={e => setSortField(e.target.value as SortField)}>
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="subjectCode">Subject</option>
            <option value="keywords">Keywords</option>
            <option value="shelfLocation">Shelf Location</option>
          </Select>
          <Button onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')} variant="outlined">
            <span className="material-symbols-outlined text-lg">{sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;