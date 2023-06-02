import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Logoimg from '../../images/Logo.png';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleNavbar = () => setShowMenu(!showMenu);

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand flex">
          <img src={Logoimg} alt="Site Logo" className="w-100" />
          <span className="text-uppercase fw-7 fs-24 ls-1 d-none d-sm-block">BooksCentral</span>
          <span className="text-uppercase fw-7 fs-24 ls-1 d-sm-none">BC</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={handleNavbar}
        >
          <span
            className="navbar-toggler-icon navbar-toggler-icon-white"
            style={{ color: `${showMenu ? '#fff' : '#010101'}` }}
          ></span>
        </button>
      </div>

      <div
        className="collapse navbar-collapse"
        id="navbarNavAltMarkup"
        style={{ display: showMenu ? 'block' : 'none' }}
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/about" className="nav-link active">
              Sobre
            </Link>
            <Link to="/contact" className="nav-link active">
              Contato
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;