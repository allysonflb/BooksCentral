import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event'; // Removido: não usado em App.test.js
// import debounce from 'lodash.debounce'; // Removido: não usado em App.test.js

import App from './App';
import { useBookStore } from './store/bookStore';

// --- Mock setup ---

// Mocka lodash.debounce (necessário se SearchInput o usar e App o renderizar de alguma forma)
// Mesmo que não seja usado diretamente em App.test.js, é uma dependência do componente que o App usa.
// Se não estivermos testando a interação do debounce aqui, podemos remover este mock de App.test.js.
// No entanto, para manter a consistência com os mocks globais, vou deixar comentado por enquanto.
// jest.mock('lodash.debounce', ...);

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
  setSearchTerm: mockSetSearchTerm,
  loading: false,
  error: null,
  books: [],
};

useBookStore.mockImplementation(() => mockStore);

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Restaura o mock do useBookStore para cada teste
    mockStore = {
      fetchBooks: mockFetchBooks,
      initializeSearch: mockInitializeSearch,
      searchTerm: '',
      initialSearchTerm: '',
      resetStore: mockResetStore,
      setSearchTerm: mockSetSearchTerm,
      loading: false, error: null, books: []
    };
    useBookStore.mockImplementation(() => mockStore);
  });

  it('renders header and main content area', () => {
    render(<App />);
    expect(screen.getByText(/Biblioteca Virtual/i)).toBeInTheDocument();
    // Verifica se o mock do SearchInput foi chamado (renderizado)
    expect(require('./components/SearchInput').default).toHaveBeenCalled();
  });

  it('calls initializeSearch on mount if initialSearchTerm is present and no searchTerm', async () => {
    const initialTerm = 'Initial Book';
    mockStore.initialSearchTerm = initialTerm;
    mockStore.searchTerm = ''; 

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
    // Asserção corrigida para usar .default
    expect(require('./components/LoadingSpinner').default).toHaveBeenCalled();
  });

  it('displays ErrorMessage when error is present', () => {
    const errorMessage = 'API Error';
    mockStore.error = errorMessage;
    render(<App />);
    // Asserção corrigida para usar .default
    expect(require('./components/ErrorMessage').default).toHaveBeenCalledWith({ message: errorMessage }, expect.anything());
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

    // Asserção corrigida para usar .default
    expect(require('./components/BookCard').default).toHaveBeenCalledTimes(mockBooks.length);
    expect(require('./components/BookCard').default).toHaveBeenCalledWith({ book: mockBooks[0] }, expect.anything());
    expect(require('./components/BookCard').default).toHaveBeenCalledWith({ book: mockBooks[1] }, expect.anything());
  });

  it('calls resetStore on unmount', () => {
    const { unmount } = render(<App />);
    unmount();
    expect(mockResetStore).toHaveBeenCalledTimes(1);
  });
});
