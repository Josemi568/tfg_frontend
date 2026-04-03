import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className="container">
      <footer style={{ marginTop: '40px', padding: '20px 0', borderTop: '1px solid var(--border-color)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Informacion de contacto</h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Lado izquierdo: Información */}
          <div style={{ flex: 1, textAlign: 'left', minWidth: '250px' }}>
            <p style={{ margin: '5px 0' }}>Email: PlazartArtist8436@gmail.com</p>
            <p style={{ margin: '5px 0' }}>Telefono: 689 34 23 76</p>
            <p style={{ margin: '5px 0' }}>Copyright © 2026 Plazart. Todos los derechos reservados.</p>
          </div>

          {/* Lado derecho: Imágenes */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '20px', minWidth: '250px' }}>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/87/87390.png" alt="Instagram" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#e5e7eb' }} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://logos-world.net/wp-content/uploads/2023/08/X-Logo.png" alt="Twitter" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#e5e7eb' }} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tiktok_icon.svg/960px-Tiktok_icon.svg.png" alt="Tiktok" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#e5e7eb' }} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
