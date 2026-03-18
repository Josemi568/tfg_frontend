import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import httpClient from '../services/httpClient';

const PostDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(!post);
  const [error, setError] = useState(null);

  const BACKEND_URL = 'http://localhost:8000';

  useEffect(() => {
    if (!post) {
      const fetchPost = async () => {
        try {
          // Fallback: fetch all and find the one we need if no single endpoint exists
          const response = await httpClient.get('http://localhost:8000/post/api/allPosts');
          const foundPost = response.data.find(p => p.id.toString() === id);
          if (foundPost) {
            setPost(foundPost);
          } else {
            setError('Publicación no encontrada.');
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching post detail:', err);
          setError('No se pudo cargar la información de la publicación.');
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, post]);

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

  if (loading) return <div className="container" style={{ textAlign: 'center' }}>Cargando publicación...</div>;
  if (error) return <div className="container error" style={{ textAlign: 'center' }}>{error}</div>;
  if (!post) return null;

  const mediaSrc = getMediaSrc(post.img_video);

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '24px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
      >
        &larr; Volver
      </button>

      <article className="card glass" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '32px', lineHeight: '1.1' }}>{post.title}</h1>
        
        <div style={{ position: 'relative', width: '100%', marginBottom: '40px', borderRadius: '20px', overflow: 'hidden', background: '#f1f5f9', boxShadow: 'var(--shadow-lg)' }}>
          {post.img_video ? (
            isVideo(mediaSrc) ? (
              <video src={mediaSrc} controls className="detail-media" style={{ width: '100%', display: 'block' }} />
            ) : (
              <img src={mediaSrc} alt={post.title} className="detail-media" style={{ width: '100%', display: 'block' }} />
            )
          ) : (
            <div style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>Sin contenido multimedia</div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>
              Publicado por <span className="post-author" style={{ fontWeight: 700 }}>{post.author}</span>
            </p>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{post.date}</span>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button disabled style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '12px', cursor: 'default' }}>
                👍 0
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button disabled style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '12px', cursor: 'default' }}>
                👎 0
              </button>
            </div>
          </div>
        </div>

        {post.description && (
          <div style={{ marginTop: '40px', fontSize: '1.2rem', lineHeight: '1.6', color: '#334155' }}>
            {post.description}
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetail;
