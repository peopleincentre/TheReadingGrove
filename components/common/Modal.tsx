
import React, { ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidthClass?: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children, maxWidthClass = 'max-w-2xl' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className={`relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">{title}</h3>
            <button
                type="button"
                className="text-slate-400 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full p-1.5 inline-flex items-center group"
                onClick={onClose}
                aria-label="Close modal"
            >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">close</span>
            </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
