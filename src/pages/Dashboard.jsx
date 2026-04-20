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
    <div className="container-fluid py-3 py-md-4 py-lg-5 px-3 px-md-4 px-lg-5">
      <main className="row justify-content-center">
        <div className="col-12 col-xl-11 col-xxl-10">
          {/**
           * Si el usuario está autenticado, muestra las publicaciones.
           * 
           * Si el usuario no está autenticado, muestra un mensaje de bienvenida.
           */}
          {isAuthenticated ? (
            <>
              <div className="dashboard-acciones d-flex flex-column flex-sm-row justify-content-sm-start mb-4 gap-3 align-items-stretch align-items-sm-center">
                {userStatus === 0 && (
                  <Link to="/crear-post" className="dashboard-crear-link text-decoration-none">
                    <div className="d-grid d-sm-block">
                      <button className="dashboard-boton-crear shadow-sm w-100 justify-content-center justify-content-sm-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Crear publicación
                      </button>
                    </div>
                  </Link>
                )}
              </div>
              <div className="card glass dashboard-carta-bienvenida p-4 p-md-5 mb-4 mb-md-5 shadow-sm">
                <h2 className="dashboard-titulo-bienvenida mb-2 mb-md-3">Hola{username ? `, ${username}` : ''}</h2>
                <p className="dashboard-texto-bienvenida mb-0">
                  Nos alegra verte de nuevo. Aquí tienes las últimas novedades de la plataforma.
                </p>
              </div>
              <PostList limit={4} />
            </>
          ) : (
            <div className="card glass dashboard-carta-bienvenida centered p-4 p-md-5 mb-4 mb-md-5 shadow-sm text-center">
              <h2 className="dashboard-titulo-bienvenida mb-2 mb-md-3">Bienvenido a Plazart</h2>
              <p className="dashboard-texto-bienvenida mb-0">
                Únete a nuestra comunidad para compartir y descubrir contenido increíble.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard


