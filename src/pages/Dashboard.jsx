import React from 'react'
import { Link } from 'react-router-dom'
import { getToken, getItem, removeToken, removeItem } from '../utils/storage'

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
    <div>
      <h1>Plazart</h1>
      {isAuthenticated ? (
        <>
          <p>Bienvenido{username ? `, ${username}` : ''} — este es tu dashboard.</p>
          <div>
            <button onClick={handleLogout}>Cerrar sesión</button>
            {isAdmin && (
              <Link to="/users">
                <button style={{ marginLeft: '8px' }}>Gestionar usuarios</button>
              </Link>
            )}
          </div>
        </>
      ) : (
        <>
          <p>Bienvenido — por favor inicia sesión o regístrate.</p>
          <p>
            <Link to="/login">Iniciar sesión</Link>
          </p>
          <p>
            <Link to="/register">Registrarse</Link>
          </p>
        </>
      )}
    </div>
  )
}

export default Dashboard
