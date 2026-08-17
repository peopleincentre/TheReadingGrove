
import React from 'react';
import { Book, BorrowingRecord, User } from '../types';
import Modal from './common/Modal';

interface DefaultersModalProps {
  defaulters: { book: Book; loan: BorrowingRecord; user: User }[];
  onClose: () => void;
}

const DefaultersModal: React.FC<DefaultersModalProps> = ({ defaulters, onClose }) => {
  const calculateOverdueDays = (borrowedDate: string) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(borrowedDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays - 14; // Return days past the 14-day limit
  };

  return (
    <Modal onClose={onClose} title="Overdue Books" maxWidthClass="max-w-3xl">
      <div className="space-y-4">
        {defaulters.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-5xl text-green-500">task_alt</span>
            <p className="mt-4 font-medium">No overdue books!</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">All books have been returned on time.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {defaulters.map(({ book, loan, user }) => (
              <li key={book.id} className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{book.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Borrowed by <span className="font-medium">{user.name}</span> on {new Date(loan.borrowedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-red-500">{calculateOverdueDays(loan.borrowedDate)}</p>
                    <p className="text-xs text-red-500/80">days overdue</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default DefaultersModal;
