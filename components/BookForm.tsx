

import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { useLibrary } from '../context/BookContext';
import Input from './common/Input';
import Select from './common/Select';
import Button from './common/Button';

interface BookFormProps {
  bookToEdit: Book | null;
  onFinished: () => void;
}

type BookFormData = Omit<Book, 'id' | 'borrowingHistory'>;

const BookForm: React.FC<BookFormProps> = ({ bookToEdit, onFinished }) => {
  const { addBook, updateBook, generateAccessionNumber, subjects, shelves } = useLibrary();
  
  const getInitialState = (): BookFormData => {
    const defaultSubjectCode = subjects[0]?.code || '';
    return {
      accessionNumber: bookToEdit ? bookToEdit.accessionNumber : generateAccessionNumber(defaultSubjectCode),
      title: '',
      authors: '',
      subjectCode: defaultSubjectCode,
      keywords: '',
      publisher: '',
      year: new Date().getFullYear(),
      isbn: '',
      copies: bookToEdit ? bookToEdit.copies : 1,
      shelfId: shelves[0]?.id || '',
      remarks: '',
    };
  };

  const [formData, setFormData] = useState<BookFormData>(getInitialState());

  useEffect(() => {
    if (bookToEdit) {
      const { borrowingHistory, ...editableData } = bookToEdit;
      setFormData(editableData);
    } else {
      setFormData(getInitialState());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookToEdit, subjects, shelves]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
        const newState = { ...prev, [name]: (name === 'year' || name === 'copies') ? parseInt(value) || 0 : value };
        
        if (name === 'subjectCode' && !bookToEdit) {
            newState.accessionNumber = generateAccessionNumber(value);
        }
        
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.authors || !formData.subjectCode) {
        alert("Please fill in Title, Author(s), and Subject.");
        return;
    }
    
    if (bookToEdit) {
      updateBook({ ...formData, id: bookToEdit.id, borrowingHistory: bookToEdit.borrowingHistory });
    } else {
      addBook(formData);
    }
    onFinished();
  };

  const selectedSubject = subjects.find(s => s.code === formData.subjectCode);
  const accentColor = selectedSubject ? selectedSubject.cardColor.replace('bg-', 'border-') : 'border-transparent';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className={`p-3 rounded-md bg-indigo-100/60 dark:bg-slate-700/50 border-l-4 ${accentColor} transition-colors`}>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Accession Number</label>
        <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{formData.accessionNumber}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <Input label="Title" id="title" name="title" value={formData.title} onChange={handleChange} required />
        <Input label="Author(s)" id="authors" name="authors" value={formData.authors} onChange={handleChange} required />
        <Select label="Subject" id="subjectCode" name="subjectCode" value={formData.subjectCode} onChange={handleChange} required>
            <option value="" disabled>Select a subject</option>
            {subjects.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
        </Select>
        <Select label="Shelf Location" id="shelfId" name="shelfId" value={formData.shelfId} onChange={handleChange}>
            <option value="">Unshelved</option>
            {shelves.sort((a,b) => a.name.localeCompare(b.name)).map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
        </Select>
        <Input label="Publisher" id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} />
        <Input label="Year" id="year" name="year" type="number" value={formData.year} onChange={handleChange} />
        <Input label="Copies" id="copies" name="copies" type="number" min={1} value={formData.copies} onChange={handleChange} />
        <Input label="ISBN" id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} />
        <Input label="Keywords (comma-separated)" id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} />
      </div>

      <div className="relative">
        <textarea
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          rows={3}
          placeholder=" "
          className="peer block w-full rounded-t-md border-0 border-b-2 border-slate-300 bg-slate-200/50 dark:bg-slate-700/50 px-3 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-0 sm:text-sm"
        />
        <label htmlFor="remarks" className="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-3 peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
            Remarks
        </label>
      </div>


      <div className="flex justify-end gap-3 pt-4">
          <Button type="button" onClick={onFinished} variant="text">Cancel</Button>
          <Button type="submit" variant="filled">{bookToEdit ? 'Save Changes' : 'Add Book'}</Button>
      </div>
    </form>
  );
};

export default BookForm;
