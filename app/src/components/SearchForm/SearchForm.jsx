import React, {useRef, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../content';
import "./SearchForm.css";

const SearchForm = () => {
  const {setSearchTerm, setResultTitle} = useGlobalContext();
  const searchText = useRef('');
  const navigate = useNavigate();

  useEffect(() => searchText.current.focus(), []);
  const handleSubmit = (e) => {
    e.preventDefault();
    let tempSearch = searchText.current.value.trim();
    if ((tempSearch.replace(/[^\w\s]/gi,"")).length === 0){
      setSearchTerm("The Lord of Rings");
      setResultTitle("Busque um livro...");
    } else {
      setSearchTerm(searchText.current.value);
    }
      navigate('/books');
    };

  return (
    <div className="search-form">
      <div className="container-fluid">
        <div className="search-form">
          <form
            className="d-flex flex-column flex-md-row"
            onSubmit={handleSubmit}
          >
            <input
              className="form-control custom-input search-bar"
              type="search"
              placeholder="Pesquise seu livro (em inglês)"
              ref={searchText}
              aria-label="Search"
            />
            <button
              className="btn btn-outline-dark ms-md-2"
              type="submit"
              onClick={handleSubmit}
            >
              Pesquisar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchForm