import React from 'react';
import './App.css'; // Assumindo que existe um App.css para estilos

// Importa o store Zustand
import { useBookStore } from './store/bookStore';

// Importa os novos componentes
import SearchInput from './components/SearchInput';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  // Seleciona partes do estado do store
  const { books, loading, error, searchTerm } = useBookStore();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Biblioteca Virtual</h1>
        <SearchInput placeholder="Pesquise por título ou autor" />
      </header>
      <main>
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && books.length === 0 && searchTerm && (
          <p>Nenhum livro encontrado para "{searchTerm}".</p>
        )}
        {!loading && !error && books.length === 0 && !searchTerm && (
          <p>Comece a buscar por um livro!</p>
        )}
        <div className="book-list">
          {books.length > 0 && books.map((book) => (
            <BookCard key={book.key} book={book} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
