import axios from 'axios';

const API_KEY = '44c6a11ef0ff48480269569370e5af01'; // Reemplaza con tu API Key
const BASE_URL = 'https://api.scripture.api.bible/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'api-key': '44c6a11ef0ff48480269569370e5af01',
  },
});

export const getReinaValeraBooks = async () => {
  const reinaValeraId = "592420522e16049f-01"; // ID de la Biblia Reina Valera 1960
  const response = await api.get(`/bibles/${reinaValeraId}/books`);
  return response.data;
};

export const getBookChapters = async (bookId: string) => {
  const response = await api.get(`/bibles/de4e12af7f28f599-02/books/${bookId}/chapters`);
  return response.data;
};

export const getChapterVerses = async (chapterId: string) => {
  const response = await api.get(`/bibles/de4e12af7f28f599-02/chapters/${chapterId}/verses`);
  return response.data;
};

export const getVerseText = async (verseId: string) => {
  const response = await api.get(`/bibles/de4e12af7f28f599-02/verses/${verseId}`);
  return response.data;
};
