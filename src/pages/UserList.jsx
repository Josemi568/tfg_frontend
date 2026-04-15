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
    <div className="container-fluid py-3 py-md-4 py-lg-5 px-3 px-md-4 px-lg-5">
      <main className="row justify-content-center m-0 w-100">
        <div className="col-12 col-xl-11 col-xxl-10">
          <div className="lista-usuarios contenedor mx-auto">
            <h2 className="titulo-seccion">Listado de usuarios</h2>
            {successMsg && <div className="mensaje-exito">{successMsg}</div>}
            {users.length === 0 ? (
              <p>No hay usuarios.</p>
            ) : (
              <ul className="lista-usuarios-ul ps-0">
                {users.map((u, idx) => (
                  <li className="usuario-item d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 p-3 p-md-4" key={u.id || u.username || idx}>
                    <div className="usuario-info d-flex flex-column gap-1">
                      <strong className="usuario-nombre">{u.username || u.name || JSON.stringify(u)}</strong>
                      <div className="usuario-correo">{u.email || (u.emailAddress) || ''}</div>
                    </div>
                    <div className="usuario-acciones d-flex flex-wrap gap-2">
                      <button
                        className="boton boton-rol text-nowrap"
                        onClick={() => handleChangeRole(u.id || u._id, u.username || u.name)}
                        aria-label={`Cambiar rol ${u.username || u.name}`}
                      >
                        Cambiar rol
                      </button>
                      <button
                        className="boton boton-banear text-nowrap"
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
        </div>
      </main>
    </div>
  )
}

export default UserList
