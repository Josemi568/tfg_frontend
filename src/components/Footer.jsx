import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import '../styles/FooterStyle.css';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <footer className="footer mt-5 p-4">
      <Container fluid className="footer-container">
        <Row className="align-items-center w-100">
          {/* Lado izquierdo: Información */}
          <Col md={4} sm={12} className="footer-info text-md-start text-center mb-3 mb-md-0">
            <p className="mb-1">Aviso legal</p>
            <p className="mb-1"><a href="#" rel="noopener noreferrer" className="link-light link-underline-opacity-0 link-underline-opacity-100-hover">Politica de privacidad</a></p>
            <p className="mb-1"><a href="#" rel="noopener noreferrer" className="link-light link-underline-opacity-0 link-underline-opacity-100-hover">Politica de cookies</a></p>
          </Col>

          {/* Centro: Copyright */}
          <Col md={4} sm={12} className="footer-copyright text-center mb-3 mb-md-0">
            <p className="mb-0">Copyright © 2026 Plazart. Todos los derechos reservados.</p>
          </Col>

          {/* Lado derecho: Imágenes */}
          <Col md={4} sm={12} className="footer-icons d-flex justify-content-md-end justify-content-center gap-3">
            <a href="#" rel="noopener noreferrer">
              <Image src="/Images/telefono.png" alt="Telefono" />
            </a>
            <a href="#" rel="noopener noreferrer">
              <Image src="/Images/correo.png" alt="Correo" />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
