import { create, useBookStore } from './bookStore';
import { renderHook, act } from '@testing-library/react';
import { jest } from '@jest/globals'; // Importa jest para mocks

// --- Mock setup ---

// Mocka lodash.debounce para controlar o tempo em testes de SearchInput
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

// Mocka fetch globalmente para testes de API
let fetchMock;

beforeAll(() => {
  fetchMock = jest.spyOn(global, 'fetch');
});

afterAll(() => {
  fetchMock.mockRestore();
});

// Helper para resetar o store antes de cada teste
const resetZustandStore = (useStore) => {
  const hook = renderHook(() => useStore());
  act(() => {
    hook.result.current.resetStore();
  });
};

// --- Testes para bookStore ---

describe('bookStore Zustand store', () => {
  // Reseta o store antes de cada teste
  beforeEach(() => {
    resetZustandStore(useBookStore);
    fetchMock.mockClear(); // Limpa mocks de fetch
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

    // Configura o mock de fetch para sucesso
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: mockBooks }),
    });

    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.fetchBooks(mockQuery);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`https://openlibrary.org/search.json?q=${encodeURIComponent(mockQuery)}&fields=key,title,author_name,cover_i&limit=20`);
    expect(result.current.books).toEqual(mockBooks);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.searchTerm).toBe(mockQuery);
  });

  it('fetchBooks should handle API errors gracefully', async () => {
    const mockErrorMsg = 'Network Error';
    // Configura o mock de fetch para falhar
    fetchMock.mockRejectedValueOnce(new Error(mockErrorMsg));

    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.fetchBooks('error query');
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockErrorMsg);
    expect(result.current.books).toEqual([]);
    expect(result.current.searchTerm).toBe('error query');
  });

  it('fetchBooks should handle non-ok HTTP responses', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.fetchBooks('http error query');
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    // A mensagem de erro esperada agora é mais específica
    expect(result.current.error).toBe('Erro ao buscar livros. Status: 500');
    expect(result.current.books).toEqual([]);
  });

  it('fetchBooks should clear books and set searchTerm when query is empty', async () => {
    // First, populate some state
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ docs: [{ key: '1', title: 'Book 1' }] }) });
    const { result } = renderHook(() => useBookStore());
    await act(async () => result.current.fetchBooks('some query'));
    expect(result.current.books.length).toBe(1);
    expect(result.current.searchTerm).toBe('some query');

    // Now, call fetchBooks with an empty query
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

    // Modify some states
    act(() => {
      result.current.fetchBooks('query to reset');
      result.current.error = 'some error'; // Manually set error for testing reset
    });
    expect(result.current.books.length).toBeGreaterThan(0);
    expect(result.current.searchTerm).toBe('query to reset');
    expect(result.current.error).toBe('some error');
    expect(result.current.initialSearchTerm).toBe(''); // Should also reset initialSearchTerm

    // Reset the store
    act(() => {
      result.current.resetStore();
    });

    // Verify all states are back to initial
    expect(result.current.books).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.initialSearchTerm).toBe('');
  });

  it('initializeSearch should fetch books if term is provided', async () => {
    const mockTerm = 'initial term';
    const mockBooks = [{ key: '2', title: 'Initial Book' }];

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: mockBooks }),
    });

    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.initializeSearch(mockTerm);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.initialSearchTerm).toBe(mockTerm);
    expect(result.current.searchTerm).toBe(mockTerm);
    expect(result.current.books).toEqual(mockBooks);
    expect(result.current.loading).toBe(false);
  });

  it('initializeSearch should not fetch books if term is empty', async () => {
    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.initializeSearch(''); // Empty term
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.initialSearchTerm).toBe('');
    expect(result.current.searchTerm).toBe('');
    expect(result.current.books).toEqual([]);
  });
});
