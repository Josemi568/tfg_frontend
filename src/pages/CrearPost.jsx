import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from '../services/httpClient'
import { getToken } from '../utils/storage'
import { Link } from 'react-router-dom'
import '../styles/CrearPostStyle.css'

/**
 * Página que permite al usuario crear una nueva publicación.
 */
const CrearPost = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileBase64, setFileBase64] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!getToken()) {
      navigate('/login')
    }
  }, [navigate])

  const getUserIdFromToken = () => {
    try {
      const token = getToken()
      if (!token) return null
      const parts = token.split('.')
      if (parts.length < 2) return null
      const payload = JSON.parse(atob(parts[1]))
      return payload.id || payload.userId || payload.user_id || payload.sub || 1
    } catch (e) {
      return null
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFileBase64(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const authorId = getUserIdFromToken()
    if (!authorId) {
      setError('No se pudo determinar el ID del usuario.')
      return
    }

    try {
      const payload = {
        title,
        description,
        img_video: fileBase64,
        author: authorId
      }

      await httpClient.post('/post/api/new', payload)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Error al crear la publicación. Inténtalo de nuevo.')
    }
  }

  return (
    <div className="container">
      <h2 className="titulo-pagina">Crear Publicación</h2>
      <form onSubmit={handleSubmit} className="formulario-post">
        <div className="grupo-formulario">
          <label htmlFor="title" className="etiqueta-formulario">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="campo-entrada"
          />
        </div>
        <div className="grupo-formulario">
          <label htmlFor="description" className="etiqueta-formulario">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="campo-texto"
          />
        </div>
        <div className="grupo-formulario">
          <label htmlFor="file" className="etiqueta-formulario">Imagen o Video:</label>
          <input
            type="file"
            id="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="campo-archivo"
          />
        </div>

        {error && <p className="mensaje-error">{error}</p>}

        <button type="submit" className="boton-primario">Crear</button>
      </form>
      <p className="enlace-volver"><Link to="/dashboard">Volver al inicio</Link></p>
    </div>
  )
}

export default CrearPost
