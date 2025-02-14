import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase'; // Asegúrate de que esta ruta es correcta
import {
  getReinaValeraBooks,
  getBookChapters,
  getChapterVerses,
  getVerseText,
} from './api';
import { ArrowLeft } from 'lucide-react';

const ReinaValeraBooks: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<any | null>(null);
  const [verseText, setVerseText] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getReinaValeraBooks();
        setBooks(data.data);
        setFilteredBooks(data.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter((book) =>
        book.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, books]);

  const handleBookClick = async (book: any) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setSelectedVerse(null);
    setVerseText(null);
    setVerses([]);
    try {
      setLoading(true);
      const data = await getBookChapters(book.id);
      setChapters(data.data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = async (chapter: any) => {
    setSelectedChapter(chapter);
    setSelectedVerse(null);
    setVerseText(null);
    try {
      setLoading(true);
      const data = await getChapterVerses(chapter.id);
      setVerses(data.data);
    } catch (error) {
      console.error('Error fetching verses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerseClick = async (verse: any) => {
    setSelectedVerse(verse);
    try {
      setLoading(true);
      const data = await getVerseText(verse.id);
      const parser = new DOMParser();
      const parsedDocument = parser.parseFromString(data.data.content, 'text/html');
      const cleanText = parsedDocument.body.textContent || '';
      setVerseText(cleanText);
    } catch (error) {
      console.error('Error fetching verse text:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload(); // Recargar la página para redirigir al login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">📖 Reina Valera</h1>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar libro..."
          className="p-4 border border-gray-300 rounded-lg w-full mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
 
        {!selectedBook ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="p-6 bg-purple-100 rounded-lg shadow-md cursor-pointer hover:bg-purple-200 hover:scale-105 transform transition-all duration-300 text-center"
                onClick={() => handleBookClick(book)}
              >
                <h2 className="text-lg font-bold text-purple-700">{book.name}</h2>
              </div>
            ))}
          </div>
        ) : !selectedChapter ? (
          <>
            <button
              className="mb-6 text-purple-600 flex items-center"
              onClick={() => setSelectedBook(null)}
            >
              <ArrowLeft className="mr-2" /> Volver
            </button>
            <div className="grid grid-cols-4 gap-4 w-full">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="p-6 bg-pink-100 rounded-lg shadow-md cursor-pointer hover:bg-pink-200 hover:scale-105 transform transition-all duration-300 text-center"
                  onClick={() => handleChapterClick(chapter)}
                >
                  <h3 className="text-md font-medium text-pink-700">{chapter.reference}</h3>
                </div>
              ))}
            </div>
          </>
        ) : !selectedVerse ? (
          <>
            <button
              className="mb-6 text-pink-600 flex items-center"
              onClick={() => setSelectedChapter(null)}
            >
              <ArrowLeft className="mr-2" /> Volver
            </button>
            <div className="grid grid-cols-5 gap-4 w-full">
              {verses.map((verse) => (
                <div
                  key={verse.id}
                  className="p-6 bg-red-100 rounded-lg shadow-md cursor-pointer hover:bg-red-200 hover:scale-105 transform transition-all duration-300 text-center"
                  onClick={() => handleVerseClick(verse)}
                >
                  <p className="text-sm font-medium text-red-700">{verse.reference}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              className="mb-6 text-red-600 flex items-center"
              onClick={() => setSelectedVerse(null)}
            >
              <ArrowLeft className="mr-2" /> Volver
            </button>
            <p className="text-gray-800 bg-gray-100 p-6 rounded-lg shadow-inner whitespace-pre-wrap w-full text-center">{verseText || 'Cargando'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ReinaValeraBooks;
