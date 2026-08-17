import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  const inputId = id || props.name;
  return (
    <div className={`relative ${className}`}>
      <input
        id={inputId}
        {...props}
        placeholder=" "
        className="peer block w-full rounded-t-md border-0 border-b-2 border-slate-300 bg-slate-200/50 dark:bg-slate-700/50 px-3 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm text-slate-900 dark:text-white"
      />
      <label
        htmlFor={inputId}
        className="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-3 peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;