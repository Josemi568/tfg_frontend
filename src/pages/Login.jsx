
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
    <div className="container-fluid py-3 py-md-4 py-lg-5 px-3 px-md-4 px-lg-5 envoltorio-login d-flex align-items-center justify-content-center">
      <main className="row justify-content-center w-100">
        <div className="col-12 d-flex justify-content-center">
          <form className="formulario-login w-100" onSubmit={handleLogin}>
            <h2 className="cabecera-login text-center mb-4">Iniciar sesión</h2>

            <div className="grupo-formulario mb-3">
              <label htmlFor="username" className="d-block mb-2 text-dark fw-medium">Usuario</label>
              <input
                type="text"
                id="username"
                placeholder="Tu usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-100"
              />
            </div>

            <div className="grupo-formulario mb-3">
              <label htmlFor="password" className="d-block mb-2 text-dark fw-medium">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-100"
              />
            </div>

            {error && <p className="error-login mt-2">{error}</p>}

            <button type="submit" className="boton-entrar w-100 d-block mt-3">Entrar</button>
            <p className="texto-pequeno text-center mt-3">¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
            <p className="texto-pequeno text-center"><Link to="/dashboard">Volver al inicio</Link></p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Login
