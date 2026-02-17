import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p>&copy; {new Date().getFullYear()} Tech Mahindra. Todos los derechos reservados.</p>
        </div>
        <div className="footer-section">
          <p>Contacto: info@techmahindra.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
