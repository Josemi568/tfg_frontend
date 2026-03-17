import React from 'react'
import { Link } from 'react-router-dom'
import { getToken, getItem, removeToken, removeItem } from '../utils/storage'
import PostList from '../components/PostList'

const Dashboard = () => {
  const isAuthenticated = !!getToken()
  const username = getItem('username')

  // Determine if the current user has ROLE_ADMIN by decoding the JWT payload
  const isAdmin = (() => {
    try {
      const token = getToken()
      if (!token) return false
      const parts = token.split('.')
      if (parts.length < 2) return false
      const payload = JSON.parse(atob(parts[1]))
      const roles = payload.roles || payload.authorities || payload.role || payload.rolesGranted || []
      if (Array.isArray(roles)) return roles.includes('ROLE_ADMIN')
      if (typeof roles === 'string') return roles === 'ROLE_ADMIN'
      return false
    } catch (e) {
      return false
    }
  })()

  const handleLogout = () => {
    removeToken()
    removeItem('username')
    window.location.href = '/'
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Plazart
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isAuthenticated ? (
            <>
              <Link to="/crear-post">
                <button>Crear publicación</button>
              </Link>
              {isAdmin && (
                <Link to="/users">
                  <button className="btn-secondary">Gestionar usuarios</button>
                </Link>
              )}
              <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button style={{ background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
                  Iniciar sesión
                </button>
              </Link>
              <Link to="/register">
                <button>Registrarse</button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        {isAuthenticated ? (
          <>
            <div className="card glass" style={{ marginBottom: '48px' }}>
              <h2 style={{ marginTop: 0 }}>Hola{username ? `, ${username}` : ''}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                Nos alegra verte de nuevo. Aquí tienes las últimas novedades de la plataforma.
              </p>
            </div>
            <PostList />
          </>
        ) : (
          <div className="card glass" style={{ marginBottom: '48px', textAlign: 'center' }}>
            <h2>Bienvenido a Plazart</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Únete a nuestra comunidad para compartir y descubrir contenido increíble.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
