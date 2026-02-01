import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import { useBookStore } from './store/bookStore';
import debounce from 'lodash.debounce'; // Para mockar

// --- Mock setup ---

// Mocka lodash.debounce
jest.mock('lodash.debounce', () => {
  return jest.fn((func, delay) => {
    let timerId;
    const debounced = (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timerId);
    return debounced;
  });
});

// Mocka todos os componentes para isolar o teste do App
jest.mock('./components/SearchInput', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('./components/BookCard', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('./components/LoadingSpinner', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('./components/ErrorMessage', () => ({ __esModule: true, default: jest.fn() }));

// Mocka o store Zustand
const mockFetchBooks = jest.fn();
const mockInitializeSearch = jest.fn();
const mockResetStore = jest.fn();
const mockSetSearchTerm = jest.fn();

let mockStore = {
  fetchBooks: mockFetchBooks,
  initializeSearch: mockInitializeSearch,
  searchTerm: '',
  initialSearchTerm: '',
  resetStore: mockResetStore,
  loading: false,
  error: null,
  books: [],
};

useBookStore.mockImplementation(() => mockStore);

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockDebounce = require('lodash.debounce');
    mockDebounce.mockClear();
    mockDebounce.mockImplementation((func, delay) => {
      let timerId;
      const debounced = (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => func(...args), delay);
      };
      debounced.cancel = () => clearTimeout(timerId);
      return debounced;
    });

    mockStore = {
      fetchBooks: mockFetchBooks, initializeSearch: mockInitializeSearch, searchTerm: '', initialSearchTerm: '', resetStore: mockResetStore, setSearchTerm: mockSetSearchTerm,
      loading: false, error: null, books: []
    };
    useBookStore.mockImplementation(() => mockStore);
  });

  it('renders header and main content area', () => {
    render(<App />);
    expect(screen.getByText(/Biblioteca Virtual/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Book search input/i })).toBeInTheDocument();
  });

  it('calls initializeSearch on mount if initialSearchTerm is present and no searchTerm', async () => {
    const initialTerm = 'Initial Book';
    mockStore.initialSearchTerm = initialTerm;
    mockStore.searchTerm = ''; // Ensure searchTerm is empty

    render(<App />);

    await waitFor(() => {
      expect(mockInitializeSearch).toHaveBeenCalledWith(initialTerm);
    }, { timeout: 1000 });
  });

  it('does not call initializeSearch if searchTerm is already set', async () => {
    const initialTerm = 'Initial Book';
    const existingSearchTerm = 'Existing Term';

    mockStore.initialSearchTerm = initialTerm;
    mockStore.searchTerm = existingSearchTerm;

    render(<App />);
    await new Promise(resolve => setTimeout(resolve, 100)); // Give useEffect time to run
    expect(mockInitializeSearch).not.toHaveBeenCalledWith(initialTerm);
  });

  it('displays LoadingSpinner when loading is true', () => {
    mockStore.loading = true;
    render(<App />);
    expect(require('./components/LoadingSpinner')).toHaveBeenCalled();
  });

  it('displays ErrorMessage when error is present', () => {
    const errorMessage = 'API Error';
    mockStore.error = errorMessage;
    render(<App />);
    expect(require('./components/ErrorMessage')).toHaveBeenCalledWith({ message: errorMessage }, expect.anything());
  });

  it('displays no results message when books are empty and searchTerm is present', () => {
    mockStore.searchTerm = 'Nonexistent Book';
    mockStore.books = [];
    mockStore.loading = false;
    mockStore.error = null;

    render(<App />);
    expect(screen.getByText(/Nenhum livro encontrado para "Nonexistent Book"./i)).toBeInTheDocument();
  });

  it('displays initial prompt when no search has been made and no books are found', () => {
    // Store is already in initial state from beforeEach
    render(<App />);
    expect(screen.getByText(/Comece a buscar por um livro!/i)).toBeInTheDocument();
  });

  it('renders list of BookCards when books are available', () => {
    const mockBooks = [
      { key: '/works/1', title: 'Book 1' },
      { key: '/works/2', title: 'Book 2' },
    ];
    mockStore.books = mockBooks;
    mockStore.searchTerm = 'Test Books';
    mockStore.loading = false;
    mockStore.error = null;

    render(<App />);

    expect(require('./components/BookCard')).toHaveBeenCalledTimes(mockBooks.length);
    expect(require('./components/BookCard')).toHaveBeenCalledWith({ book: mockBooks[0] }, expect.anything());
    expect(require('./components/BookCard')).toHaveBeenCalledWith({ book: mockBooks[1] }, expect.anything());
  });

  it('calls resetStore on unmount', () => {
    const { unmount } = render(<App />);
    unmount();
    expect(mockResetStore).toHaveBeenCalledTimes(1);
  });
});
