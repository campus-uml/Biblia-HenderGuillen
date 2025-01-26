import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_BIBLE_API_URL,
  headers: {
    'api-key': import.meta.env.VITE_BIBLE_API_KEY,
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
