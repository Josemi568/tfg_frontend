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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, números y símbolos.')
      return
    }

    try {
      await registerUser({ username, password })
      setSuccess('Registro correcto. Redirigiendo...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError('Registro fallido. Inténtalo de nuevo.')
    }
  }

  return (
    <div className="container-fluid py-3 py-md-4 py-lg-5 px-3 px-md-4 px-lg-5 envoltorio-registro d-flex align-items-center justify-content-center">
      <main className="row justify-content-center w-100">
        <div className="col-12 d-flex justify-content-center">
          <form className="formulario-registro w-100" onSubmit={handleRegister}>
            <h2 className="cabecera-registro text-center mb-4">Registro</h2>

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
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-100"
              />
            </div>

            {error && <p className="error-registro mt-2">{error}</p>}
            {success && <p className="exito-registro mt-2">{success}</p>}

            <button type="submit" className="boton-primario w-100 d-block mt-3">Registrarse</button>
            <p className="texto-pequeno text-center mt-3"><Link to="/dashboard">Volver al inicio</Link></p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Register
