import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de pie de página de la aplicación AMCA
 * Incluye información del proyecto y enlaces útiles
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          {/* Información del proyecto */}
          <div className="col-md-4 mb-3">
            <h6 className="text-success fw-bold">
              <i className="fas fa-leaf me-2"></i>
              AMCA - Sistema de Gestión Agropecuaria
            </h6>
            <p className="small text-muted mb-0">
              Sistema web para la gestión integral de información agropecuaria, 
              desarrollado con React JS y Laravel.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-md-4 mb-3">
            <h6 className="text-success">Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  <i className="fas fa-home me-1"></i>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/agricultores" className="text-light text-decoration-none">
                  <i className="fas fa-user-tie me-1"></i>
                  Agricultores
                </Link>
              </li>
              <li>
                <Link to="/fincas" className="text-light text-decoration-none">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  Fincas
                </Link>
              </li>
              <li>
                <Link to="/busqueda" className="text-light text-decoration-none">
                  <i className="fas fa-search me-1"></i>
                  Búsqueda
                </Link>
              </li>
            </ul>
          </div>

          {/* Información técnica */}
          <div className="col-md-4 mb-3">
            <h6 className="text-success">Información Técnica</h6>
            <ul className="list-unstyled small">
              <li>
                <i className="fas fa-code me-1"></i>
                Frontend: React JS
              </li>
              <li>
                <i className="fas fa-server me-1"></i>
                Backend: Laravel 7.x
              </li>
              <li>
                <i className="fas fa-database me-1"></i>
                Base de Datos: MySQL
              </li>
              <li>
                <i className="fas fa-palette me-1"></i>
                UI: Bootstrap 5
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr className="my-3 border-secondary" />

        {/* Información de copyright y desarrollo */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="small mb-0 text-muted">
              © {currentYear} AMCA - Sistema de Gestión Agropecuaria. 
              Todos los derechos reservados.
            </p>
          </div>
          
          <div className="col-md-6 text-md-end">
            <p className="small mb-0 text-muted">
              <i className="fas fa-graduation-cap me-1"></i>
              Desarrollado para el SENA - Evidencia de Producto GA7-220501096-AA4-EV03
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="row mt-2">
          <div className="col-12 text-center">
            <p className="small text-muted mb-0">
              <i className="fas fa-info-circle me-1"></i>
              Componente Frontend del Proyecto Formativo - Desarrollo de frontend con React JS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 