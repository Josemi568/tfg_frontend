import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from '../services/httpClient'
import { getToken } from '../utils/storage'
import { Link } from 'react-router-dom'

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
      <h2>Crear Publicación</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label htmlFor="file">Imagen o Video:</label>
          <input
            type="file"
            id="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{ width: '100%' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" className="btn-primary">Crear</button>
      </form>
      <p className="small"><Link to="/dashboard">volve al inicio</Link></p>
    </div>
  )
}

export default CrearPost
