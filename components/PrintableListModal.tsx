import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/BookContext';
import { Book } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';

interface PrintableListModalProps {
  onClose: () => void;
}

type SortOrder = 'subject' | 'author' | 'shelf' | 'title';

const PrintableListModal: React.FC<PrintableListModalProps> = ({ onClose }) => {
    const { books, subjects, shelves } = useLibrary();
    const [sortOrder, setSortOrder] = useState<SortOrder>('subject');

    const sortedList = useMemo(() => {
        const getSubjectName = (code: string) => subjects.find(s => s.code === code)?.name || code;
        const getShelfName = (id: string) => shelves.find(s => s.id === id)?.name || 'Unshelved';

        switch (sortOrder) {
            case 'author':
                return [...books].sort((a, b) => a.authors.localeCompare(b.authors));
            case 'title':
                return [...books].sort((a, b) => a.title.localeCompare(b.title));
            case 'subject': {
                const grouped = books.reduce((acc, book) => {
                    const subjectName = getSubjectName(book.subjectCode);
                    if (!acc[subjectName]) acc[subjectName] = [];
                    acc[subjectName].push(book);
                    return acc;
                }, {} as Record<string, Book[]>);
                Object.keys(grouped).forEach(key => {
                    grouped[key].sort((a, b) => a.title.localeCompare(b.title));
                });
                return grouped;
            }
            case 'shelf': {
                const grouped = books.reduce((acc, book) => {
                    const shelfName = getShelfName(book.shelfId);
                    if (!acc[shelfName]) acc[shelfName] = [];
                    acc[shelfName].push(book);
                    return acc;
                }, {} as Record<string, Book[]>);
                Object.keys(grouped).forEach(key => {
                    grouped[key].sort((a, b) => a.title.localeCompare(b.title));
                });
                return grouped;
            }
        }
    }, [books, subjects, shelves, sortOrder]);

    const renderList = () => {
        const renderTable = (bookList: Book[]) => (
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-2 border">Acc. No.</th>
                        <th className="px-4 py-2 border">Title</th>
                        <th className="px-4 py-2 border">Author(s)</th>
                        <th className="px-4 py-2 border">Copies</th>
                        <th className="px-4 py-2 border">Shelf</th>
                    </tr>
                </thead>
                <tbody>
                    {bookList.map(book => (
                        <tr key={book.id} className="border-b">
                            <td className="px-4 py-2 border">{book.accessionNumber}</td>
                            <td className="px-4 py-2 border">{book.title}</td>
                            <td className="px-4 py-2 border">{book.authors}</td>
                            <td className="px-4 py-2 border">{book.copies || 1}</td>
                            <td className="px-4 py-2 border">{shelves.find(s => s.id === book.shelfId)?.name || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
        
        if (Array.isArray(sortedList)) {
            return renderTable(sortedList);
        } else {
            return Object.entries(sortedList)
                .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
                .map(([groupName, groupBooks]) => (
                    <div key={groupName} className="mb-6 break-inside-avoid">
                        <h4 className="text-xl font-bold mt-4 mb-2 p-2 bg-slate-200">{groupName}</h4>
                        {renderTable(groupBooks)}
                    </div>
                ));
        }
    };

    return (
        <Modal onClose={onClose} title="Printable Book List" maxWidthClass="max-w-5xl">
            <div className="space-y-6">
                <div className="no-print flex flex-wrap justify-between items-center gap-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Sort by:</span>
                        <Button variant={sortOrder === 'subject' ? 'filled' : 'outlined'} onClick={() => setSortOrder('subject')}>Subject</Button>
                        <Button variant={sortOrder === 'author' ? 'filled' : 'outlined'} onClick={() => setSortOrder('author')}>Author</Button>
                        <Button variant={sortOrder === 'shelf' ? 'filled' : 'outlined'} onClick={() => setSortOrder('shelf')}>Shelf</Button>
                        <Button variant={sortOrder === 'title' ? 'filled' : 'outlined'} onClick={() => setSortOrder('title')}>Title</Button>
                    </div>
                    <Button variant="filled" onClick={() => window.print()}>
                        <span className="material-symbols-outlined mr-2">print</span>
                        Print
                    </Button>
                </div>
                <div id="printable-area">
                    <h2 className="text-2xl font-bold text-center mb-4">The Reading Grove - Book List</h2>
                    <p className="text-center text-sm text-slate-600 mb-6">Generated on: {new Date().toLocaleDateString()}</p>
                    {renderList()}
                </div>
            </div>
        </Modal>
    );
};

export default PrintableListModal;