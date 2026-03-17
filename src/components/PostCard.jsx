import React from 'react';

const PostCard = ({ post }) => {
  const BACKEND_URL = 'http://localhost:8000';

  const getMediaSrc = (src) => {
    if (!src) return '';
    // If it's already a full URL or a data URI, return as is
    if (src.startsWith('data:') || src.startsWith('http')) {
      return src;
    }
    // Otherwise, assume it's a relative path from the backend
    return `${BACKEND_URL}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  const isVideo = (url) => {
    if (!url) return false;
    // Check for video data URI
    if (url.startsWith('data:video/')) return true;
    // Check for common video extensions
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => {
      // Basic check: ends with extension (ignoring query params for now)
      const cleanUrl = url.split('?')[0].split('#')[0];
      return cleanUrl.toLowerCase().endsWith(ext);
    });
  };

  const mediaSrc = getMediaSrc(post.img_video);

  return (
    <div className="card post-card glass">
      <h3 className="post-title">{post.title}</h3>
      
      <div className="post-media-container" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '12px', marginBottom: '16px', background: '#f1f5f9' }}>
        {post.img_video ? (
          isVideo(mediaSrc) ? (
            <video 
              src={mediaSrc} 
              className="post-media" 
              controls 
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
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          )
        ) : null}
        
        {/* Fallback shadow/placeholder if media fails or is missing */}
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
          Publicado por <span className="post-author" style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{post.author}</span>
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.date}</span>
      </div>
    </div>
  );
};

export default PostCard;
