import React from 'react'
import { Link } from 'react-router-dom';
import "./BookList.css";
import { Card, Col, Row } from 'react-bootstrap';

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
    <Card className="books-info">
      <Row>
        <Col md={4}>
          <Card.Img variant="top" src={books.cover_img} alt="cover" />
        </Col>
        <Col md={8}>
          <Card.Body>
            <Link to={`/books/${books.id}`} {...books}>
              <Card.Title className="fw-7 fs-18">{books.title}</Card.Title>
            </Link>
            <div className="books-info-itens">
              <span className='text-capitalize fw-7 fs-14'>Autor: </span>
              <span className='author fw-4 fs-14'>{authors.join(", ")}</span>
            </div>
            <div className="books-info-itens">
              <span className='text-capitalize fw-7 fs-14'>Total de Edições: </span>
              <span className='edition-count fw-4 fs-14'>{books.edition_count}</span>
            </div>
            <div className="books-info-itens">
              <span className='text-capitalize fw-7 fs-14'>Ano da Primeira Publicação </span>
              <span className='publish-year fw-4 fs-14'>{books.first_publish_year}</span>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default Book