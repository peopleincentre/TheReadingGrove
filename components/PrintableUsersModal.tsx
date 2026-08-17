
import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/BookContext';
import { User } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';

interface PrintableUsersModalProps {
  onClose: () => void;
}

type SortOrder = 'name' | 'memberId';

const PrintableUsersModal: React.FC<PrintableUsersModalProps> = ({ onClose }) => {
    const { users } = useLibrary();
    const [sortOrder, setSortOrder] = useState<SortOrder>('name');

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            if (sortOrder === 'name') {
                return a.name.localeCompare(b.name);
            }
            return a.memberId.localeCompare(b.memberId);
        });
    }, [users, sortOrder]);

    const renderTable = (userList: User[]) => (
        <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-100">
                <tr>
                    <th className="px-4 py-2 border">Member ID</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Phone Number</th>
                    <th className="px-4 py-2 border">Address</th>
                </tr>
            </thead>
            <tbody>
                {userList.map(user => (
                    <tr key={user.id} className="border-b">
                        <td className="px-4 py-2 border">{user.memberId}</td>
                        <td className="px-4 py-2 border">{user.name}</td>
                        <td className="px-4 py-2 border">{user.email}</td>
                        <td className="px-4 py-2 border">{user.phoneNumber}</td>
                        <td className="px-4 py-2 border">{user.address || 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <Modal onClose={onClose} title="Printable User List" maxWidthClass="max-w-5xl">
            <div className="space-y-6">
                <div className="no-print flex flex-wrap justify-between items-center gap-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Sort by:</span>
                        <Button variant={sortOrder === 'name' ? 'filled' : 'outlined'} onClick={() => setSortOrder('name')}>Name</Button>
                        <Button variant={sortOrder === 'memberId' ? 'filled' : 'outlined'} onClick={() => setSortOrder('memberId')}>Member ID</Button>
                    </div>
                    <Button variant="filled" onClick={() => window.print()}>
                        <span className="material-symbols-outlined mr-2">print</span>
                        Print
                    </Button>
                </div>
                <div id="printable-area">
                    <h2 className="text-2xl font-bold text-center mb-4">The Reading Grove - User List</h2>
                    <p className="text-center text-sm text-slate-600 mb-6">Generated on: {new Date().toLocaleDateString()}</p>
                    {users.length > 0 ? renderTable(sortedUsers) : <p className="text-center">No users in the database.</p>}
                </div>
            </div>
        </Modal>
    );
};

export default PrintableUsersModal;
