import axios from 'axios';

// Configuración de Axios con las variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_BIBLE_API_URL,
  headers: {
    'api-key': import.meta.env.VITE_BIBLE_API_KEY,
  },
});

// Obtención del ID de la Biblia desde las variables de entorno
const reinaValeraId = import.meta.env.VITE_BIBLE_ID;

// Funciones de la API
export const getReinaValeraBooks = async () => {
  const response = await api.get(`/bibles/${reinaValeraId}/books`);
  return response.data;
};

export const getBookChapters = async (bookId: string) => {
  const response = await api.get(`/bibles/${reinaValeraId}/books/${bookId}/chapters`);
  return response.data;
};

export const getChapterVerses = async (chapterId: string) => {
  const response = await api.get(`/bibles/${reinaValeraId}/chapters/${chapterId}/verses`);
  return response.data;
};

export const getVerseText = async (verseId: string) => {
  const response = await api.get(`/bibles/${reinaValeraId}/verses/${verseId}`);
  return response.data;
}