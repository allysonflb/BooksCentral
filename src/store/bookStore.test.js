import { create, useBookStore } from './bookStore';
import { renderHook, act } from '@testing-library/react';
import { jest } from '@jest/globals';

// --- Mock setup ---

// Mocka lodash.debounce
jest.mock('lodash.debounce', () => {
  return jest.fn((func, delay) => {
    let timerId;
    const debounced = (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), delay);
    };
    debounced.cancel = jest.fn(() => clearTimeout(timerId)); // Tornando cancel um Jest mock
    return debounced;
  });
});

// Mocka o fetch globalmente usando jest.spyOn
let fetchSpy;

beforeAll(() => {
  fetchSpy = jest.spyOn(global, 'fetch');
});

afterAll(() => {
  fetchSpy.mockRestore();
});

// Mock do useBookStore
const mockUseBookStore = jest.fn();

// Mocka o módulo store para exportar o hook mockado
jest.mock('../store/bookStore', () => ({
  useBookStore: mockUseBookStore,
}));

// Helper para resetar o store antes de cada teste
const resetZustandStore = (useStore) => {
  const hook = renderHook(() => useStore());
  act(() => {
    // Verifica se resetStore existe antes de chamar
    if (hook.result.current && hook.result.current.resetStore) {
      hook.result.current.resetStore();
    }
  });
};

// --- Testes para bookStore ---

describe('bookStore Zustand store', () => {
  beforeEach(() => {
    // Reseta o mock do store a cada teste
    mockUseBookStore.mockClear();
    fetchSpy.mockClear();

    // Define um mock padrão para useBookStore antes de cada teste
    // Isso pode ser sobrescrito em testes específicos se necessário
    mockUseBookStore.mockImplementation(() => ({
      books: [], loading: false, error: null, searchTerm: '', initialSearchTerm: '',
      fetchBooks: jest.fn(), initializeSearch: jest.fn(), resetStore: jest.fn(),
    }));

    // Reseta o debounce mock
    const debouncedFn = require('lodash.debounce').mock.results[0]?.value;
    if (debouncedFn) debouncedFn.cancel.mockClear();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useBookStore());
    expect(result.current.books).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.initialSearchTerm).toBe('');
  });

  it('fetchBooks should update state correctly on success', async () => {
    const mockBooks = [{ key: '/works/1', title: 'Test Book' }];
    const mockQuery = 'test';

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: mockBooks }),
    });

    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.fetchBooks(mockQuery);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`https://openlibrary.org/search.json?q=${encodeURIComponent(mockQuery)}&fields=key,title,author_name,cover_i&limit=20`);
    expect(result.current.books).toEqual(mockBooks);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.searchTerm).toBe(mockQuery);
  });

  it('fetchBooks should handle API errors gracefully', async () => {
    const mockErrorMsg = 'Network Error';
    fetchSpy.mockRejectedValueOnce(new Error(mockErrorMsg));

    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.fetchBooks('error query');
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockErrorMsg);
    expect(result.current.books).toEqual([]);
    expect(result.current.searchTerm).toBe('error query');
  });

  it('fetchBooks should handle non-ok HTTP responses', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.fetchBooks('http error query');
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Erro ao buscar livros. Status: 500');
    expect(result.current.books).toEqual([]);
  });

  it('fetchBooks should clear books and set searchTerm when query is empty', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ docs: [{ key: '1', title: 'Book 1' }] }) });
    const { result } = renderHook(() => useBookStore());
    await act(async () => result.current.fetchBooks('some query'));
    expect(result.current.books.length).toBe(1);
    expect(result.current.searchTerm).toBe('some query');

    await act(async () => result.current.fetchBooks(''));

    expect(result.current.books).toEqual([]);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('clearBooks should reset books and searchTerm', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.fetchBooks('initial query');
    });
    expect(result.current.books.length).toBeGreaterThan(0);
    expect(result.current.searchTerm).toBe('initial query');

    act(() => {
      result.current.clearBooks();
    });

    expect(result.current.books).toEqual([]);
    expect(result.current.searchTerm).toBe('');
  });

  it('resetStore should reset all states to initial', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.fetchBooks('query to reset');
      result.current.error = 'some error';
    });
    expect(result.current.books.length).toBeGreaterThan(0);
    expect(result.current.searchTerm).toBe('query to reset');
    expect(result.current.error).toBe('some error');
    expect(result.current.initialSearchTerm).toBe('');

    act(() => {
      result.current.resetStore();
    });

    expect(result.current.books).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.initialSearchTerm).toBe('');
  });

  it('initializeSearch should fetch books if term is provided', async () => {
    const mockTerm = 'initial term';
    const mockBooks = [{ key: '2', title: 'Initial Book' }];

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: mockBooks }),
    });

    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.initializeSearch(mockTerm);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(result.current.initialSearchTerm).toBe(mockTerm);
    expect(result.current.searchTerm).toBe(mockTerm);
    expect(result.current.books).toEqual(mockBooks);
    expect(result.current.loading).toBe(false);
  });

  it('initializeSearch should not fetch books if term is empty', async () => {
    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.initializeSearch('');
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.initialSearchTerm).toBe('');
    expect(result.current.searchTerm).toBe('');
    expect(result.current.books).toEqual([]);
  });
});
