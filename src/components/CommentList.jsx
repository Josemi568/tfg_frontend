import React, { useEffect, useState } from 'react';
import httpClient from '../services/httpClient';
import { isAdminUser } from '../utils/storage';
import '../styles/CommentListStyle.css';

/**
 * Componente que recibe la información de la base de datos
 * y muestra una lista de comentarios.
 */
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
    return <div className="cargando-comentarios">Cargando comentarios...</div>;
  }

  if (error) {
    return <div className="error-comentarios">{error}</div>;
  }

  return (
    <div className="lista-comentarios-container">
      {comments.length > 0 ? (
        <div className="contenedor-comentarios">
          {comments.map((comment) => (
            <div key={comment.id} className="tarjeta-comentario">
              <div>
                <div className="autor-comentario">
                  {comment.author} {isAdmin && comment.status === 1 && <span className="etiqueta-eliminado">(Eliminado)</span>}
                </div>
                <div className="texto-comentario">{comment.text}</div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleBanToggle(comment.id)}
                  className={`btn ${comment.status === 1 ? 'btn-secondary' : 'btn-danger'} boton-eliminar`}
                >
                  {comment.status === 1 ? 'Restaurar Comentario' : 'Eliminar Comentario'}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mensaje-vacio">No hay comentarios aún. ¡Sé el primero en comentar!</p>
      )}
    </div>
  );
};

export default CommentList;
