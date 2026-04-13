import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import httpClient from '../services/httpClient';
import { getToken, isAdminUser } from '../utils/storage';
import CommentList from '../components/CommentList';
import '../styles/PostDetailStyle.css';

/**
 * Página que muestra los detalles de una publicación.
 * 
 * Ademas permite al usuario interactuar con la publicación
 * (dar like, dislike y comentar).
 */
const PostDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(!post);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');
  const [refreshComments, setRefreshComments] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState('none');

  const BACKEND_URL = 'http://localhost:8000';
  const isAdmin = isAdminUser();

  const handleBanToggle = async () => {
    try {
      const response = await httpClient.post(`/post/${id}/ban`);
      if (response.data) {
        setPost(prev => ({ ...prev, status: response.data.status }));
      }
    } catch (err) {
      console.error('Error toggling ban status:', err);
      alert('Error cambiando el estado de la publicación.');
    }
  };

  const getUserIdFromToken = () => {
    try {
      const token = getToken();
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.id || payload.userId || payload.user_id || payload.sub || 1;
    } catch (e) {
      return null;
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    setCommentSuccess('');

    if (!commentText.trim()) {
      setCommentError('El comentario no puede estar vacío');
      return;
    }

    const authorId = getUserIdFromToken();
    if (!authorId) {
      setCommentError('Debes iniciar sesión para comentar');
      return;
    }

    try {
      const payload = {
        text: commentText,
        author: authorId,
        post: parseInt(id)
      };

      await httpClient.post('/comment/api/new', payload);
      setCommentSuccess('Comentario creado con éxito');
      setCommentText('');
      setRefreshComments(prev => prev + 1);
    } catch (err) {
      console.error('Error creating comment:', err);
      setCommentError('Error al crear el comentario. Inténtalo de nuevo.');
    }
  };

  const handleLikeDislike = async (action) => {
    const authorId = getUserIdFromToken();
    if (!authorId) {
      return;
    }

    const previousStatus = userAction;
    let newLikes = likes;
    let newDislikes = dislikes;
    let newAction = action;

    if (action === 'like') {
      if (previousStatus === 'dislike') {
        newLikes += 1;
        newDislikes = Math.max(0, newDislikes - 1);
      } else if (previousStatus === 'none') {
        newLikes += 1;
      } else if (previousStatus === 'like') {
        newLikes = Math.max(0, newLikes - 1);
        newAction = 'none';
      }
    } else if (action === 'dislike') {
      if (previousStatus === 'like') {
        newDislikes += 1;
        newLikes = Math.max(0, newLikes - 1);
      } else if (previousStatus === 'none') {
        newDislikes += 1;
      } else if (previousStatus === 'dislike') {
        newDislikes = Math.max(0, newDislikes - 1);
        newAction = 'none';
      }
    }

    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserAction(newAction);

    try {
      const payload = {
        action: action,
        previous_status: previousStatus
      };
      await httpClient.post(`/post/api/like_dislike/${id}`, payload);
    } catch (err) {
      console.error('Error updating like/dislike:', err);
      setLikes(likes);
      setDislikes(dislikes);
      setUserAction(previousStatus);
    }
  };

  useEffect(() => {
    const postFromState = location.state?.post;

    if (postFromState && postFromState.id.toString() === id) {
      setPost(postFromState);
      setLoading(false);
      setError(null);
    } else if (!post || post.id.toString() !== id) {
      setLoading(true);
      setError(null);
      const fetchPost = async () => {
        try {
          const response = await httpClient.get('http://localhost:8000/post/api/allPosts');
          const foundPost = response.data.find(p => p.id.toString() === id);
          if (foundPost) {
            setPost(foundPost);
            setError(null);
          } else {
            setError('Publicación no encontrada.');
          }
        } catch (err) {
          console.error('Error fetching post detail:', err);
          setError('No se pudo cargar la información de la publicación.');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, location.state]);

  useEffect(() => {
    if (post) {
      setLikes(post.likes || 0);
      setDislikes(post.dislikes || 0);
      setUserAction(post.userAction || 'none');
    }
  }, [post]);

  const getMediaSrc = (src) => {
    if (!src) return '';
    if (src.startsWith('data:') || src.startsWith('http')) return src;
    return `${BACKEND_URL}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  const isVideo = (url) => {
    if (!url) return false;
    if (url.startsWith('data:video/')) return true;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => {
      const cleanUrl = url.split('?')[0].split('#')[0];
      return cleanUrl.toLowerCase().endsWith(ext);
    });
  };

  if (loading) return <div className="contenedor-detalle centrada">Cargando publicación...</div>;
  if (error) return <div className="contenedor-detalle centrada error">{error}</div>;
  if (!post) return null;

  const mediaSrc = getMediaSrc(post.img_video);

  return (
    <div className="container">
      <article className="tarjeta-publicacion">
        <div className="cabecera-detalle">
          <h1 className="titulo-detalle">
            {post.title} {isAdmin && post.status === 1 && <span className="texto-baneado">(baneado)</span>}
          </h1>
          {isAdmin && (
            <button
              onClick={handleBanToggle}
              className={`btn ${post.status === 1 ? 'btn-secondary' : 'btn-danger'} boton-accion-ban`}
            >
              {post.status === 1 ? 'Desbanear Publicación' : 'Banear Publicación'}
            </button>
          )}
        </div>

        <div className="contenedor-multimedia-detalle">
          {post.img_video ? (
            isVideo(mediaSrc) ? (
              <video src={mediaSrc} controls className="multimedia-detalle" />
            ) : (
              <img src={mediaSrc} alt={post.title} className="multimedia-detalle" />
            )
          ) : (
            <div className="sin-multimedia">Sin contenido multimedia</div>
          )}
        </div>

        <div className="info-pie-detalle">
          <div className="contenedor-autor">
            <p className="texto-autor">
              Publicado por{' '}
              <Link
                to={`/profile/${post.author_id || post.author}`}
                className="enlace-autor"
              >
                {post.author}
              </Link>
            </p>
            <span className="fecha-publicacion">{post.date}</span>
          </div>

          <div className="contenedor-reacciones">
            <div className="contenedor-reaccion-unitaria">
              <button
                onClick={() => handleLikeDislike('like')}
                className={`boton-reaccion ${userAction === 'like' ? 'like-activo' : ''}`}>
                👍 {likes}
              </button>
            </div>
            <div className="contenedor-reaccion-unitaria">
              <button
                onClick={() => handleLikeDislike('dislike')}
                className={`boton-reaccion ${userAction === 'dislike' ? 'dislike-activo' : ''}`}>
                👎 {dislikes}
              </button>
            </div>
          </div>
        </div>

        {post.description && (
          <div className="descripcion-post">
            {post.description}
          </div>
        )}

        <hr className="separador-detalle" />

        <div className="seccion-comentarios">
          <h3 className="titulo-comentarios">Comentarios</h3>

          <form onSubmit={handleCommentSubmit} className="formulario-comentarios">
            <input
              type="text"
              placeholder="comenta algo bonito"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="entrada-comentario"
              required
            />
            <button type="submit" className="boton-enviar-comentario">
              Comentar
            </button>
          </form>
          {commentError && <p className="error-comentario">{commentError}</p>}
          {commentSuccess && <p className="exito-comentario">{commentSuccess}</p>}

          <CommentList postId={id} refreshTrigger={refreshComments} />
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
