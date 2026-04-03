import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, removeToken, removeItem, isAdminUser } from '../utils/storage';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!getToken();
  const isAdmin = isAdminUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('user');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    try {
      const response = await fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: searchType, query: searchQuery.trim() })
      });

      const data = await response.json();
      if (response.ok) {
        setSearchResults(data);
      } else {
        console.error('Search error:', data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search request failed', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
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
        <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '500px', margin: '0 20px' }}>
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

          {/* Cuadro de resultados del buscador */}
          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', marginTop: '8px', zIndex: 1000, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {isSearching ? (
                <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>Buscando...</div>
              ) : searchResults.length > 0 ? (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {searchResults.map(res => (
                    <li key={res.id} style={{ borderBottom: '1px solid #eee' }}>
                      {searchType === 'user' ? (
                        <Link
                          to={`/profile/${res.id}`}
                          state={{ user: res }}
                          style={{ display: 'block', padding: '12px 15px', textDecoration: 'none', color: '#333', cursor: 'pointer' }}
                          onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ fontWeight: '500' }}>{res.username}</div>
                        </Link>
                      ) : (
                        <Link
                          to={`/post/${res.id}`}
                          state={{ post: res }}
                          style={{ display: 'block', padding: '12px 15px', textDecoration: 'none', color: '#333', cursor: 'pointer' }}
                          onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ fontWeight: '500' }}>{res.title}</div>
                          <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>por {res.author}</div>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>No se encontraron resultados para "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
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
