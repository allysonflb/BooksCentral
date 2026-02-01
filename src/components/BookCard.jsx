import React from 'react';

// Componente para exibir detalhes de um livro
function BookCard({ book }) {
  // Constrói a URL da imagem da capa. A API do OpenLibrary usa um padrão.
  // Se cover_i não existir, a imagem não será exibida.
  const getCoverImageUrl = (coverId) => {
    if (!coverId) return null;
    // O tamanho 'M' é para médio. Outros tamanhos como 'S' (pequeno) ou 'L' (grande) também estão disponíveis.
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  const imageUrl = getCoverImageUrl(book.cover_i);

  return (
    <div className="book-card">
      {imageUrl && (
        <img src={imageUrl} alt={`Cover of ${book.title}`} className="book-card-cover" />
      )}
      <div className="book-card-info">
        <h3 className="book-card-title">{book.title}</h3>
        {book.author_name && (
          <p className="book-card-author">Por: {book.author_name.join(', ')}</p>
        )}
        {/* Poderia adicionar mais detalhes aqui, como ano de publicação, etc. */}
      </div>
    </div>
  );
}

export default BookCard;
