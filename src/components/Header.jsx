import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, removeToken, removeItem, isAdminUser } from '../utils/storage';
import { Navbar, Container, Form, Button, Nav } from 'react-bootstrap';
import '../styles/HeaderStyle.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!getToken();
  const isAdmin = isAdminUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('user');

  const getUserIdFromToken = () => {
    try {
      const token = getToken();
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.id || payload.userId || payload.user_id || payload.sub;
    } catch (e) {
      return null;
    }
  };

  const userId = getUserIdFromToken();

  const handleLogout = () => {
    removeToken();
    removeItem('username');
    window.location.href = '/';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?type=${searchType}&query=${encodeURIComponent(searchQuery.trim())}`);
  };

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <Navbar expand="lg" className="header mb-4 py-2">
      <Container fluid className="d-flex align-items-center justify-content-between px-3">
        <Navbar.Brand as={Link} to="/" className="logo m-0 flex-shrink-0 fs-1 fw-bolder">
          Plazart
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between w-100">
          {/* Contenedor de Buscador */}
          <div className="buscador-container mx-auto mx-lg-4 px-2 px-lg-0 my-4 my-lg-0 w-100">
            <Form onSubmit={handleSearch} className="formulario-busqueda d-flex flex-wrap flex-lg-nowrap w-100 gap-2">
              <Form.Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="buscador-select w-auto"
              >
                <option value="user">Usuarios</option>
                <option value="post">Publicaciones</option>
              </Form.Select>
              <Form.Control
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="buscador-escrito flex-grow-1"
              />
              <Button type="submit" className="buscador-boton shadow-sm border-0">
                Buscar
              </Button>
            </Form>
          </div>

          <Nav className="botones-header d-flex flex-row flex-wrap justify-content-center align-items-center gap-2 mt-2 mt-lg-0">
            <Link to={isAuthenticated ? "/contact" : "/login"}>
              <Button variant="light" className="boton-contacto shadow-sm">
                Contacto
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/users">
                    <Button variant="light" className="boton-gestionar-usuarios shadow-sm">Gestionar usuarios</Button>
                  </Link>
                )}
                {userId && (
                  <Link to={`/profile/${userId}`}>
                    <Button variant="light" className="boton-perfil shadow-sm">
                      Ver Perfil
                    </Button>
                  </Link>
                )}
                <Button variant="light" onClick={handleLogout} className="boton-salir shadow-sm">
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="light" className="boton-iniciar-sesion shadow-sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="boton-registrarse text-white shadow-sm border-0">Registrarse</Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
