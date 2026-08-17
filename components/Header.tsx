import React from 'react';

interface HeaderProps {
  totalBooks: number;
  totalSubjects: number;
}

const Header: React.FC<HeaderProps> = ({ totalBooks, totalSubjects }) => {
  return (
    <header className="bg-indigo-600 shadow-md sticky top-0 z-30">
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
            <p className="text-xs text-indigo-200 font-bold">
              {totalBooks} books · {totalSubjects} subjects
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;