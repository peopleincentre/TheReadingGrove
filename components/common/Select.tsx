import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const Select: React.FC<SelectProps> = ({ label, id, className = '', children, ...props }) => {
  const selectId = id || props.name;
  return (
    <div className={`relative ${className}`}>
      <select
        id={selectId}
        {...props}
        className="peer block w-full appearance-none rounded-t-md border-0 border-b-2 border-slate-300 bg-slate-200/50 dark:bg-slate-700/50 px-3 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm text-slate-900 dark:text-white"
      >
        {children}
      </select>
      <label
        htmlFor={selectId}
        className="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-3 peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400"
      >
        {label}
      </label>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
        <span className="material-symbols-outlined">arrow_drop_down</span>
      </div>
    </div>
  );
};

export default Select;