import React from 'react'
import { Link } from 'react-router-dom';
import "./BookList.css";


const Book = (books) => {
  return (
    <div className="books flex flex-column flex-sb">
      <div className="book-img">
        <img src={books.cover_img} alt="cover" />
      </div>
    </div>
  )
}

export default Book