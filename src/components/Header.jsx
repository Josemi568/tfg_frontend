import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, removeToken, removeItem, isAdminUser } from '../utils/storage';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!getToken();
  const isAdmin = isAdminUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('user');

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    navigate(`/search?type=${searchType}&query=${encodeURIComponent(searchQuery.trim())}`);
  };

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', flexShrink: 0 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Plazart
          </Link>
        </h1>

        {/* Contenedor de Buscador */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '750px', margin: '0 30px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', outline: 'none', border: '1px solid var(--border-color)', background: 'transparent', color: 'inherit', cursor: 'pointer' }}
            >
              <option value="user" style={{ color: '#000' }}>Usuarios</option>
              <option value="post" style={{ color: '#000' }}>Publicaciones</option>
            </select>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', outline: 'none', border: '1px solid var(--border-color)', background: 'transparent', color: 'inherit' }}
            />
            <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px' }}>
              Buscar
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
          <Link to={isAuthenticated ? "/contact" : "/login"}>
            <button style={{ padding: '6px 14px', fontSize: '14px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              Contacto
            </button>
          </Link>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/users">
                  <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '14px' }}>Gestionar usuarios</button>
                </Link>
              )}
              {userId && (
                <Link to={`/profile/${userId}`}>
                  <button style={{ padding: '6px 14px', fontSize: '14px', background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
                    Ver Perfil
                  </button>
                </Link>
              )}
              <button onClick={handleLogout} style={{ padding: '6px 14px', fontSize: '14px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button style={{ padding: '6px 14px', fontSize: '14px', background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
                  Iniciar sesión
                </button>
              </Link>
              <Link to="/register">
                <button style={{ padding: '6px 14px', fontSize: '14px' }}>Registrarse</button>
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
