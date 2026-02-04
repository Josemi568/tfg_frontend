
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/auth'

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
    <div className="container login-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-header">Iniciar sesión</h2>

        <div className="form-group">
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

        <div className="form-group">
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

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary">Entrar</button>
        <p className="small">¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
      </form>
    </div>
  )
}

export default Login
