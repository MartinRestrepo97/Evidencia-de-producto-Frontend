import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAmca } from '../context/AmcaContext';
import './HomePage.css';

/**
 * Página principal de la aplicación AMCA
 * Muestra información general del sistema y acceso a las funcionalidades
 */
const HomePage = () => {
  const { 
    agricultores, 
    fincas, 
    animales, 
    vegetales, 
    preparados,
    loading 
  } = useAmca();

  // Datos de ejemplo para el carrusel
  const carouselItems = [
    {
      id: 1,
      title: "Gestión de Agricultores",
      description: "Administra información completa de agricultores y sus datos personales",
      icon: "fas fa-user-tie",
      link: "/agricultores",
      color: "success"
    },
    {
      id: 2,
      title: "Control de Fincas",
      description: "Gestiona propiedades agrícolas y su ubicación geográfica",
      icon: "fas fa-map-marker-alt",
      link: "/fincas",
      color: "primary"
    },
    {
      id: 3,
      title: "Inventario Animal",
      description: "Mantén un control detallado de especies y razas ganaderas",
      icon: "fas fa-horse",
      link: "/animales",
      color: "warning"
    },
    {
      id: 4,
      title: "Cultivos Vegetales",
      description: "Administra cultivos y productos vegetales de la finca",
      icon: "fas fa-seedling",
      link: "/vegetales",
      color: "info"
    },
    {
      id: 5,
      title: "Productos Preparados",
      description: "Gestiona productos alimenticios procesados de origen agropecuario",
      icon: "fas fa-utensils",
      link: "/preparados",
      color: "danger"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section con carrusel */}
      <section className="hero-section">
        <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {carouselItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                data-bs-target="#mainCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          <div className="carousel-inner">
            {carouselItems.map((item, index) => (
              <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <div className="carousel-content">
                  <div className="container">
                    <div className="row align-items-center min-vh-75">
                      <div className="col-lg-6">
                        <div className="carousel-text">
                          <h1 className="display-4 fw-bold text-white mb-4">
                            {item.title}
                          </h1>
                          <p className="lead text-white mb-4">
                            {item.description}
                          </p>
                          <Link 
                            to={item.link} 
                            className={`btn btn-${item.color} btn-lg me-3`}
                          >
                            <i className={`${item.icon} me-2`}></i>
                            Gestionar
                          </Link>
                          <Link 
                            to="/busqueda" 
                            className="btn btn-outline-light btn-lg"
                          >
                            <i className="fas fa-search me-2"></i>
                            Buscar
                          </Link>
                        </div>
                      </div>
                      <div className="col-lg-6 text-center">
                        <div className={`carousel-icon bg-${item.color} bg-opacity-25`}>
                          <i className={`${item.icon} display-1 text-${item.color}`}></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </section>

      {/* Sección de estadísticas */}
      <section className="stats-section py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-12 mb-4">
              <h2 className="display-6 fw-bold text-success">
                <i className="fas fa-chart-bar me-2"></i>
                Estadísticas del Sistema
              </h2>
              <p className="lead text-muted">
                Resumen de la información gestionada en AMCA
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-2 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-icon bg-success bg-opacity-10 rounded-circle mx-auto mb-3">
                  <i className="fas fa-user-tie text-success display-6"></i>
                </div>
                <h3 className="fw-bold text-success">
                  {loading ? '...' : agricultores.length}
                </h3>
                <p className="text-muted mb-0">Agricultores</p>
              </div>
            </div>

            <div className="col-md-2 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-icon bg-primary bg-opacity-10 rounded-circle mx-auto mb-3">
                  <i className="fas fa-map-marker-alt text-primary display-6"></i>
                </div>
                <h3 className="fw-bold text-primary">
                  {loading ? '...' : fincas.length}
                </h3>
                <p className="text-muted mb-0">Fincas</p>
              </div>
            </div>

            <div className="col-md-2 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-icon bg-warning bg-opacity-10 rounded-circle mx-auto mb-3">
                  <i className="fas fa-cow text-warning display-6"></i>
                </div>
                <h3 className="fw-bold text-warning">
                  {loading ? '...' : animales.length}
                </h3>
                <p className="text-muted mb-0">Animales</p>
              </div>
            </div>

            <div className="col-md-2 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-icon bg-info bg-opacity-10 rounded-circle mx-auto mb-3">
                  <i className="fas fa-seedling text-info display-6"></i>
                </div>
                <h3 className="fw-bold text-info">
                  {loading ? '...' : vegetales.length}
                </h3>
                <p className="text-muted mb-0">Vegetales</p>
              </div>
            </div>

            <div className="col-md-2 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-icon bg-danger bg-opacity-10 rounded-circle mx-auto mb-3">
                  <i className="fas fa-utensils text-danger display-6"></i>
                </div>
                <h3 className="fw-bold text-danger">
                  {loading ? '...' : preparados.length}
                </h3>
                <p className="text-muted mb-0">Preparados</p>
              </div>
            </div>

            <div className="col-md-2 col-6">
              <div className="stat-card text-center p-3">
                <div className="stat-icon bg-secondary bg-opacity-10 rounded-circle mx-auto mb-3">
                  <i className="fas fa-database text-secondary display-6"></i>
                </div>
                <h3 className="fw-bold text-secondary">
                  {loading ? '...' : agricultores.length + fincas.length + animales.length + vegetales.length + preparados.length}
                </h3>
                <p className="text-muted mb-0">Total</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de características */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-6 fw-bold text-success">
                <i className="fas fa-star me-2"></i>
                Características Principales
              </h2>
              <p className="lead text-muted">
                Descubre las funcionalidades que hacen de AMCA una solución completa
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100 p-4 border rounded">
                <div className="feature-icon mb-3">
                  <i className="fas fa-search text-success display-4"></i>
                </div>
                <h4 className="fw-bold mb-3">Búsqueda Avanzada</h4>
                <p className="text-muted">
                  Sistema de búsqueda inteligente que permite encontrar información 
                  específica en todas las categorías del sistema.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100 p-4 border rounded">
                <div className="feature-icon mb-3">
                  <i className="fas fa-mobile-alt text-primary display-4"></i>
                </div>
                <h4 className="fw-bold mb-3">Diseño Responsivo</h4>
                <p className="text-muted">
                  Interfaz adaptativa que funciona perfectamente en dispositivos 
                  móviles, tablets y computadoras de escritorio.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100 p-4 border rounded">
                <div className="feature-icon mb-3">
                  <i className="fas fa-shield-alt text-warning display-4"></i>
                </div>
                <h4 className="fw-bold mb-3">Seguridad Garantizada</h4>
                <p className="text-muted">
                  Sistema de autenticación y autorización robusto para proteger 
                  la información sensible del negocio agropecuario.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100 p-4 border rounded">
                <div className="feature-icon mb-3">
                  <i className="fas fa-chart-line text-info display-4"></i>
                </div>
                <h4 className="fw-bold mb-3">Reportes y Estadísticas</h4>
                <p className="text-muted">
                  Generación de reportes detallados y estadísticas para 
                  la toma de decisiones informadas en el sector agrícola.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100 p-4 border rounded">
                <div className="feature-icon mb-3">
                  <i className="fas fa-sync-alt text-danger display-4"></i>
                </div>
                <h4 className="fw-bold mb-3">Sincronización en Tiempo Real</h4>
                <p className="text-muted">
                  Actualización automática de datos y sincronización 
                  entre diferentes módulos del sistema.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100 p-4 border rounded">
                <div className="feature-icon mb-3">
                  <i className="fas fa-users text-secondary display-4"></i>
                </div>
                <h4 className="fw-bold mb-3">Gestión de Usuarios</h4>
                <p className="text-muted">
                  Control de acceso y gestión de usuarios con diferentes 
                  niveles de permisos según el rol en la organización.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de llamada a la acción */}
      <section className="cta-section py-5 bg-success text-white">
        <div className="container text-center">
          <h2 className="display-6 fw-bold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="lead mb-4">
            Explora las funcionalidades de AMCA y comienza a gestionar 
            tu información agropecuaria de manera eficiente.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/agricultores" className="btn btn-light btn-lg">
              <i className="fas fa-user-tie me-2"></i>
              Gestionar Agricultores
            </Link>
            <Link to="/busqueda" className="btn btn-outline-light btn-lg">
              <i className="fas fa-search me-2"></i>
              Realizar Búsqueda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 