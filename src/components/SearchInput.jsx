import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce'; // Importa a função debounce do lodash

// Assumindo que este componente recebe uma prop 'onSearch' (uma função)
// e um 'placeholder' opcional.
function SearchInput({ onSearch, placeholder }) {
  // Estado local para o valor digitado pelo usuário
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  // Cria uma versão debounced da função onSearch
  // Isso garante que onSearch só será chamada após o usuário parar de digitar
  // por um curto período (500ms neste caso).
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 500), // 500ms de delay
    [onSearch] // Dependência: a função onSearch
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
      debouncedSearch.cancel(); // Cancela a chamada debounced pendente
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
