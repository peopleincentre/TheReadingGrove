
import React, { useState } from 'react';
import { Book } from '../types';
import { useLibrary } from '../context/BookContext';
import Modal from './common/Modal';
import Button from './common/Button';
import SearchableSelect from './common/SearchableSelect';

interface BorrowReturnModalProps {
  book: Book;
  onClose: () => void;
  onEdit: (book: Book) => void;
}

const BorrowReturnModal: React.FC<BorrowReturnModalProps> = ({ book, onClose, onEdit }) => {
  const { users, borrowBook, returnBook, deleteBook } = useLibrary();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const history = book.borrowingHistory || [];
  const activeLoans = history
    .map((record, index) => ({ record, index }))
    .filter(item => item.record.returnedDate === null);
  const copies = book.copies || 1;
  const available = Math.max(copies - activeLoans.length, 0);

  const handleBorrow = () => {
    if (selectedUserId) {
      borrowBook(book.id, selectedUserId);
      setSelectedUserId(null);
    } else {
      alert('Please select a borrower.');
    }
  };

  const handleReturn = (loanIndex: number) => {
    returnBook(book.id, loanIndex);
  };
  
  const handleDelete = () => {
    deleteBook(book.id);
    onClose();
  }

  const sortedHistory = [...history].reverse();

  return (
    <Modal onClose={onClose} title={book.title}>
      <div className="space-y-6">
        {/* Current Status & Actions */}
        <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-4">
            <h4 className="text-lg font-medium">Status</h4>
            <p className="text-sm">
                <span className="font-medium">Available:</span> {available} of {copies} copies
            </p>
            {available > 0 && (
                <div className="space-y-3">
                    <p className="font-medium">Borrow a copy</p>
                    <div className="flex items-start gap-3">
                        <SearchableSelect
                            label="Select Borrower"
                            options={users.map(u => ({ id: u.id, name: `${u.name} (${u.memberId})` }))}
                            value={selectedUserId}
                            onChange={setSelectedUserId}
                            className="flex-grow"
                        />
                        <Button variant="filled" onClick={handleBorrow} className="!mt-2" disabled={!selectedUserId}>Borrow</Button>
                    </div>
                </div>
            )}
            {activeLoans.length > 0 && (
                <div className="space-y-2">
                    <p className="font-medium">Currently borrowed by:</p>
                    {activeLoans.map(({ record, index }) => {
                        const borrower = users.find(u => u.id === record.borrowerId);
                        return (
                            <div key={index} className="p-3 bg-white dark:bg-slate-800 rounded-md flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p>{borrower?.name || 'Unknown User'}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Borrowed on: {new Date(record.borrowedDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <Button variant="filled" size="sm" onClick={() => handleReturn(index)}>Mark as Returned</Button>
                            </div>
                        );
                    })}
                </div>
            )}
            {available === 0 && activeLoans.length === 0 && (
                <p className="font-medium">Available</p>
            )}
        </div>
        
        {/* Borrowing History */}
        {sortedHistory.length > 0 && (
            <div>
                 <h4 className="text-lg font-medium mb-3">Borrowing History</h4>
                 <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {sortedHistory.map((record, index) => {
                       const borrower = users.find(u => u.id === record.borrowerId);
                       return (
                        <div key={index} className="p-3 bg-white dark:bg-slate-800 rounded-md text-sm">
                            <p><span className="font-semibold">Borrower:</span> {borrower?.name || 'Unknown User'}</p>
                            <p className="text-slate-600 dark:text-slate-400">
                                <span className="font-semibold">From:</span> {new Date(record.borrowedDate).toLocaleDateString()}
                                <span className="font-semibold mx-2">To:</span> 
                                {record.returnedDate ? new Date(record.returnedDate).toLocaleDateString() : 'Present'}
                            </p>
                        </div>
                       );
                    })}
                 </div>
            </div>
        )}

        {/* Book Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <Button variant="text" className="!text-red-600 dark:!text-red-500" onClick={handleDelete}>
                Delete Book
            </Button>
            <Button variant="outlined" onClick={() => onEdit(book)}>
                Edit Details
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BorrowReturnModal;
