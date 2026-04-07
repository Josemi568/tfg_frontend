import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import httpClient from '../services/httpClient';
import PostCard from '../components/PostCard';
import { getToken } from '../utils/storage';

/**
 * Página de perfil de usuario.
 * 
 * Muestra la información del usuario (seguidores, seguidos) y sus publicaciones.
 */
const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowingLocal, setIsFollowingLocal] = useState(false);

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

  const handleFollow = async () => {
    const followerId = getUserIdFromToken();
    const followedId = user?.id;

    if (!followerId) {
      return;
    }

    const action = isFollowingLocal ? 'unfollow' : 'follow';

    try {
      await httpClient.post('/user/api/follow', { followerId, followedId, action });

      // Cambiamos el estado local del botón
      setIsFollowingLocal(!isFollowingLocal);

      // Actualizamos localmente para que se cambie el contador visualmente
      setUser(prev => {
        if (!prev) return prev;

        // Manejamos de forma segura si `followers` es un número o un array.
        let currentFollowersCount = typeof prev.followers === 'number'
          ? prev.followers
          : (Array.isArray(prev.followers) ? prev.followers.length : 0);

        if (action === 'follow') {
          currentFollowersCount++;
        } else {
          currentFollowersCount = Math.max(0, currentFollowersCount - 1);
        }

        return {
          ...prev,
          followers: currentFollowersCount
        };
      });

    } catch (err) {
      console.error('Error al seguir/dejar de seguir al usuario:', err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // El endpoint /api/users devuelve todos los usuarios
        const usersResponse = await httpClient.get('/users');
        const usersArray = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        const userData = usersArray.find(u =>
          u.id?.toString() === id ||
          u._id?.toString() === id ||
          u.username?.toLowerCase() === id?.toLowerCase() ||
          u.name?.toLowerCase() === id?.toLowerCase()
        );

        if (!userData) {
          setError(`Usuario no encontrado (ID buscado: "${id}", Usuarios en lista: ${usersArray.length}).`);
          setLoading(false);
          return;
        }

        setUser(userData);

        // Fetch all posts to filter them by author
        const postsResponse = await httpClient.get('/post/api/all');
        // Filtramos los posts cuyo autor coincida con el id del perfil
        // Asumimos que el objeto post tiene author_id o author (si es el id)
        // Por la función listUsers del backend, sabemos que el usuario tiene 'posts' como un array de IDs
        const userPosts = postsResponse.data.filter(post =>
          userData.posts.includes(post.id)
        );

        setPosts(userPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Error al cargar el perfil del usuario.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Cargando perfil...</div>;
  if (error) return <div className="container error" style={{ textAlign: 'center', padding: '100px' }}>{error}</div>;
  if (!user) return null;

  const currentUserId = getUserIdFromToken();
  // Nos aseguramos de comparar como Strings para no tener conflictos de tipos (ej: 1 !== "1")
  const showFollowButton = currentUserId && String(currentUserId) !== String(user.id);

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      {/* <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: '32px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
      >
        &larr; Volver
      </button> */}

      <div className="card glass" style={{ padding: '48px', marginBottom: '48px', border: 'none', background: 'rgba(255, 255, 255, 0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{
              fontSize: '3.5rem',
              margin: 0,
              background: 'linear-gradient(to right, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800
            }}>
              {user.username}
            </h1>
            {showFollowButton && (
              <button
                onClick={handleFollow}
                style={{
                  padding: '10px 24px',
                  borderRadius: '24px',
                  border: isFollowingLocal ? '1px solid var(--border-color, #ccc)' : 'none',
                  background: isFollowingLocal ? 'transparent' : 'var(--primary-color, #6366f1)',
                  color: isFollowingLocal ? 'var(--text-color, #333)' : 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: isFollowingLocal ? 'none' : 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
                  transition: 'all 0.2s',
                  fontSize: '1rem'
                }}
                onMouseOver={(e) => {
                  if (isFollowingLocal) {
                    e.currentTarget.style.background = '#ffe5e5';
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.borderColor = '#ef4444';
                  } else {
                    e.currentTarget.style.background = '#4f46e5';
                  }
                }}
                onMouseOut={(e) => {
                  if (isFollowingLocal) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-color, #333)';
                    e.currentTarget.style.borderColor = 'var(--border-color, #ccc)';
                  } else {
                    e.currentTarget.style.background = 'var(--primary-color, #6366f1)';
                  }
                }}
              >
                {isFollowingLocal ? 'Dejar de seguir' : 'Seguir'}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '40px', background: 'var(--surface-color)', padding: '20px 40px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                {typeof user.followers === 'number' ? user.followers : (user.followers?.length || 0)}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Seguidores</span>
            </div>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                {typeof user.follows === 'number' ? user.follows : (user.follows?.length || 0)}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Siguiendo</span>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 style={{ fontSize: '2.25rem', marginBottom: '32px', fontWeight: 700 }}>Publicaciones</h2>

        {posts.length === 0 ? (
          <div className="card glass" style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Este usuario aún no ha publicado nada.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
