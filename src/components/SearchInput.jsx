import React, { useState, useEffect, useCallback } from 'react';
import { useBookStore } from '../store/bookStore'; // Importa o store Zustand
import debounce from 'lodash.debounce';

function SearchInput({
  placeholder
}) {
  // Obtém as ações e estados do store
  const {
    fetchBooks,
    searchTerm,
    initializeSearch,
    initialSearchTerm,
    resetStore
  } = useBookStore();

  // Estado local para o valor digitado no input
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  // Efeito para inicializar a busca ou sincronizar o termo no input
  useEffect(() => {
    // Se houver um termo inicial configurado no store (e o input ainda não foi alterado),
    // utiliza esse termo inicial para a busca.
    if (initialSearchTerm && !localSearchTerm) {
      initializeSearch(initialSearchTerm);
      setLocalSearchTerm(initialSearchTerm); // Atualiza o valor do input para refletir o termo inicial
    } else if (!initialSearchTerm && searchTerm && localSearchTerm !== searchTerm) {
      // Se não há termo inicial mas o searchTerm do store mudou (ex: após um reload),
      // sincroniza o input com o searchTerm do store.
      setLocalSearchTerm(searchTerm);
    }
  }, [initializeSearch, searchTerm, initialSearchTerm, localSearchTerm]);

  // Função debounced para chamar fetchBooks
  const debouncedSearch = useCallback(
    debounce((term) => {
      fetchBooks(term);
    }, 500),
    [fetchBooks] // Dependência: a ação fetchBooks do store
  );

  const handleInputChange = (event) => {
    const term = event.target.value;
    setLocalSearchTerm(term);
    debouncedSearch(term);
  };

  // Limpa o debounce pendente ao desmontar o componente
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      placeholder={placeholder || "Buscar livros..."}
      value={localSearchTerm}
      onChange={handleInputChange}
      className="search-input"
      aria-label="Book search input"
    />
  );
}

export default SearchInput;
