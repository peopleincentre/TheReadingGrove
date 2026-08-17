import React from 'react';
import Button from './common/Button';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenDefaulters: () => void;
  onOpenPrint: () => void;
  defaulterCount: number;
  totalBooks: number;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenDefaulters, onOpenPrint, defaulterCount, totalBooks }) => {
  return (
    <header className="bg-indigo-600 shadow-md sticky top-0 z-30 no-print">
      <div className="container mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-3xl">local_library</span>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold text-white font-roboto-slab">
                  The Reading Grove
                </h1>
                <a 
                  href="https://www.peopleincentre.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-indigo-200 hover:text-white hover:underline transition-colors duration-200"
                >
                  by PiC
                </a>
              </div>
              <p className="text-xs text-indigo-200 font-bold">{totalBooks} {totalBooks === 1 ? 'book' : 'books'} in library</p>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
             <Button onClick={onOpenDefaulters} variant="icon" aria-label="Notifications">
                <div className="relative">
                    <span className="material-symbols-outlined">notifications</span>
                    {defaulterCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {defaulterCount}
                        </span>
                    )}
                </div>
            </Button>
            <Button onClick={onOpenPrint} variant="icon" aria-label="Print List">
                <span className="material-symbols-outlined">print</span>
            </Button>
            <Button onClick={onOpenSettings} variant="icon" aria-label="Settings">
                <span className="material-symbols-outlined">settings</span>
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;