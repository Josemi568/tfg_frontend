import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import httpClient from '../services/httpClient';
import PostCard from '../components/PostCard';
import { getToken } from '../utils/storage';
import '../styles/UserProfileStyle.css';

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

  if (loading) return <div className="contenedor-perfil cargando">Cargando perfil...</div>;
  if (error) return <div className="contenedor-perfil error">{error}</div>;
  if (!user) return null;

  const currentUserId = getUserIdFromToken();
  // Nos aseguramos de comparar como Strings para no tener conflictos de tipos (ej: 1 !== "1")
  const showFollowButton = currentUserId && String(currentUserId) !== String(user.id);

  return (
    <div className="contenedor-perfil">
      <div className="tarjeta-perfil">
        <div className="cabecera-perfil">
          <div className="info-usuario">
            <h1 className="nombre-usuario">
              {user.username}
            </h1>
            {showFollowButton && (
              <button
                onClick={handleFollow}
                className={`boton-seguir ${isFollowingLocal ? 'siguiendo' : 'no-siguiendo'}`}
              >
                {isFollowingLocal ? 'Dejar de seguir' : 'Seguir'}
              </button>
            )}
          </div>

          <div className="estadisticas-perfil">
            <div className="item-estadistica">
              <span className="valor-estadistica">
                {typeof user.followers === 'number' ? user.followers : (user.followers?.length || 0)}
              </span>
              <span className="etiqueta-estadistica">Seguidores</span>
            </div>
            <div className="separador-estadistica"></div>
            <div className="item-estadistica">
              <span className="valor-estadistica">
                {typeof user.follows === 'number' ? user.follows : (user.follows?.length || 0)}
              </span>
              <span className="etiqueta-estadistica">Siguiendo</span>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="titulo-seccion-publicaciones">Publicaciones</h2>

        {posts.length === 0 ? (
          <div className="tarjeta-perfil contenedor-vacio">
            <p className="mensaje-vacio">Este usuario aún no ha publicado nada.</p>
          </div>
        ) : (
          <div className="cuadricula-publicaciones">
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

