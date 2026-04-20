import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import httpClient from '../services/httpClient';
import PostCard from '../components/PostCard';
import { getToken, isAdminUser } from '../utils/storage';
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
        const adminStatus = isAdminUser();
        const isBannedUser = userData.status === 1;

        const userPosts = postsResponse.data.filter(post =>
          userData.posts.includes(post.id) && (adminStatus || !isBannedUser)
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
    <div className="container-fluid py-3 py-md-4 py-lg-5 px-3 px-md-4 px-lg-5">
      <main className="row justify-content-center m-0 w-100">
        <div className="col-12 col-xl-11 col-xxl-10">
          <div className="contenedor-perfil">
            <div className="tarjeta-perfil">
              <div className="cabecera-perfil d-flex flex-column flex-md-row justify-content-between align-items-center flex-wrap gap-4 mb-5">
                <div className="info-usuario d-flex flex-column flex-sm-row align-items-center gap-3 mb-4 mb-md-0">
                  <h1 className="nombre-usuario text-break display-3 display-md-2 display-lg-1 fw-bold mb-0">
                    {user.username}
                  </h1>
                  {showFollowButton && (
                    <button
                      onClick={handleFollow}
                      className={`boton-seguir btn-lg ${isFollowingLocal ? 'siguiendo' : 'no-siguiendo'}`}
                    >
                      {isFollowingLocal ? 'Dejar de seguir' : 'Seguir'}
                    </button>
                  )}
                </div>

                <div className="estadisticas-perfil d-flex flex-wrap justify-content-center gap-2 gap-sm-3 p-2 p-md-4 rounded-4">
                  <div className="item-estadistica text-center px-1 px-sm-2">
                    <span className="valor-estadistica fs-4 fs-sm-2 fs-md-1 fw-bold d-block">
                      {typeof user.followers === 'number' ? user.followers : (user.followers?.length || 0)}
                    </span>
                    <span className="etiqueta-estadistica text-uppercase small ls-1 text-muted" style={{ fontSize: '0.65rem' }}>Seguidores</span>
                  </div>
                  <div className="separador-estadistica border-start h-100 mx-1"></div>
                  <div className="item-estadistica text-center px-1 px-sm-2">
                    <span className="valor-estadistica fs-4 fs-sm-2 fs-md-1 fw-bold d-block">
                      {typeof user.follows === 'number' ? user.follows : (user.follows?.length || 0)}
                    </span>
                    <span className="etiqueta-estadistica text-uppercase small ls-1 text-muted" style={{ fontSize: '0.65rem' }}>Siguiendo</span>
                  </div>
                </div>
              </div>

              <section>
                <h2 className="titulo-seccion-publicaciones fs-4 fs-md-2 fw-bold">Publicaciones</h2>

                {posts.length === 0 ? (
                  <div className="tarjeta-perfil contenedor-vacio text-center">
                    <p className="mensaje-vacio">Este usuario aún no ha publicado nada.</p>
                  </div>
                ) : (
                  <div className="row g-4 mt-1">
                    {posts.map(post => (
                      <div className="col-12 col-md-6 col-lg-4 col-xl-3 col-xxl-3" key={post.id}>
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;

