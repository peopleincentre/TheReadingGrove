
// This file is structured with the internal IndexedDB implementation first,
// followed by the exported public API for the File System Access feature.

// --- Private IndexedDB Implementation ---

/**
 * A simple wrapper for creating an IndexedDB store.
 */
function createStore(dbName: string, storeName: string): (txMode: IDBTransactionMode, callback: (store: IDBObjectStore) => void) => Promise<void> {
    const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(storeName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return async (txMode: IDBTransactionMode, callback: (store: IDBObjectStore) => void) => {
        const db = await dbPromise;
        const tx = db.transaction(storeName, txMode);
        const store = tx.objectStore(storeName);
        callback(store);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    };
}

const idbStore = createStore('file-system-handles-db', 'file-system-handles');

/**
 * Gets a value from the IndexedDB store.
 */
async function get<T>(key: IDBValidKey): Promise<T | undefined> {
    let req: IDBRequest;
    await idbStore('readonly', store => {
        req = store.get(key);
    });
    return (req! as IDBRequest<T>).result;
}

/**
 * Sets a value in the IndexedDB store.
 */
async function set(key: IDBValidKey, value: any): Promise<void> {
    await idbStore('readwrite', store => {
        store.put(value, key);
    });
}

/**
 * Deletes a value from the IndexedDB store.
 */
async function del(key: IDBValidKey): Promise<void> {
    await idbStore('readwrite', store => {
        store.delete(key);
    });
}


// --- Public File System Access API ---

const FILE_HANDLE_KEY = 'library-file-handle';

/**
 * Saves the file handle to IndexedDB for persistent access.
 */
export async function saveFileHandle(handle: FileSystemFileHandle): Promise<void> {
  await set(FILE_HANDLE_KEY, handle);
}

/**
 * Loads the file handle from IndexedDB.
 */
export async function loadFileHandle(): Promise<FileSystemFileHandle | null> {
  return (await get<FileSystemFileHandle>(FILE_HANDLE_KEY)) ?? null;
}

/**
 * Deletes the file handle from IndexedDB.
 */
export async function deleteFileHandle(): Promise<void> {
    await del(FILE_HANDLE_KEY);
}

/**
 * Verifies (and requests if necessary) read/write permission for a file handle.
 */
export async function verifyFileHandlePermission(handle: FileSystemFileHandle): Promise<boolean> {
  const options = { mode: 'readwrite' as const };
  if ((await (handle as any).queryPermission(options)) === 'granted') {
    return true;
  }
  if ((await (handle as any).requestPermission(options)) === 'granted') {
    return true;
  }
  return false;
}

/**
 * Reads the entire content of a file handle as a string.
 */
export async function readFromFile(handle: FileSystemFileHandle): Promise<string | null> {
  try {
    const file = await handle.getFile();
    const contents = await file.text();
    return contents;
  } catch (error) {
    console.error('Error reading from file:', error);
    return null;
  }
}

/**
 * Writes data to a file handle, overwriting its contents.
 */
export async function writeToFile(handle: FileSystemFileHandle, data: string): Promise<boolean> {
  try {
    const writable = await handle.createWritable();
    await writable.write(data);
    await writable.close();
    return true;
  } catch (error) {
    console.error('Error writing to file:', error);
    return false;
  }
}
