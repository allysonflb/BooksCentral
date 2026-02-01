import React from 'react';
import { render, screen } from '@testing-library/react';
import BookCard from './BookCard';

describe('BookCard Component', () => {
  const mockBookWithCover = {
    key: '/works/OL12345W',
    title: 'The Great Novel',
    author_name: ['Author One', 'Author Two'],
    cover_i: 98765, // Um ID de capa válido
  };

  const mockBookWithoutCover = {
    key: '/works/OL67890W',
    title: 'Another Story',
    author_name: ['Single Author'],
    // cover_i não está presente
  };

  it('renders book title and authors', () => {
    render(<BookCard book={mockBookWithCover} />);

    expect(screen.getByText(/The Great Novel/i)).toBeInTheDocument();
    expect(screen.getByText(/Por: Author One, Author Two/i)).toBeInTheDocument();
  });

  it('renders the cover image if cover_i is present', () => {
    render(<BookCard book={mockBookWithCover} />);
    const imgElement = screen.getByAltText(/Cover of The Great Novel/i);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://covers.openlibrary.org/b/id/98765-M.jpg');
  });

  it('does not render the cover image if cover_i is not present', () => {
    render(<BookCard book={mockBookWithoutCover} />);
    const imgElement = screen.queryByAltText(/Cover of Another Story/i);
    expect(imgElement).not.toBeInTheDocument();
  });

  it('renders correctly even if author_name is missing', () => {
    const bookNoAuthor = { ...mockBookWithoutCover, author_name: undefined };
    render(<BookCard book={bookNoAuthor} />);
    expect(screen.getByText(/Another Story/i)).toBeInTheDocument();
    // Não deve tentar renderizar autores se não houver
    expect(screen.queryByText(/Por:/i)).not.toBeInTheDocument();
  });
});
