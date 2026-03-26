import React, { useEffect, useState } from 'react';
import httpClient from '../services/httpClient';
import { isAdminUser } from '../utils/storage';

const CommentList = ({ postId, refreshTrigger }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await httpClient.get('/comment/api/all');
        const postComments = response.data.filter(c => c.post === parseInt(postId));
        const adminStatus = isAdminUser();
        const availableComments = postComments.filter(c => adminStatus || c.status !== 1);
        setComments(availableComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('No se pudieron cargar los comentarios.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, refreshTrigger]);

  const isAdmin = isAdminUser();

  const handleBanToggle = async (commentId) => {
    try {
      const response = await httpClient.post(`/comment/${commentId}/ban`);
      if (response.data) {
        setComments(prevComments => prevComments.map(c => 
          c.id === commentId ? { ...c, status: response.data.status } : c
        ));
      }
    } catch (err) {
      console.error('Error toggling comment ban status:', err);
      alert('Error cambiando el estado del comentario.');
    }
  };

  if (loading) {
    return <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando comentarios...</div>;
  }

  if (error) {
    return <div style={{ marginTop: '32px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ marginTop: '32px' }}>
      {comments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>
                  {comment.author} {isAdmin && comment.status === 1 && <span style={{ color: '#ef4444', fontSize: '0.9em', marginLeft: '8px' }}>(Eliminado)</span>}
                </div>
                <div style={{ color: '#334155', lineHeight: '1.5' }}>{comment.text}</div>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => handleBanToggle(comment.id)}
                  className={`btn ${comment.status === 1 ? 'btn-secondary' : 'btn-danger'}`}
                  style={{ padding: '6px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap', marginLeft: '16px' }}
                >
                  {comment.status === 1 ? 'Restaurar Comentario' : 'Eliminar Comentario'}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>No hay comentarios aún. ¡Sé el primero en comentar!</p>
      )}
    </div>
  );
};

export default CommentList;
