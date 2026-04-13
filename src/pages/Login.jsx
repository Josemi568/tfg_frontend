
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/auth'
import '../styles/LoginStyle.css'


/**
 * Página que permite al usuario iniciar sesión.
 */
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="container envoltorio-login">
      <form className="formulario-login" onSubmit={handleLogin}>
        <h2 className="cabecera-login">Iniciar sesión</h2>

        <div className="grupo-formulario">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            placeholder="Tu usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-login">{error}</p>}

        <button type="submit" className="boton-entrar">Entrar</button>
        <p className="texto-pequeno">¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
        <p className="texto-pequeno"><Link to="/dashboard">volve al inicio</Link></p>
      </form>
    </div>
  )
}

export default Login
