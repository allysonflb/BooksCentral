import React from 'react';
import { useGlobalContext } from '../../content';
import Book from '../BookList/Book';
import Loading from '../Loader/Loader';
import coverImg from '../../images/capa_nao_encontrada.jpeg';
import './BookList.css';


const BookList = () => {
  const {loading, books, resultTitle} = useGlobalContext();
  const booksWithCovers = books.map((singleBook) => {
    return{
      ...singleBook,
      // removendo o //works pra buscar apenas o id
      id: (singleBook.id).replace('/works/', ''),
      cover_img: singleBook.cover_id ? `https://covers.openlibrary.org/b/id/${singleBook.cover_id}-L.jpg` : coverImg 
    }
  });

  if (loading)
    return <Loading />;
  

  return (
    <section className="booklist">
      <div className="container-fluid">
        <div className="section-title">
          <h2>{resultTitle}</h2>
        </div>
        <div className="booklist-content grid">
          {
            booksWithCovers.map((item, index) => {
              return (
                <Book key={index} {...item} />
              )
            })
          }
        </div>
      </div>
    </section>
  );
}

export default BookList