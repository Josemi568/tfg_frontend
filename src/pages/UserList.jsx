import React, { useEffect, useState } from 'react'
import httpClient from '../services/httpClient'
import { changeRole, changeStatus } from '../services/auth'

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
        // Expecting an array in resp.data
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

      // Try to determine the new status from different possible response shapes
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
    <div className="user-list container">
      <h2>Listado de usuarios</h2>
      {successMsg && <div className="success-message">{successMsg}</div>}
      {users.length === 0 ? (
        <p>No hay usuarios.</p>
      ) : (
        <ul>
          {users.map((u, idx) => (
            <li className="user-item" key={u.id || u.username || idx}>
              <div>
                <strong>{u.username || u.name || JSON.stringify(u)}</strong>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{u.email || (u.emailAddress) || ''}</div>
              </div>
              <div className="user-actions">
                <button className="btn btn-secondary" onClick={() => handleChangeRole(u.id || u._id, u.username || u.name)} aria-label={`Cambiar rol ${u.username || u.name}`}>
                  Cambiar rol
                </button>
                <button className="btn btn-danger" onClick={() => handleChangeStatus(u.id || u._id, u.username || u.name)} aria-label={`Cambiar estado ${u.username || u.name}`}>
                  Banear
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
