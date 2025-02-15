import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReinaValeraBooks from '../components/ui/ReinaValeraBooks';
import { getReinaValeraBooks, getBookChapters, getChapterVerses, getVerseText } from '../components/ui/api';
import { vi } from 'vitest';

vi.mock('../components/ui/api');

describe('ReinaValeraBooks Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component and fetch books', async () => {
    const mockBooks = [{ id: '1', name: 'Genesis' }, { id: '2', name: 'Exodus' }];
    getReinaValeraBooks.mockResolvedValue({ data: mockBooks });

    render(<ReinaValeraBooks />);

    await waitFor(() => {
      expect(screen.getByText('📖 Reina Valera')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar libro...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Genesis')).toBeInTheDocument();
      expect(screen.getByText('Exodus')).toBeInTheDocument();
    });
  });

  it('should filter books based on search input', async () => {
    const mockBooks = [{ id: '1', name: 'Genesis' }, { id: '2', name: 'Exodus' }];
    getReinaValeraBooks.mockResolvedValue({ data: mockBooks });

    render(<ReinaValeraBooks />);

    await waitFor(() => {
      expect(screen.getByText('Genesis')).toBeInTheDocument();
      expect(screen.getByText('Exodus')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Buscar libro...'), { target: { value: 'Gen' } });

    await waitFor(() => {
      expect(screen.getByText('Genesis')).toBeInTheDocument();
      expect(screen.queryByText('Exodus')).not.toBeInTheDocument();
    });
  });

  it('should fetch and display chapters when a book is clicked', async () => {
    const mockBooks = [{ id: '1', name: 'Genesis' }];
    const mockChapters = [{ id: '1', reference: 'Genesis 1' }, { id: '2', reference: 'Genesis 2' }];
    getReinaValeraBooks.mockResolvedValue({ data: mockBooks });
    getBookChapters.mockResolvedValue({ data: mockChapters });

    render(<ReinaValeraBooks />);

    await waitFor(() => {
      expect(screen.getByText('Genesis')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Genesis'));

    await waitFor(() => {
      expect(screen.getByText('Genesis 1')).toBeInTheDocument();
      expect(screen.getByText('Genesis 2')).toBeInTheDocument();
    });
  });

  it('should fetch and display verses when a chapter is clicked', async () => {
    const mockBooks = [{ id: '1', name: 'Genesis' }];
    const mockChapters = [{ id: '1', reference: 'Genesis 1' }];
    const mockVerses = [{ id: '1', reference: 'Genesis 1:1' }, { id: '2', reference: 'Genesis 1:2' }];
    getReinaValeraBooks.mockResolvedValue({ data: mockBooks });
    getBookChapters.mockResolvedValue({ data: mockChapters });
    getChapterVerses.mockResolvedValue({ data: mockVerses });

    render(<ReinaValeraBooks />);

    await waitFor(() => {
      expect(screen.getByText('Genesis')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Genesis'));

    await waitFor(() => {
      expect(screen.getByText('Genesis 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Genesis 1'));

    await waitFor(() => {
      expect(screen.getByText('Genesis 1:1')).toBeInTheDocument();
      expect(screen.getByText('Genesis 1:2')).toBeInTheDocument();
    });
  });

  it('should fetch and display verse text when a verse is clicked', async () => {
    const mockBooks = [{ id: '1', name: 'Genesis' }];
    const mockChapters = [{ id: '1', reference: 'Genesis 1' }];
    const mockVerses = [{ id: '1', reference: 'Genesis 1:1' }];
    const mockVerseText = { data: { content: '<p>In the beginning...</p>' } };
    getReinaValeraBooks.mockResolvedValue({ data: mockBooks });
    getBookChapters.mockResolvedValue({ data: mockChapters });
    getChapterVerses.mockResolvedValue({ data: mockVerses });
    getVerseText.mockResolvedValue(mockVerseText);

    render(<ReinaValeraBooks />);

    await waitFor(() => {
      expect(screen.getByText('Genesis')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Genesis'));

    await waitFor(() => {
      expect(screen.getByText('Genesis 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Genesis 1'));

    await waitFor(() => {
      expect(screen.getByText('Genesis 1:1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Genesis 1:1'));

    await waitFor(() => {
      expect(screen.getByText('In the beginning...')).toBeInTheDocument();
    });
  });
});