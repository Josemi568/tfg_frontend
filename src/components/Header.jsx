import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getToken, removeToken, removeItem, isAdminUser } from '../utils/storage';

const Header = () => {
  const location = useLocation();
  const isAuthenticated = !!getToken();
  const isAdmin = isAdminUser();

  const getUserIdFromToken = () => {
    try {
      const token = getToken();
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.id || payload.userId || payload.user_id || payload.sub;
    } catch (e) {
      return null;
    }
  };

  const userId = getUserIdFromToken();

  const handleLogout = () => {
    removeToken();
    removeItem('username');
    window.location.href = '/';
  };

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Plazart
          </Link>
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/users">
                  <button className="btn-secondary">Gestionar usuarios</button>
                </Link>
              )}
              {userId && (
                <Link to={`/profile/${userId}`}>
                  <button style={{ background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
                    Ver Perfil
                  </button>
                </Link>
              )}
              <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button style={{ background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
                  Iniciar sesión
                </button>
              </Link>
              <Link to="/register">
                <button>Registrarse</button>
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
