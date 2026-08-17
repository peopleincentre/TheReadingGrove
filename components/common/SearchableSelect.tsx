
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Input from './Input'; // Assuming your custom Input is in the same folder

interface Option {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  label: string;
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, options, value, onChange, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOptionName = useMemo(() => options.find(o => o.id === value)?.name || '', [options, value]);

  useEffect(() => {
    if (value) {
      setSearchTerm(selectedOptionName);
    }
  }, [value, selectedOptionName]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm || searchTerm === selectedOptionName) {
      return options;
    }
    return options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options, selectedOptionName]);

  const handleSelect = useCallback((option: Option) => {
    onChange(option.id);
    setSearchTerm(option.name);
    setIsOpen(false);
    setActiveIndex(-1);
  }, [onChange]);

  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        handleSelect(filteredOptions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If not selected, revert to selected option name or empty
        if (searchTerm !== selectedOptionName) {
            setSearchTerm(selectedOptionName);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm, selectedOptionName]);

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <div className="relative">
        <Input
          label={label}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (value && e.target.value === '') onChange(null);
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-8 flex items-center pr-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Clear selection"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.id}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(option); }}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 text-slate-900 dark:text-slate-100 ${
                  activeIndex === index ? 'bg-indigo-600 text-white' : ''
                } hover:bg-indigo-500 hover:text-white`}
              >
                <span className="block truncate">{option.name}</span>
                {value === option.id && (
                  <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                      activeIndex === index ? 'text-white' : 'text-indigo-600'
                  }`}>
                    <span className="material-symbols-outlined text-lg">check</span>
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="cursor-default select-none relative py-2 px-3 text-slate-700 dark:text-slate-300">
              No users found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
