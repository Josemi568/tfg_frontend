import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken } from '../utils/storage'

/**
 * Componente que redirige al usuario a la página de inicio
 * si no está autenticado.
 */
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!getToken()

  if (isAuthenticated) {
    return children
  }

  return <Navigate to="/login" replace />
}

export default PrivateRoute
