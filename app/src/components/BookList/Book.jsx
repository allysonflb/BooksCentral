import React from 'react'
import { Link } from 'react-router-dom';
import "./BookList.css";

const Book = (books) => {
  let authors = ["Autor desconhecido"];
  if (Array.isArray(books.author)) {
    authors = books.author.map((author) => {
      return author.replace(/[^\w\s]/gi, '');
    });
  } else if (typeof books.author === 'string') {
    authors = [books.author.replace(/[^\w\s]/gi, '')];
  }
  return (
    <div className="books-info flex flex-column flex-sb">
      <div className="book-info-img">
        <img src={books.cover_img} alt="cover" />
      </div>
      <div className="books-info-item text-center">
        <Link to={`/books/${books.id}`} {...books}>
          <div className="books-info-itens title fw-7 fs-18">
            <span>{books.title}</span>
          </div>
        </Link>
        <div className="books-info-itens author fw-4 fs-16">
          <span className='text-capitalize fw-7'>Autor: </span>
          <span>{authors.join(", ")}</span>
        </div>  
        <div className="books-info-itens edition-count fw-4 fs-16">
          <span className='text-capitalize fw-7'>Total de Edições: </span>
          <span>{books.edition_count}</span>
        </div> 
        <div className="books-info-itens publish-year fw-4 fs-16">
          <span className='text-capitalize fw-7'>Ano da Primeira Publicação </span>
          <span>{books.first_publish_year}</span>
        </div> 
      </div>
    </div>
  );
}

export default Book