import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as registerUser } from '../services/auth'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleRegister = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await registerUser({ username, password })
      setSuccess('Registro correcto. Redirigiendo...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError('Registro fallido. Inténtalo de nuevo.')
    }
  }

  return (
    <div className="container register-wrapper">
      <form className="register-form" onSubmit={handleRegister}>
        <h2 className="register-header">Registro</h2>

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
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="btn-primary">Registrarse</button>
      </form>
    </div>
  )
}

export default Register
