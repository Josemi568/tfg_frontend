import React, { useEffect, useState } from 'react'
import httpClient from '../services/httpClient'
import { Link } from 'react-router-dom'
import { changeRole, changeStatus } from '../services/auth'
import '../styles/UserListStyle.css'

/**
 * Página que muestra la lista de usuarios (solo para administradores).
 * 
 * Permite a los administradores ver y gestionar los usuarios del sistema.
 */
const UserList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const resp = await httpClient.get('/users')
        setUsers(Array.isArray(resp.data) ? resp.data : [])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleChangeRole = async (id, username) => {
    try {
      await changeRole(id)
      const resp = await httpClient.get('/users')
      setUsers(Array.isArray(resp.data) ? resp.data : [])
      setSuccessMsg(`se ha cambiado el rol de usuario, ${username} correctamente`)
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      console.error('Failed to change role', err)
    }
  }

  const handleChangeStatus = async (id, username) => {
    try {
      const result = await changeStatus(id)
      const resp = await httpClient.get('/users')
      setUsers(Array.isArray(resp.data) ? resp.data : [])

      // intenta obtener el nuevo estado de diferentes formas
      let newStatus = null
      if (result !== undefined && result !== null) {
        if (typeof result === 'number' || typeof result === 'string') {
          newStatus = Number(result)
        } else if (typeof result === 'object') {
          if (result.status !== undefined) newStatus = Number(result.status)
          else if (result.newStatus !== undefined) newStatus = Number(result.newStatus)
          else if (result.user && result.user.status !== undefined) newStatus = Number(result.user.status)
          else if (result.data && result.data.status !== undefined) newStatus = Number(result.data.status)
        }
      }

      if (newStatus === 1) {
        setSuccessMsg(`se ha Baneado usuario, ${username} correctamente`)
      } else if (newStatus === 0) {
        setSuccessMsg(`se ha Desbaneado al usuario, ${username} correctamente`)
      } else {
        setSuccessMsg(`se ha cambiado el estado del usuario, ${username} correctamente`)
      }

      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      console.error('Failed to change status', err)
    }
  }

  if (loading) return <div>Cargando usuarios...</div>
  if (error) return <div>Error cargando usuarios.</div>

  return (
    <div className="lista-usuarios contenedor">
      <h2 className="titulo-seccion">Listado de usuarios</h2>
      <div className="volver-inicio">
        <Link to="/dashboard">vuelve al inicio</Link>
      </div>
      {successMsg && <div className="mensaje-exito">{successMsg}</div>}
      {users.length === 0 ? (
        <p>No hay usuarios.</p>
      ) : (
        <ul className="lista-usuarios-ul">
          {users.map((u, idx) => (
            <li className="usuario-item" key={u.id || u.username || idx}>
              <div className="usuario-info">
                <strong className="usuario-nombre">{u.username || u.name || JSON.stringify(u)}</strong>
                <div className="usuario-correo">{u.email || (u.emailAddress) || ''}</div>
              </div>
              <div className="usuario-acciones">
                <button
                  className="boton boton-rol"
                  onClick={() => handleChangeRole(u.id || u._id, u.username || u.name)}
                  aria-label={`Cambiar rol ${u.username || u.name}`}
                >
                  Cambiar rol
                </button>
                <button
                  className="boton boton-banear"
                  onClick={() => handleChangeStatus(u.id || u._id, u.username || u.name)}
                  aria-label={`${u.status === 1 ? 'Desbanear' : 'Banear'} ${u.username || u.name}`}
                >
                  {u.status === 1 ? 'Desbanear' : 'Banear'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserList
