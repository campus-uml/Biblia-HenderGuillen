import React, { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">📖 Reina Valera</h1>
        <input
          type="text"
          placeholder="Buscar libro..."
          className="p-4 border border-gray-300 rounded-lg w-full mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && <p className="text-gray-600">Cargando...</p>}
        {!selectedBook ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="p-4 bg-purple-100 rounded-lg shadow-md cursor-pointer hover:bg-purple-200 hover:scale-105 transform transition-all duration-300"
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedBook.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="p-4 bg-pink-100 rounded-lg shadow-md cursor-pointer hover:bg-pink-200 hover:scale-105 transform transition-all duration-300"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedChapter.reference}</h3>
            <div className="grid grid-cols-3 gap-4">
              {verses.map((verse) => (
                <div
                  key={verse.id}
                  className="p-4 bg-red-100 rounded-lg shadow-md cursor-pointer hover:bg-red-200 hover:scale-105 transform transition-all duration-300"
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
            <p className="text-gray-800 bg-gray-100 p-6 rounded-lg shadow-inner whitespace-pre-wrap">{verseText || 'Cargando texto...'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ReinaValeraBooks;
