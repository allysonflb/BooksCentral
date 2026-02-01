import React, {
  useEffect
} from 'react';
import './App.css'; // Assumindo que existe um App.css para estilos

// Importa o store Zustand
import { useBookStore } from './store/bookStore';

// Importa os novos componentes
import SearchInput from './components/SearchInput';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  // Seleciona estados e ações do store
  const {
    books,
    loading,
    error,
    searchTerm,
    initializeSearch,
    resetStore,
    initialSearchTerm
  } = useBookStore();

  // Efeito para gerenciar a busca inicial e a limpeza do store
  useEffect(() => {
    // Dispara a busca inicial se houver um termo definido e o app estiver montando
    // sem um termo de busca ativo.
    if (initialSearchTerm && !searchTerm && !loading && !error) {
      initializeSearch(initialSearchTerm);
    }
    
    // Limpa o store ao desmontar o componente App.
    return () => {
      resetStore();
    };
  }, [initializeSearch, searchTerm, resetStore, initialSearchTerm, loading, error]); // Dependências para o useEffect

  // Função para renderizar a lista de livros ou mensagens de status
  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (books.length > 0) {
      return (
        <div className="book-list">
          {books.map((book) => (
            // Certifica que a key é única. Se book.key não existir, usa book.title.
            <BookCard key={book.key || book.title} book={book} />
          ))}
        </div>
      );
    }
    // Se não há livros, loading ou erro, exibe mensagem com base no searchTerm
    if (searchTerm) {
      return <p>Nenhum livro encontrado para "{searchTerm}".</p>;
    } else {
      return <p>Comece a buscar por um livro!</p>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Biblioteca Virtual</h1>
        <SearchInput placeholder="Pesquise por título ou autor" />
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
