import React, { useEffect, useState } from 'react';
import httpClient from '../services/httpClient';
import { isAdminUser } from '../utils/storage';
import PostCard from './PostCard';

/**
 * Componente que recibe la información de la base de datos
 * y muestra una lista de publicaciones.
 */
const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await httpClient.get('/post/api/all');
        const adminStatus = isAdminUser();
        const availablePosts = response.data.filter(post => adminStatus || post.status !== 1);
        setPosts(availablePosts);
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
    return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando publicaciones...</div>;
  }

  if (error) {
    return <div className="error" style={{ textAlign: 'center', padding: '40px' }}>{error}</div>;
  }

  return (
    <section style={{ marginTop: '48px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Nuevas publicaciones</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Explora lo último de la comunidad.</p>

      {posts.length === 0 ? (
        <p>No hay publicaciones recientes.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PostList;
