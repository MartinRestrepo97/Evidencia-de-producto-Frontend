import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAmca } from '../context/AmcaContext';
import './Navbar.css';

/**
 * Componente de navegación principal de la aplicación AMCA
 * Incluye menú responsivo y funcionalidad de búsqueda
 */
const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('todos');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  
  const { performSearch, clearSearch } = useAmca();
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de búsqueda
   * @param {Event} e - Evento del formulario
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSearch(searchTerm, searchCategory);
      navigate('/busqueda');
    }
  };

  /**
   * Maneja la limpieza de la búsqueda
   */
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchCategory('todos');
    clearSearch();
  };

  /**
   * Maneja el colapso del menú móvil
   */
  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        {/* Logo y nombre de la aplicación */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="fas fa-seedling me-2"></i>
          <span className="fw-bold">AMCA</span>
          <small className="ms-2 text-light">Sistema Agropecuario</small>
        </Link>

        {/* Botón hamburguesa para móvil */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Elementos del menú */}
        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Enlaces de navegación */}
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsNavCollapsed(true)}>
                <i className="fas fa-home me-1"></i>
                Inicio
              </Link>
            </li>
            
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle" 
                type="button"
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="fas fa-users me-1"></i>
                Gestión
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/agricultores" onClick={() => setIsNavCollapsed(true)}>
                    <i className="fas fa-user-tie me-2"></i>
                    Agricultores
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/fincas" onClick={() => setIsNavCollapsed(true)}>
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Fincas
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/animales" onClick={() => setIsNavCollapsed(true)}>
                    <i className="fas fa-horse me-2"></i>
                    Animales
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/vegetales" onClick={() => setIsNavCollapsed(true)}>
                    <i className="fas fa-seedling me-2"></i>
                    Vegetales
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/preparados" onClick={() => setIsNavCollapsed(true)}>
                    <i className="fas fa-utensils me-2"></i>
                    Preparados
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Formulario de búsqueda */}
          <form className="d-flex" onSubmit={handleSearchSubmit}>
            <div className="input-group">
              {/* Selector de categoría */}
              <select
                className="form-select"
                style={{ maxWidth: '120px' }}
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="agricultores">Agricultores</option>
                <option value="fincas">Fincas</option>
                <option value="animales">Animales</option>
                <option value="vegetales">Vegetales</option>
                <option value="preparados">Preparados</option>
              </select>
              
              {/* Campo de búsqueda */}
              <input
                className="form-control"
                type="search"
                placeholder="Buscar..."
                aria-label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: '200px' }}
              />
              
              {/* Botones de búsqueda */}
              <button className="btn btn-outline-light" type="submit">
                <i className="fas fa-search"></i>
              </button>
              
              {searchTerm && (
                <button 
                  className="btn btn-outline-light" 
                  type="button"
                  onClick={handleClearSearch}
                  title="Limpiar búsqueda"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 