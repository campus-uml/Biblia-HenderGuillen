import React, { useEffect, useState } from 'react';
import {
  getReinaValeraBooks,
  getBookChapters,
  getChapterVerses,
  getVerseText,
} from './api'; // Importa las funciones de la API
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

  // Cargar todos los libros al iniciar
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getReinaValeraBooks();
        setBooks(data.data);
        setFilteredBooks(data.data); // Inicializa libros filtrados
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filtrar libros en tiempo real
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

      // Limpia el contenido eliminando etiquetas HTML
      const parser = new DOMParser();
      const parsedDocument = parser.parseFromString(data.data.content, 'text/html');
      const cleanText = parsedDocument.body.textContent || ''; // Extrae solo texto puro

      setVerseText(cleanText);
    } catch (error) {
      console.error('Error fetching verse text:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          📖 Biblia Reina Valera
        </h1>
        <input
          type="text"
          placeholder="Buscar libro..."
          className="p-3 border rounded-lg w-full mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && <p className="text-gray-500">Cargando...</p>}
        {!selectedBook ? (
          <ul className="space-y-4">
            {filteredBooks.map((book) => (
              <li
                key={book.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => handleBookClick(book)}
              >
                {book.name}
              </li>
            ))}
          </ul>
        ) : !selectedChapter ? (
          <>
            <button
              className="mb-4 text-blue-500 flex items-center"
              onClick={() => {
                setSelectedBook(null);
                setChapters([]);
              }}
            >
              <ArrowLeft className="mr-2" /> Volver a los libros
            </button>
            <h2 className="text-lg font-bold mb-4">{selectedBook.name}</h2>
            <ul className="space-y-2">
              {chapters.map((chapter) => (
                <li
                  key={chapter.id}
                  className="p-2 border rounded-lg cursor-pointer hover:bg-gray-200"
                  onClick={() => handleChapterClick(chapter)}
                >
                  {chapter.reference}
                </li>
              ))}
            </ul>
          </>
        ) : !selectedVerse ? (
          <>
            <button
              className="mb-4 text-blue-500 flex items-center"
              onClick={() => {
                setSelectedChapter(null);
                setVerses([]);
              }}
            >
              <ArrowLeft className="mr-2" /> Volver a los capítulos
            </button>
            <h3 className="text-lg font-bold mb-4">{selectedChapter.reference}</h3>
            <ul className="space-y-2">
              {verses.map((verse) => (
                <li
                  key={verse.id}
                  className="p-2 border rounded-lg cursor-pointer hover:bg-gray-200"
                  onClick={() => handleVerseClick(verse)}
                >
                  {verse.reference}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <button
              className="mb-4 text-blue-500 flex items-center"
              onClick={() => {
                setSelectedVerse(null);
              }}
            >
              <ArrowLeft className="mr-2" /> Volver a los versículos
            </button>
            <p className="text-lg text-gray-700 whitespace-pre-wrap">
              {verseText || 'Cargando texto...'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ReinaValeraBooks;
