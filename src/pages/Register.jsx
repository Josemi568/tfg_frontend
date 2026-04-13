import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerUser } from '../services/auth'
import '../styles/RegisterStyle.css'

/**
 * Página que permite al usaurio registrarse en la pagina web.
 */
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
    <div className="container envoltorio-registro">
      <form className="formulario-registro" onSubmit={handleRegister}>
        <h2 className="cabecera-registro">Registro</h2>

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
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-registro">{error}</p>}
        {success && <p className="exito-registro">{success}</p>}

        <button type="submit" className="boton-primario">Registrarse</button>
        <p className="texto-pequeno"><Link to="/dashboard">volve al inicio</Link></p>
      </form>
    </div>
  )
}

export default Register
