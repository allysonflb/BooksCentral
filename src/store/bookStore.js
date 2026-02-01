import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Constante para o número de livros por página/requisição
const BOOKS_PER_PAGE = 20;

// Estado inicial mais robusto
const initialState = {
  books: [],
  loading: false,
  error: null,
  searchTerm: '',
  initialSearchTerm: '', // Novo: para termo de busca inicial
};

// O creator da store é a função que recebe set e get
const bookStoreCreator = (set, get) => ({
  ...initialState,

  // Ação para buscar livros
  fetchBooks: async (query) => {
    set({ loading: true, error: null, searchTerm: query });
    if (!query) {
      set({ books: [], loading: false });
      return;
    }
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,cover_i&limit=${BOOKS_PER_PAGE}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar livros. Status: ${response.status}`);
      }
      const data = await response.json();
      set({ books: data.docs || [], loading: false });
    } catch (err) {
      console.error("Error fetching books:", err);
      set({
        error: err.message || 'Ocorreu um erro desconhecido ao buscar livros.',
        loading: false,
        books: [],
      });
    }
  },

  // Ação para limpar os resultados da busca
  clearBooks: () => set({ books: [], searchTerm: '' }),

  // Nova ação para resetar completamente o store ao estado inicial
  resetStore: () => set(initialState),

  // Função para inicializar a busca com um termo pré-definido
  initializeSearch: async (term) => {
    if (term) {
      set({ initialSearchTerm: term });
      await get().fetchBooks(term);
    }
  },
});

// Envolve o creator com devtools, passando o nome na configuração do middleware
export const useBookStore = create(devtools(bookStoreCreator, { name: 'bookStore' }));
