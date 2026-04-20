import React, { useEffect, useState } from 'react';
import httpClient from '../services/httpClient';
import { isAdminUser } from '../utils/storage';
import PostCard from './PostCard';
import '../styles/PostListStyle.css';

/**
 * Componente que recibe la información de la base de datos
 * y muestra una lista de publicaciones.
 */
const PostList = ({ limit }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await httpClient.get('/post/api/all');
        const adminStatus = isAdminUser();
        const availablePosts = response.data.filter(post => adminStatus || (post.status !== 1 && post.author_status !== 1));

        // Ordenar por fecha descendente (más recientes primero)
        const sortedPosts = availablePosts.sort((a, b) => {
          // Si las fechas son parseables o se pueden comparar
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          // Fallback a comparar por id si las fechas no son válidas
          if (isNaN(dateA) || isNaN(dateB)) {
            return b.id - a.id; 
          }
          return dateB - dateA;
        });

        const finalPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts;
        setPosts(finalPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('No se pudieron cargar las publicaciones.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="mensaje-carga">Cargando publicaciones...</div>;
  }

  if (error) {
    return <div className="mensaje-error">{error}</div>;
  }

  return (
    <section className="seccion-lista-posts">
      <h2 className="titulo-lista">Nuevas publicaciones</h2>
      <p className="subtitulo-lista">Explora lo último de la comunidad.</p>

      {posts.length === 0 ? (
        <p>No hay publicaciones recientes.</p>
      ) : (
        <div className="row g-4 mt-1">
          {posts.map((post) => (
            <div className="col-12 col-md-6 col-lg-4 col-xl-3 col-xxl-3" key={post.id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PostList;
