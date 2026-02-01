import { useBookStore } from './bookStore';
import { renderHook, act } from '@testing-library/react';

describe('bookStore Zustand store', () => {
  // Limpa o estado do store antes de cada teste
  beforeEach(() => {
    const { result } = renderHook(() => useBookStore());
    act(() => {
      // Reseta o estado para o initialState (precisa que initialState seja exportado ou acessível)
      // Uma forma simples é chamar um reset action se implementada, ou re-renderizar o hook
      // Para simplificar, vamos re-renderizar o hook e redefinir o estado.
      // Idealmente, o store teria um método de reset.
      // Por enquanto, vamos garantir que os testes não dependam de estado entre eles.
      // Se o store for complexo, um reset explícito seria melhor.
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
    const mockError = 'Network Error';
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
  it('clearBooks should reset books and searchTerm', () => {
    const { result } = renderHook(() => useBookStore());

    // Preenche com dados para depois limpar
    act(() => {
      result.current.fetchBooks('initial query');
    });
    expect(result.current.books.length).toBeGreaterThan(0);
    expect(result.current.searchTerm).toBe('initial query');

    // Limpa os livros
    act(() => {
      result.current.clearBooks();
    });

    expect(result.current.books).toEqual([]);
    expect(result.current.searchTerm).toBe('');
  });
});
