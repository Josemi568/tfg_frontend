import React from 'react'
<<<<<<< HEAD
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
=======

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
    </div>
  )
}

export default Dashboard
