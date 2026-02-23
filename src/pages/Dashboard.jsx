import React from 'react'
import { Link } from 'react-router-dom'
import { getToken, getItem, removeToken, removeItem } from '../utils/storage'

const Dashboard = () => {
  const isAuthenticated = !!getToken()
  const username = getItem('username')

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
          <button onClick={handleLogout}>Cerrar sesión</button>
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
