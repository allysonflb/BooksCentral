import { useBookStore } from './bookStore';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('bookStore Zustand store', () => {
  // Limpa o estado do store antes de cada teste, garantindo isolamento entre os testes
  beforeEach(() => {
    act(() => {
      useBookStore.setState({
        books: [],
        loading: false,
        error: null,
        searchTerm: '',
      });
    });
  });

  // Teste inicial para verificar o estado padrão
  it('should have initial state', () => {
    const { result } = renderHook(() => useBookStore());
    expect(result.current.books).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.searchTerm).toBe('');
  });

  // Teste para a ação fetchBooks (simulando a API)
  it('fetchBooks should update state correctly', async () => {
    const mockBooks = [{ key: '/works/1', title: 'Test Book' }];
    const mockQuery = 'test';

    // Mocka a chamada fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ docs: mockBooks }),
      })
    );

    const { result } = renderHook(() => useBookStore());

    // Executa a ação fetchBooks dentro de um act
    await act(async () => {
      await result.current.fetchBooks(mockQuery);
    });

    // Verifica se o estado foi atualizado
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`https://openlibrary.org/search.json?q=${encodeURIComponent(mockQuery)}&fields=key,title,author_name,cover_i&limit=20`);
    expect(result.current.books).toEqual(mockBooks);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.searchTerm).toBe(mockQuery);

    // Restaura o fetch original
    global.fetch.mockRestore();
  });

  // Teste para fetchBooks com erro
  it('fetchBooks should handle API errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    const { result } = renderHook(() => useBookStore());

    await act(async () => {
      await result.current.fetchBooks('error query');
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('HTTP error! status: 500'); // Verifica a mensagem de erro
    expect(result.current.books).toEqual([]);

    global.fetch.mockRestore();
  });

  // Teste para clearBooks
  it('clearBooks should reset books and searchTerm', async () => {
    const { result } = renderHook(() => useBookStore());

    // Mocka a chamada fetch para o fetchBooks
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ docs: [{ key: '/works/1', title: 'Test Book' }] }),
      })
    );

    // Preenche com dados para depois limpar
    await act(async () => {
      await result.current.fetchBooks('initial query');
    });
    
    expect(result.current.books.length).toBeGreaterThan(0);
    expect(result.current.searchTerm).toBe('initial query');

    // Limpa os livros
    act(() => {
      result.current.clearBooks();
    });

    expect(result.current.books).toEqual([]);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.error).toBe(null);
    
    global.fetch.mockRestore();
  });
});
