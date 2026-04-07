import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'user';
  const query = searchParams.get('query') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8000/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type, query: query.trim() }),
        });

        const data = await response.json();
        if (response.ok) {
          setResults(data);
        } else {
          console.error('Search error:', data);
          setError('Error al buscar. Inténtalo de nuevo.');
          setResults([]);
        }
      } catch (err) {
        console.error('Search request failed', err);
        setError('Error de conexión.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [type, query]);

  return (
    <div className="container">
      <main style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Resultados de la búsqueda</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Mostrando resultados para "{query}" en {type === 'post' ? 'Publicaciones' : 'Usuarios'}
        </p>

        {loading ? (
          <div>Buscando...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : results.length === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : (
          type === 'post' ? (
            <div className="posts-grid">
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {results.map((user) => (
                <li key={user.id} className="card glass" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                      <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
                        {user.username}
                      </Link>
                    </h3>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {user.followers || 0} {user.followers === 1 ? 'seguidor' : 'seguidores'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </main>
    </div>
  );
};

export default SearchResults;
