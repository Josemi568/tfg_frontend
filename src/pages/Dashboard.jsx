import React from 'react'
import { Link } from 'react-router-dom'
import { getToken, getItem } from '../utils/storage'
import PostList from '../components/PostList'

const Dashboard = () => {
  const isAuthenticated = !!getToken()
  const username = getItem('username')



  return (
    /**
     * Página principal.
     * 
     * Permite a los usuarios ver y gestionar las publicaciones.
     */
    <div className="container">
      <main>
        {/**
         * Si el usuario está autenticado, muestra las publicaciones.
         * 
         * Si el usuario no está autenticado, muestra un mensaje de bienvenida.
         */}
        {isAuthenticated ? (
          <>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'flex-start' }}>
              <Link to="/crear-post" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '16px 32px',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                  background: 'linear-gradient(135deg, var(--primary-color), #818cf8)'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Crear publicación
                </button>
              </Link>
            </div>
            <div className="card glass" style={{ marginBottom: '48px' }}>
              <h2 style={{ marginTop: 0 }}>Hola{username ? `, ${username}` : ''}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                Nos alegra verte de nuevo. Aquí tienes las últimas novedades de la plataforma.
              </p>
            </div>
            <PostList />
          </>
        ) : (
          <div className="card glass" style={{ marginBottom: '48px', textAlign: 'center' }}>
            <h2>Bienvenido a Plazart</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Únete a nuestra comunidad para compartir y descubrir contenido increíble.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
