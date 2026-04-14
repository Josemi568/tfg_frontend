import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { isAdminUser } from '../utils/storage';
import '../styles/PostCardStyle.css';

/**
 * Componente que muestra una tarjeta con la
 * información de una publicación.
 */
const PostCard = ({ post }) => {
  const BACKEND_URL = 'http://localhost:8000';
  const isAdmin = isAdminUser();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/post/${post.id}`, { state: { post } });
  };


  const getMediaSrc = (src) => {
    if (!src) return '';
    // Si es una URL completa o un URI de datos, lo devuelve como está
    if (src.startsWith('data:') || src.startsWith('http')) {
      return src;
    }
    // Si no, asume que es una ruta relativa desde el backend
    return `${BACKEND_URL}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  const isVideo = (url) => {
    if (!url) return false;
    // Comprueba si la URL es un video
    if (url.startsWith('data:video/')) return true;
    // Comprueba entre las posibles extensiones comunes de archivos de video
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => {
      const cleanUrl = url.split('?')[0].split('#')[0];
      return cleanUrl.toLowerCase().endsWith(ext);
    });
  };

  const mediaSrc = getMediaSrc(post.img_video);

  return (
    <div
      onClick={handleCardClick}
      className="tarjeta-publicacion"
    >
      <h3 className="titulo-publicacion">
        {post.title} {isAdmin && post.status === 1 && <span className="baneado-texto">(baneado)</span>}
      </h3>

      <div className="contenedor-media">
        {post.img_video ? (
          isVideo(mediaSrc) ? (
            <video
              src={mediaSrc}
              className="media-publicacion"
              muted
            />
          ) : (
            <img
              src={mediaSrc}
              alt={post.title}
              className="media-publicacion"
              loading="lazy"
            />
          )
        ) : (
          <div className="marcador-posicion-media">
            Sin media disponible
          </div>
        )}
      </div>

      <div className="metadatos-publicacion">
        <p className="info-autor">
          Publicado por{' '}
          <Link 
            to={`/profile/${post.author_id || post.author}`} 
            onClick={(e) => e.stopPropagation()} 
            className="autor-link"
          >
            {post.author}
          </Link>
        </p>
        <span className="fecha-publicacion">{post.date}</span>
      </div>
    </div>

  );
};

export default PostCard;
