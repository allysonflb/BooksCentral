import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css';
import Logoimg from '../../images/Logo.png';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleNavbar = () => setShowMenu(!showMenu);

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <Link to="/" className="navbar-brand flex">
          <img src={Logoimg} alt="Site Logo" />
          <span className="text-uppercase fw-7 fs-24 ls-1">BooksCentral</span>
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={handleNavbar}
        >
          <span
            class="navbar-toggler-icon"
            style={{ color: `${showMenu ? "#fff" : "#010101"}` }}
          ></span>
        </button>
      </div>

      <div
        class="collapse navbar-collapse"
        id="navbarNavAltMarkup"
        style={{ display: showMenu ? "block" : "none" }}
      >
        <ul class="navbar-nav">
          <li class="nav-item">
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
}

export default Navbar