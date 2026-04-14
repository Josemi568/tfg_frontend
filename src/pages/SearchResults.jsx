import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import '../styles/SearchResultsStyle.css';

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
    <div className="container-fluid py-3 py-md-4 py-lg-5 px-3 px-md-4 px-lg-5">
      <main className="row justify-content-center seccion-principal m-0 w-100">
        <div className="col-12 col-xl-11 col-xxl-10">
          <h2 className="titulo-resultados">Resultados de la búsqueda</h2>
          <p className="subtitulo-resultados">
            Mostrando resultados para "{query}" en {type === 'post' ? 'Publicaciones' : 'Usuarios'}
          </p>

          {loading ? (
            <div>Buscando...</div>
          ) : error ? (
            <div className="mensaje-error">{error}</div>
          ) : results.length === 0 ? (
            <p>No se encontraron resultados.</p>
          ) : (
            type === 'post' ? (
              <div className="row g-4 mt-1">
                {results.map((post) => (
                  <div className="col-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3" key={post.id}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="lista-usuarios list-unstyled p-0">
                {results.map((user) => (
                  <li key={user.id} className="tarjeta-usuario efecto-cristal">
                    <div className="contenedor-info-usuario d-flex align-items-baseline gap-2">
                      <h3 className="nombre-usuario">
                        <Link to={`/profile/${user.id}`} className="enlace-usuario">
                          {user.username}
                        </Link>
                      </h3>
                      <span className="conteo-seguidores">
                        {user.followers || 0} {user.followers === 1 ? 'seguidor' : 'seguidores'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
