

import React, { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { useLibrary } from '../context/BookContext';
import { Subject, Shelf, User } from '../types';
import { COLOR_PALETTE } from '../constants';
import Modal from './common/Modal';
import Button from './common/Button';
import Input from './common/Input';
import PrintableUsersModal from './PrintableUsersModal';
import { exportToCSV } from '../utils/export';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'subjects' | 'shelves' | 'users' | 'data'>('subjects');

    return (
        <Modal onClose={onClose} title="Settings" maxWidthClass="max-w-3xl">
            <div className="w-full">
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('subjects')} className={`${activeTab === 'subjects' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Subjects
                        </button>
                        <button onClick={() => setActiveTab('shelves')} className={`${activeTab === 'shelves' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Shelves
                        </button>
                         <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Users
                        </button>
                        <button onClick={() => setActiveTab('data')} className={`${activeTab === 'data' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Data
                        </button>
                    </nav>
                </div>
                <div className="pt-6">
                    {activeTab === 'subjects' && <SubjectSettings />}
                    {activeTab === 'shelves' && <ShelfSettings />}
                    {activeTab === 'users' && <UserSettings />}
                    {activeTab === 'data' && <DataSettings />}
                </div>
            </div>
        </Modal>
    );
};

const DataSettings = () => {
    const { books, subjects, shelves, exportLibrary, importLibrary, importBooksFromCSV } = useLibrary();
    const jsonFileInputRef = useRef<HTMLInputElement>(null);
    const csvFileInputRef = useRef<HTMLInputElement>(null);

    const handleImportJsonClick = () => {
        jsonFileInputRef.current?.click();
    };

    const handleJsonFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await importLibrary(file);
                alert("Library imported successfully!");
            } catch (error) {
                // Error is already handled and alerted within the context function.
                console.error("Import process failed:", error);
            } finally {
                 // Reset file input to allow importing the same file again
                if (jsonFileInputRef.current) {
                    jsonFileInputRef.current.value = '';
                }
            }
        }
    };
    
    const handleImportCsvClick = () => {
        csvFileInputRef.current?.click();
    };

    const handleCsvFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const result = await importBooksFromCSV(file);
                alert(`Import complete!\n\n- ${result.imported} books imported.\n- ${result.skipped} books skipped.\n\nCheck the developer console for details on skipped books.`);
            } catch (error) {
                if ((error as Error).message !== "Import cancelled by user.") {
                    alert(`Failed to import from CSV: ${(error as Error).message}`);
                }
                console.error("CSV import process failed:", error);
            } finally {
                if (csvFileInputRef.current) {
                    csvFileInputRef.current.value = '';
                }
            }
        }
    };

    const handleExportCSV = () => {
        if (books.length === 0) {
            alert("No books to export.");
            return;
        }
        const dataToExport = books.map(book => {
            const subjectName = subjects.find(s => s.code === book.subjectCode)?.name || book.subjectCode;
            const shelfName = shelves.find(s => s.id === book.shelfId)?.name || 'N/A';
            return {
                accessionNumber: book.accessionNumber,
                title: book.title,
                authors: book.authors,
                subject: subjectName,
                keywords: book.keywords,
                publisher: book.publisher,
                year: book.year,
                isbn: book.isbn,
                copies: book.copies,
                shelfLocation: shelfName,
                remarks: book.remarks,
            };
        });
        exportToCSV(dataToExport, 'the_reading_grove_books.csv');
    };

    return (
        <div className="space-y-6">
            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Export your entire library (JSON) for backup. Import a JSON file to replace your current library. You can also import or export a list of books in CSV format.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                    <Button variant="outlined" onClick={exportLibrary}>
                        <span className="material-symbols-outlined mr-2">archive</span>
                        Export Library (JSON)
                    </Button>
                     <Button variant="outlined" onClick={handleExportCSV}>
                        <span className="material-symbols-outlined mr-2">description</span>
                        Export Books (CSV)
                    </Button>
                    <Button variant="filled" onClick={handleImportJsonClick}>
                         <span className="material-symbols-outlined mr-2">unarchive</span>
                        Import Library (JSON)
                    </Button>
                     <Button variant="filled" onClick={handleImportCsvClick}>
                         <span className="material-symbols-outlined mr-2">upload_file</span>
                        Import Books (CSV)
                    </Button>
                    <input
                        type="file"
                        ref={jsonFileInputRef}
                        onChange={handleJsonFileChange}
                        accept="application/json"
                        className="hidden"
                    />
                    <input
                        type="file"
                        ref={csvFileInputRef}
                        onChange={handleCsvFileChange}
                        accept=".csv,text/csv"
                        className="hidden"
                    />
                </div>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg space-y-3">
                <h3 className="text-lg font-medium">CSV Import Instructions</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your CSV file must contain the following headers: <br/>
                    <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">title</code>,
                    <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">authors</code>,
                    <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">subject</code>.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Optional headers are:
                     <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">accessionNumber</code>,
                     <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">shelfLocation</code>,
                     <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">keywords</code>,
                     <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">publisher</code>,
                     <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">year</code>,
                     <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">isbn</code>,
                     <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">copies</code>,
                     <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">remarks</code>.
                </p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1">
                    <li>The <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">subject</code> must exactly match the name of an existing subject (case-insensitive). Rows with unknown subjects will be skipped.</li>
                    <li>If <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">accessionNumber</code> is left blank, a new one will be automatically generated. If provided, it must not already exist in the library.</li>
                    <li>If <code className="text-xs bg-slate-200 dark:bg-slate-700 p-1 rounded">shelfLocation</code> is provided, it must match an existing shelf name. If left blank, the book will be imported as "unshelved".</li>
                </ul>
            </div>
        </div>
    );
};


const getInitialSubjectState = (): Subject => {
    const defaultColor = COLOR_PALETTE[0];
    return {
        code: '',
        name: '',
        color: defaultColor.color,
        cardColor: defaultColor.cardColor,
        borderColor: defaultColor.borderColor,
    };
};

const SubjectSettings = () => {
    const { subjects, addSubject, updateSubject, deleteSubject } = useLibrary();
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [formData, setFormData] = useState<Subject>(getInitialSubjectState());

    const handleEditClick = (subject: Subject) => {
        setEditingSubject(subject);
        setFormData(subject);
    };

    const handleCancelEdit = () => {
        setEditingSubject(null);
        setFormData(getInitialSubjectState());
    };
    
    const handleColorSelect = (colorTheme: typeof COLOR_PALETTE[0]) => {
        setFormData(prev => ({
            ...prev,
            color: colorTheme.color,
            cardColor: colorTheme.cardColor,
            borderColor: colorTheme.borderColor,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.code || !formData.name) {
            alert("Subject Code and Name are required.");
            return;
        }
        if (editingSubject) {
            updateSubject(formData);
        } else {
            if (subjects.some(s => s.code.toUpperCase() === formData.code.toUpperCase())) {
                alert('A subject with this code already exists.');
                return;
            }
            addSubject({...formData, code: formData.code.toUpperCase()});
        }
        handleCancelEdit();
    };

    return (
        <div className="space-y-6">
            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg space-y-6">
                <h3 className="text-lg font-medium">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <Input label="Code" id="code" name="code" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g., HIS" maxLength={4} required disabled={!!editingSubject} />
                        <Input label="Name" id="name" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., History" required />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject Color</label>
                        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
                            {COLOR_PALETTE.map(colorTheme => (
                                <button
                                    type="button"
                                    key={colorTheme.name}
                                    onClick={() => handleColorSelect(colorTheme)}
                                    className={`w-8 h-8 rounded-full ${colorTheme.cardColor} transition-all duration-150 ${formData.cardColor === colorTheme.cardColor ? 'ring-2 ring-offset-2 ring-indigo-500 ring-offset-slate-100 dark:ring-offset-slate-800' : 'hover:scale-110'}`}
                                    aria-label={`Select color ${colorTheme.name}`}
                                ></button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        {editingSubject && <Button type="button" variant="text" onClick={handleCancelEdit}>Cancel</Button>}
                        <Button type="submit" variant="filled">{editingSubject ? 'Save Changes' : 'Add Subject'}</Button>
                    </div>
                </form>
            </div>
            <ul className="space-y-2">
                {subjects.sort((a,b) => a.code.localeCompare(b.code)).map(subject => (
                    <li key={subject.code} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-md shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className={`w-4 h-4 rounded-full ${subject.cardColor}`}></span>
                            <span className="font-bold">{subject.code}</span>
                            <span>{subject.name}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outlined" onClick={() => handleEditClick(subject)}>Edit</Button>
                            <Button size="sm" variant="text" className="!text-red-600 dark:!text-red-500" onClick={() => deleteSubject(subject.code)}>Delete</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ShelfSettings = () => {
    const { shelves, addShelf, updateShelf, deleteShelf } = useLibrary();
    const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);
    const [name, setName] = useState('');

    const handleEditClick = (shelf: Shelf) => {
        setEditingShelf(shelf);
        setName(shelf.name);
    };

    const handleCancelEdit = () => {
        setEditingShelf(null);
        setName('');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if(!name.trim()) {
            alert('Shelf name cannot be empty.');
            return;
        }
        if (editingShelf) {
            updateShelf({ ...editingShelf, name });
        } else {
            if (shelves.some(s => s.name.toLowerCase() === name.toLowerCase())) {
                alert('A shelf with this name already exists.');
                return;
            }
            addShelf({ name });
        }
        handleCancelEdit();
    };

    return (
        <div className="space-y-6">
            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <form onSubmit={handleSubmit} className="flex items-start gap-4">
                    <Input label={editingShelf ? 'Edit Shelf Name' : 'New Shelf Name'} id="shelf-name" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., S5-C2" required className="flex-grow" />
                    <div className="flex gap-2 pt-2">
                        {editingShelf && <Button type="button" variant="text" onClick={handleCancelEdit}>Cancel</Button>}
                        <Button type="submit" variant="filled">{editingShelf ? 'Save' : 'Add'}</Button>
                    </div>
                </form>
            </div>
            <ul className="space-y-2">
                {shelves.sort((a,b) => a.name.localeCompare(b.name)).map(shelf => (
                    <li key={shelf.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-md shadow-sm">
                        <span className="font-medium">{shelf.name}</span>
                        <div className="flex gap-2">
                             <Button size="sm" variant="outlined" onClick={() => handleEditClick(shelf)}>Edit</Button>
                             <Button size="sm" variant="text" className="!text-red-600 dark:!text-red-500" onClick={() => deleteShelf(shelf.id)}>Delete</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const getInitialUserState = (): Partial<User> => ({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
});

const UserSettings = () => {
    const { users, addUser, updateUser, deleteUser } = useLibrary();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>(getInitialUserState());
    const [isPrintUsersOpen, setIsPrintUsersOpen] = useState(false);

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setFormData(user);
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setFormData(getInitialUserState());
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phoneNumber) {
            alert("Name, Email, and Phone Number are required.");
            return;
        }

        if (editingUser) {
            updateUser(formData as User);
        } else {
            addUser(formData as Omit<User, 'id' | 'memberId'>);
        }
        handleCancelEdit();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <>
            {isPrintUsersOpen && <PrintableUsersModal onClose={() => setIsPrintUsersOpen(false)} />}
            <div className="space-y-6">
                <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                        <Button variant="text" onClick={() => setIsPrintUsersOpen(true)}>
                            <span className="material-symbols-outlined mr-2">print</span>
                            Print List
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                            <Input label="Full Name" id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
                            <Input label="Member ID" id="memberId" name="memberId" value={editingUser ? formData.memberId! : 'Auto-generated'} disabled />
                            <Input label="Email" id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
                            <Input label="Phone Number" id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber || ''} onChange={handleChange} required />

                            <div className="relative md:col-span-2">
                                <textarea
                                id="address"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder=" "
                                className="peer block w-full rounded-t-md border-0 border-b-2 border-slate-300 bg-slate-200/50 dark:bg-slate-700/50 px-3 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm"
                                />
                                <label htmlFor="address" className="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-3 peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                                    Address (Optional)
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            {editingUser && <Button type="button" variant="text" onClick={handleCancelEdit}>Cancel</Button>}
                            <Button type="submit" variant="filled">{editingUser ? 'Save Changes' : 'Add User'}</Button>
                        </div>
                    </form>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {users.sort((a, b) => a.name.localeCompare(b.name)).map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-md shadow-sm">
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{user.memberId} · {user.phoneNumber}{user.email && ` · ${user.email}`}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outlined" onClick={() => handleEditClick(user)}>Edit</Button>
                                <Button size="sm" variant="text" className="!text-red-600 dark:!text-red-500" onClick={() => deleteUser(user.id)}>Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};


export default SettingsModal;
