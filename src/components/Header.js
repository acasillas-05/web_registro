import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Solo eliminar sesión actual, mantener usuarios registrados
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src="/TM_Logo_Header.png" alt="TM Logo" />
      </div>
      <div className="header-right">
        <nav className="header-nav">
          <Link to="/home">Home</Link>
          <Link to="/about-us">About Us</Link>
          <Link to="/capabilities">Capabilities</Link>
          <Link to="/industries">Industries</Link>
        </nav>
        <img 
          src="/Logout_Logo.png" 
          alt="Logout" 
          className="logout-icon"
          onClick={handleLogout}
        />
      </div>
    </header>
  );
}

export default Header;
