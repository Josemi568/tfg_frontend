import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/FooterStyle.css'

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <footer className="footer">

      <div className='footer-container'>
        {/* Lado izquierdo: Información */}
        <div className='footer-info'>
          <p style={{ margin: '5px 0' }}>Aviso legal</p>
          <p><a href="#" rel="noopener noreferrer" style={{ margin: '5px 0' }}>Politica de privacidad</a></p>
          <p><a href="#" rel="noopener noreferrer" style={{ margin: '5px 0' }}>Politica de cookies</a></p>
        </div>

        <div className='footer-copyright'>
          <p style={{ margin: '5px 0' }}>Copyright © 2026 Plazart. Todos los derechos reservados.</p>
        </div>

        {/* Lado derecho: Imágenes */}
        <div className='footer-icons'>
          <a href="#" rel="noopener noreferrer">
            <img src="/Images/telefono.png" alt="Telefono" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#ffffff' }} />
          </a>
          <a href="#" rel="noopener noreferrer">
            <img src="/Images/correo.png" alt="Correo" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#ffffff' }} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
