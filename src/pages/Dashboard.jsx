import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getItem, setItem } from '../utils/storage'
import httpClient from '../services/httpClient'
import PostList from '../components/PostList'
import '../styles/DashboardStyle.css'

const Dashboard = () => {
  const isAuthenticated = !!getToken()
  const username = getItem('username')
  const [userStatus, setUserStatus] = useState(Number(getItem('status')) || 0)

  useEffect(() => {
    if (isAuthenticated && username) {
      httpClient.post('/search', { type: 'user', query: username })
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            const me = res.data.find(u => u.username === username)
            if (me && me.status !== undefined) {
              setUserStatus(me.status)
              setItem('status', me.status)
            }
          }
        })
        .catch(err => console.error('Failed to fetch user status', err))
    }
  }, [isAuthenticated, username])


  return (
    /**
     * Página principal.
     * 
     * Permite a los usuarios ver y gestionar las publicaciones.
     */
    <div className="dashboard-container">
      {isAuthenticated ? (
        <>
          {userStatus === 0 && (
            <Link to="/crear-post" className="text-decoration-none">
              <button className="boton-crear-publicacion">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Crear publicación
              </button>
            </Link>
          )}

          <div className="banner-bienvenida">
            <h1>Hola{username ? `, ${username}` : ''}</h1>
            <p>
              Nos alegra verte de nuevo. Aquí tienes las últimas novedades de la plataforma.
            </p>
          </div>

          <PostList limit={4} />
        </>
      ) : (
        <div className="banner-bienvenida">
          <h1>Bienvenido a Plazart</h1>
          <p>
            Únete a nuestra comunidad para compartir y descubrir contenido increíble.
          </p>
        </div>
      )}
    </div>
  )
}

export default Dashboard


