import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { isAdminUser } from '../utils/storage';

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
      className="card post-card glass"
      style={{ height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
    >
      <h3 className="post-title" style={{ transition: 'color 0.2s' }}>
        {post.title} {isAdmin && post.status === 1 && <span style={{ color: '#ef4444', fontSize: '0.9em' }}>(baneado)</span>}
      </h3>

      <div className="post-media-container" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '12px', marginBottom: '16px', background: '#f1f5f9' }}>
        {post.img_video ? (
          isVideo(mediaSrc) ? (
            <video
              src={mediaSrc}
              className="post-media"
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={mediaSrc}
              alt={post.title}
              className="post-media"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )
        ) : null}

        <div className="media-placeholder" style={{
          display: post.img_video ? 'none' : 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '0.875rem'
        }}>
          Sin media disponible
        </div>
      </div>

      <div className="post-meta" style={{ marginTop: 'auto' }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>
          Publicado por{' '}
          <Link 
            to={`/profile/${post.author_id || post.author}`} 
            onClick={(e) => e.stopPropagation()} 
            style={{ fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'none' }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {post.author}
          </Link>
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.date}</span>
      </div>
    </div>

  );
};

export default PostCard;
