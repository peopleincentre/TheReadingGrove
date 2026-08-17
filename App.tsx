import { LibraryProvider } from './context/BookContext';
import LibraryManager from './components/LibraryManager';

function App() {
  return (
    <LibraryProvider>
      <div className="min-h-screen">
        <LibraryManager />
      </div>
    </LibraryProvider>
  );
}

export default App;