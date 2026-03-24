import React, { useEffect, useState } from 'react';
import httpClient from '../services/httpClient';

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
        setComments(postComments);
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
            <div key={comment.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>{comment.author}</div>
              <div style={{ color: '#334155', lineHeight: '1.5' }}>{comment.text}</div>
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
