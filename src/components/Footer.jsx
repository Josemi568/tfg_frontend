import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className="container">
      <footer style={{ backgroundColor: '#ffffff', marginTop: '40px', padding: '20px 0', borderTop: '1px solid var(--border-color)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Lado izquierdo: Información */}
          <div style={{ flex: 1, textAlign: 'left', minWidth: '250px' }}>
            <p style={{ margin: '5px 0' }}>Aviso legal</p>
            <p><a href="#" target="_blank" rel="noopener noreferrer" style={{ margin: '5px 0' }}>Politica de privacidad</a></p>
            <p><a href="#" target="_blank" rel="noopener noreferrer" style={{ margin: '5px 0' }}>Politica de cookies</a></p>
          </div>

          <div style={{ flex: 1, textAlign: 'center', minWidth: '250px' }}>
            <p style={{ margin: '5px 0' }}>Copyright © 2026 Plazart. Todos los derechos reservados.</p>
          </div>

          {/* Lado derecho: Imágenes */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '20px', minWidth: '250px' }}>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="/Images/telefono.png" alt="Telefono" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#ffffff' }} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="/Images/correo.png" alt="Correo" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#ffffff' }} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
