import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAmca } from '../context/AmcaContext';


/**
 * Página de resultados de búsqueda
 * Muestra los resultados filtrados por categorías
 */
const BusquedaPage = () => {
  const { searchResults, searchTerm, searchCategory, performSearch, clearSearch } = useAmca();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSearchCategory, setLocalSearchCategory] = useState(searchCategory);

  /**
   * Maneja la búsqueda local
   */
  const handleSearch = () => {
    if (localSearchTerm.trim()) {
      performSearch(localSearchTerm, localSearchCategory);
    }
  };

  /**
   * Maneja la limpieza de búsqueda
   */
  const handleClearSearch = () => {
    setLocalSearchTerm('');
    setLocalSearchCategory('todos');
    clearSearch();
  };

  /**
   * Obtiene el icono según el tipo de resultado
   */
  const getIconByType = (type) => {
    const icons = {
      agricultor: 'fas fa-user-tie',
      finca: 'fas fa-map-marker-alt',
      animal: 'fas fa-horse',
      vegetal: 'fas fa-seedling',
      preparado: 'fas fa-utensils'
    };
    return icons[type] || 'fas fa-question';
  };

  /**
   * Obtiene el color según el tipo de resultado
   */
  const getColorByType = (type) => {
    const colors = {
      agricultor: 'success',
      finca: 'primary',
      animal: 'warning',
      vegetal: 'info',
      preparado: 'danger'
    };
    return colors[type] || 'secondary';
  };

  /**
   * Obtiene el título según el tipo de resultado
   */
  const getTitleByType = (item, type) => {
    switch (type) {
      case 'agricultor':
        return `${item.nombres} ${item.apellidos}`;
      case 'finca':
        return item.nombre;
      case 'animal':
        return `${item.especie} - ${item.raza}`;
      case 'vegetal':
        return item.especie;
      case 'preparado':
        return item.nombre;
      default:
        return 'Sin título';
    }
  };

  /**
   * Obtiene la descripción según el tipo de resultado
   */
  const getDescriptionByType = (item, type) => {
    switch (type) {
      case 'agricultor':
        return `Documento: ${item.documento} | Teléfono: ${item.telefono}`;
      case 'finca':
        return `Ubicación: ${item.ubicacion}`;
      case 'animal':
        return `Especie: ${item.especie} | Raza: ${item.raza}`;
      case 'vegetal':
        return `Observaciones: ${item.observaciones || 'Sin observaciones'}`;
      case 'preparado':
        return `Descripción: ${item.descripcion || 'Sin descripción'}`;
      default:
        return 'Sin descripción';
    }
  };

  return (
    <div className="busqueda-page">
      <div className="container py-4">
        {/* Header de la página */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-6 fw-bold text-success">
              <i className="fas fa-search me-2"></i>
              Resultados de Búsqueda
            </h1>
            <p className="lead text-muted">
              Encuentra información específica en todas las categorías del sistema
            </p>
          </div>
        </div>

        {/* Formulario de búsqueda */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={localSearchCategory}
                      onChange={(e) => setLocalSearchCategory(e.target.value)}
                    >
                      <option value="todos">Buscar en Todos</option>
                      <option value="agricultores">Solo Agricultores</option>
                      <option value="fincas">Solo Fincas</option>
                      <option value="animales">Solo Animales</option>
                      <option value="vegetales">Solo Vegetales</option>
                      <option value="preparados">Solo Preparados</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingrese su término de búsqueda..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="col-md-2">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        onClick={handleSearch}
                      >
                        <i className="fas fa-search me-1"></i>
                        Buscar
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleClearSearch}
                        title="Limpiar búsqueda"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de búsqueda */}
        {searchTerm && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Búsqueda:</strong> "{searchTerm}" 
                {searchCategory !== 'todos' && (
                  <span> en categoría: <strong>{searchCategory}</strong></span>
                )}
                <span className="ms-3">
                  <strong>{searchResults.length}</strong> resultados encontrados
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Resultados de búsqueda */}
        <div className="row">
          <div className="col-12">
            {searchResults.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-search text-muted display-1"></i>
                <h3 className="mt-3 text-muted">No se encontraron resultados</h3>
                <p className="text-muted">
                  {searchTerm 
                    ? `No se encontraron resultados para "${searchTerm}"`
                    : 'Realiza una búsqueda para ver resultados'
                  }
                </p>
                {searchTerm && (
                  <button
                    className="btn btn-outline-success"
                    onClick={handleClearSearch}
                  >
                    <i className="fas fa-times me-2"></i>
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            ) : (
              <div className="row g-4">
                {searchResults.map((item, index) => (
                  <div key={`${item.tipo}-${item.id}-${index}`} className="col-lg-4 col-md-6">
                    <div className={`card h-100 border-${getColorByType(item.tipo)}`}>
                      <div className="card-header bg-light">
                        <div className="d-flex align-items-center">
                          <i className={`${getIconByType(item.tipo)} text-${getColorByType(item.tipo)} me-2`}></i>
                          <span className="badge bg-secondary text-uppercase">
                            {item.tipo}
                          </span>
                          <span className="badge bg-secondary ms-2">
                            #{item.id}
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title fw-bold">
                          {getTitleByType(item, item.tipo)}
                        </h5>
                        <p className="card-text text-muted">
                          {getDescriptionByType(item, item.tipo)}
                        </p>
                      </div>
                      <div className="card-footer bg-light">
                        <Link
                          to={`/detalles/${item.tipo}/${item.id}`}
                          className={`btn btn-sm btn-outline-${getColorByType(item.tipo)}`}
                        >
                          <i className="fas fa-eye me-1"></i>
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas de búsqueda */}
        {searchResults.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="fas fa-chart-pie me-2"></i>
                    Estadísticas de Resultados
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    {['agricultor', 'finca', 'animal', 'vegetal', 'preparado'].map(type => {
                      const count = searchResults.filter(item => item.tipo === type).length;
                      if (count === 0) return null;
                      
                      return (
                        <div key={type} className="col">
                          <div className={`text-${getColorByType(type)}`}>
                            <i className={`${getIconByType(type)} display-6`}></i>
                            <h4 className="fw-bold">{count}</h4>
                            <p className="text-capitalize mb-0">{type}s</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusquedaPage; 