import React from 'react'
import Navbar from '../Navbar/Navbar';
import SearchForm from '../SearchForm/SearchForm';
import './Header.css';

const Header = () => {
  return (
    <div className='holder'>
      <header className='header'>
        <Navbar />
        <div className='header-content flex flex-c text-center text-white'>
          <h2 className='header-title text-capitalize'>
            Encontre seu livro desejado.
          </h2><br/>
          <p className='header-text fs-18 fw-3'>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime saepe recusandae 
            accusamus, officiis quasi sint consectetur, quaerat dolorum consequatur quidem per
            ferendis laudantium, est sit adipisci voluptatem modi quo culpa ratione!
          </p>
          <SearchForm />
        </div>
      </header>
    </div>
  )
}

export default Header