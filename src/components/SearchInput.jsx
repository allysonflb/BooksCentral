import React, { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce'; // Importa a função debounce do lodash
import { useBookStore } from '../store/bookStore';

// Componente de busca que usa o store diretamente para disparar a busca
function SearchInput({ placeholder }) {
  // Estado local para o valor digitado pelo usuário
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  
  // Obtém a ação fetchBooks do store
  const fetchBooks = useBookStore((state) => state.fetchBooks);

  // Cria uma versão debounced da função fetchBooks usando useMemo
  // Isso garante que fetchBooks só será chamada após o usuário parar de digitar
  // por um curto período (500ms neste caso).
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      fetchBooks(term);
    }, 500), // 500ms de delay
    [fetchBooks] // Dependência: a função fetchBooks
  );

  // Manipula a mudança no input
  const handleInputChange = (event) => {
    const term = event.target.value;
    setLocalSearchTerm(term); // Atualiza o estado local
    debouncedSearch(term); // Chama a função debounced para disparar a busca
  };

  // Efeito para garantir que o timer do debounce seja cancelado
  // quando o componente for desmontado, evitando memory leaks.
  useEffect(() => {
    return () => {
      if (debouncedSearch && debouncedSearch.cancel) {
        debouncedSearch.cancel(); // Cancela a chamada debounced pendente
      }
    };
  }, [debouncedSearch]); // Executa quando debouncedSearch muda

  return (
    <input
      type="text"
      placeholder={placeholder || "Buscar livros..."} // Placeholder padrão
      value={localSearchTerm}
      onChange={handleInputChange}
      className="search-input" // Uma classe CSS básica para estilização, se necessário
      aria-label="Book search input" // Para acessibilidade
    />
  );
}

export default SearchInput;
