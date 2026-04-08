import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, removeToken, removeItem, isAdminUser } from '../utils/storage';
import '../styles/HeaderStyle.css';

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
    <header className="header">
      <h1 className="logo">
        <Link to="/" className="logo-link">
          Plazart
        </Link>
      </h1>

      {/* Contenedor de Buscador */}
      <div className="buscador-container">
        <form onSubmit={handleSearch} className="formulario-busqueda">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="buscador-select"
          >
            <option value="user">Usuarios</option>
            <option value="post">Publicaciones</option>
          </select>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="buscador-escrito"
          />
          <button type="submit" className="buscador-boton">
            Buscar
          </button>
        </form>
      </div>

      <div className="botones-header">
        <Link to={isAuthenticated ? "/contact" : "/login"}>
          <button className="boton-contacto">
            Contacto
          </button>
        </Link>
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <Link to="/users">
                <button className="boton-gestionar-usuarios">Gestionar usuarios</button>
              </Link>
            )}
            {userId && (
              <Link to={`/profile/${userId}`}>
                <button className="boton-perfil">
                  Ver Perfil
                </button>
              </Link>
            )}
            <button onClick={handleLogout} className="boton-salir">
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="boton-iniciar-sesion">
                Iniciar sesión
              </button>
            </Link>
            <Link to="/register">
              <button className="boton-registrarse">Registrarse</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
