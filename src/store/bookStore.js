import { create } from 'zustand';

// Define a interface básica para um livro (ajuste conforme a API)
// interface Book {
//   key: string;
//   title: string;
//   author_name?: string[];
//   cover_i?: number;
// }

// O estado inicial do nosso store
const initialState = {
  books: [],
  loading: false,
  error: null,
  searchTerm: '',
};

// Cria o store com Zustand
export const useBookStore = create((set) => ({
  ...initialState,

  // Ação para buscar livros
  fetchBooks: async (query) => {
    set({ loading: true, error: null, searchTerm: query });
    if (!query) {
      set({ books: [], loading: false, error: null });
      return;
    }
    try {
      // Assumindo que a URL da API do OpenLibrary é esta
      // A estrutura da query pode precisar de ajuste dependendo de como o frontend lida com paginacao/resultados
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,cover_i&limit=20`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // A API do OpenLibrary retorna os resultados em 'docs'
      set({ books: data.docs || [], loading: false });
    } catch (err) {
      console.error("Error fetching books:", err);
      set({ error: err.message, loading: false });
    }
  },

  // Limpa os resultados da busca, por exemplo, ao limpar o input
  clearBooks: () => set({ books: [], searchTerm: '', error: null }),
}));
