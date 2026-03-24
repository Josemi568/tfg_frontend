import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import httpClient from '../services/httpClient';
import { getToken } from '../utils/storage';
import CommentList from '../components/CommentList';

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
    if (!post) {
      const fetchPost = async () => {
        try {
          // Fallback: fetch all and find the one we need if no single endpoint exists
          const response = await httpClient.get('http://localhost:8000/post/api/allPosts');
          const foundPost = response.data.find(p => p.id.toString() === id);
          if (foundPost) {
            setPost(foundPost);
            setLikes(foundPost.likes || 0);
            setDislikes(foundPost.dislikes || 0);
            setUserAction(foundPost.userAction || 'none');
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
    } else {
      setLikes(post.likes || 0);
      setDislikes(post.dislikes || 0);
      setUserAction(post.userAction || 'none');
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
              <button 
                onClick={() => handleLikeDislike('like')}
                style={{ 
                  background: userAction === 'like' ? '#e2e8f0' : '#f1f5f9', 
                  color: '#1e293b', 
                  border: userAction === 'like' ? '2px solid #3b82f6' : '1px solid var(--border-color)', 
                  padding: '8px 16px', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  fontWeight: userAction === 'like' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}>
                👍 {likes}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => handleLikeDislike('dislike')}
                style={{ 
                  background: userAction === 'dislike' ? '#e2e8f0' : '#f1f5f9', 
                  color: '#1e293b', 
                  border: userAction === 'dislike' ? '2px solid #ef4444' : '1px solid var(--border-color)', 
                  padding: '8px 16px', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  fontWeight: userAction === 'dislike' ? 'bold' : 'normal',
                  transition: 'all 0.2s ease'
                }}>
                👎 {dislikes}
              </button>
            </div>
          </div>
        </div>

        {post.description && (
          <div style={{ marginTop: '40px', fontSize: '1.2rem', lineHeight: '1.6', color: '#334155' }}>
            {post.description}
          </div>
        )}

        {/* Comment Section */}
        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
        
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.5rem', color: '#1e293b' }}>Comentarios</h3>
          
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="comenta algo bonito"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem' }}
              required
            />
            <button type="submit" className="btn-primary" style={{ padding: '16px 32px', borderRadius: '12px', whiteSpace: 'nowrap', fontSize: '1rem', fontWeight: 600 }}>
              Comentar
            </button>
          </form>
          {commentError && <p style={{ color: 'red', marginTop: '12px', fontSize: '0.95rem' }}>{commentError}</p>}
          {commentSuccess && <p style={{ color: 'green', marginTop: '12px', fontSize: '0.95rem' }}>{commentSuccess}</p>}

          {/* List of comments */}
          <CommentList postId={id} refreshTrigger={refreshComments} />
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
