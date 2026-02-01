import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

// Constante para o número de livros por página/requisição
const BOOKS_PER_PAGE = 20;

// Definindo um tipo básico para Book para clareza (não executável em JS puro)
// interface Book {
//   key: string;
//   title: string;
//   author_name?: string[];
//   cover_i?: number;
// }

// Estado inicial mais robusto
const initialState = {
  books: [],
  loading: false,
  error: null,
  searchTerm: '',
  initialSearchTerm: '', // Novo: para termo de busca inicial
};

export const useBookStore = create(
  devtools((
    set,
    get
  ) => ({
    ...initialState,

    // Ação para buscar livros
    fetchBooks: async (query) => {
      set({ loading: true, error: null, searchTerm: query });
      if (!query) {
        // Se a query estiver vazia, limpa os livros e para o loading
        set({ books: [], loading: false });
        return;
      }
      try {
        // Utiliza a constante BOOKS_PER_PAGE
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,cover_i&limit=${BOOKS_PER_PAGE}`);
        if (!response.ok) {
          // Captura o status HTTP para uma mensagem de erro mais útil
          throw new Error(`Erro ao buscar livros. Status: ${response.status}`);
        }
        const data = await response.json();
        // A API do OpenLibrary retorna os resultados em 'docs'
        set({ books: data.docs || [], loading: false });
      } catch (err) {
        console.error("Error fetching books:", err);
        // Define uma mensagem de erro mais descritiva
        set({
          error: err.message || 'Ocorreu um erro desconhecido ao buscar livros.',
          loading: false,
          books: [], // Limpa os livros em caso de erro
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
        set({ initialSearchTerm: term }); // Salva o termo inicial
        await get().fetchBooks(term); // Executa a busca
      }
    },
  })),
  {
    name: 'bookStore', // Nome para o devtools
  }
);
