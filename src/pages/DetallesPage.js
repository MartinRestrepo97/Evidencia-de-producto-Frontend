import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAmca } from '../context/AmcaContext';
import { agricultoresService, fincasService, animalesService, vegetalesService, preparadosService } from '../services/api';


/**
 * Página de detalles que muestra información específica de cada elemento
 */
const DetallesPage = () => {
  const { tipo, id } = useParams();
  const { showNotification } = useAmca();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItemDetails();
  }, [tipo, id]);

  /**
   * Carga los detalles del elemento según el tipo
   */
  const loadItemDetails = async () => {
    try {
      setLoading(true);
      let data;

      switch (tipo) {
        case 'agricultor':
          data = await agricultoresService.getById(id);
          break;
        case 'finca':
          data = await fincasService.getById(id);
          break;
        case 'animal':
          data = await animalesService.getById(id);
          break;
        case 'vegetal':
          data = await vegetalesService.getById(id);
          break;
        case 'preparado':
          data = await preparadosService.getById(id);
          break;
        default:
          throw new Error('Tipo de elemento no válido');
      }

      setItem(data);
    } catch (error) {
      showNotification(`Error al cargar detalles: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene el icono según el tipo de elemento
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
   * Obtiene el color según el tipo de elemento
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
   * Obtiene el título según el tipo de elemento
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
   * Renderiza los detalles específicos según el tipo
   */
  const renderDetails = () => {
    if (!item) return null;

    switch (tipo) {
      case 'agricultor':
        return (
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-success">
                <i className="fas fa-user me-2"></i>
                Información Personal
              </h5>
              <ul className="list-unstyled">
                <li><strong>Nombres:</strong> {item.nombres}</li>
                <li><strong>Apellidos:</strong> {item.apellidos}</li>
                <li><strong>Documento:</strong> <code>{item.documento}</code></li>
                <li><strong>Teléfono:</strong> {item.telefono}</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5 className="text-success">
                <i className="fas fa-calendar me-2"></i>
                Información del Sistema
              </h5>
              <ul className="list-unstyled">
                <li><strong>ID:</strong> #{item.id}</li>
                <li><strong>Creado:</strong> {new Date(item.created_at).toLocaleDateString()}</li>
                <li><strong>Actualizado:</strong> {new Date(item.updated_at).toLocaleDateString()}</li>
              </ul>
            </div>
          </div>
        );

      case 'finca':
        return (
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-primary">
                <i className="fas fa-map-marker-alt me-2"></i>
                Información de la Finca
              </h5>
              <ul className="list-unstyled">
                <li><strong>Nombre:</strong> {item.nombre}</li>
                <li><strong>Ubicación:</strong> {item.ubicacion}</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5 className="text-primary">
                <i className="fas fa-calendar me-2"></i>
                Información del Sistema
              </h5>
              <ul className="list-unstyled">
                <li><strong>ID:</strong> #{item.id}</li>
                <li><strong>Creado:</strong> {new Date(item.created_at).toLocaleDateString()}</li>
                <li><strong>Actualizado:</strong> {new Date(item.updated_at).toLocaleDateString()}</li>
              </ul>
            </div>
          </div>
        );

      case 'animal':
        return (
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-warning">
                <i className="fas fa-cow me-2"></i>
                Información del Animal
              </h5>
              <ul className="list-unstyled">
                <li><strong>Especie:</strong> {item.especie}</li>
                <li><strong>Raza:</strong> {item.raza}</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5 className="text-warning">
                <i className="fas fa-calendar me-2"></i>
                Información del Sistema
              </h5>
              <ul className="list-unstyled">
                <li><strong>ID:</strong> #{item.id}</li>
                <li><strong>Creado:</strong> {new Date(item.created_at).toLocaleDateString()}</li>
                <li><strong>Actualizado:</strong> {new Date(item.updated_at).toLocaleDateString()}</li>
              </ul>
            </div>
          </div>
        );

      case 'vegetal':
        return (
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-info">
                <i className="fas fa-seedling me-2"></i>
                Información del Vegetal
              </h5>
              <ul className="list-unstyled">
                <li><strong>Especie:</strong> {item.especie}</li>
                <li><strong>Observaciones:</strong> {item.observaciones || 'Sin observaciones'}</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5 className="text-info">
                <i className="fas fa-calendar me-2"></i>
                Información del Sistema
              </h5>
              <ul className="list-unstyled">
                <li><strong>ID:</strong> #{item.id}</li>
                <li><strong>Creado:</strong> {new Date(item.created_at).toLocaleDateString()}</li>
                <li><strong>Actualizado:</strong> {new Date(item.updated_at).toLocaleDateString()}</li>
              </ul>
            </div>
          </div>
        );

      case 'preparado':
        return (
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-danger">
                <i className="fas fa-utensils me-2"></i>
                Información del Preparado
              </h5>
              <ul className="list-unstyled">
                <li><strong>Nombre:</strong> {item.nombre}</li>
                <li><strong>Descripción:</strong> {item.descripcion || 'Sin descripción'}</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5 className="text-danger">
                <i className="fas fa-calendar me-2"></i>
                Información del Sistema
              </h5>
              <ul className="list-unstyled">
                <li><strong>ID:</strong> #{item.id}</li>
                <li><strong>Creado:</strong> {new Date(item.created_at).toLocaleDateString()}</li>
                <li><strong>Actualizado:</strong> {new Date(item.updated_at).toLocaleDateString()}</li>
              </ul>
            </div>
          </div>
        );

      default:
        return <p>Información no disponible</p>;
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className={`spinner-border text-${getColorByType(tipo)}`} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-warning display-1"></i>
          <h3 className="mt-3 text-muted">Elemento no encontrado</h3>
          <p className="text-muted">
            No se pudo encontrar el {tipo} con ID {id}
          </p>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home me-2"></i>
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detalles-page">
      <div className="container py-4">
        {/* Header de la página */}
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/" className="text-decoration-none">
                    <i className="fas fa-home me-1"></i>
                    Inicio
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={`/${tipo}s`} className="text-decoration-none">
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}s
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Detalles
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Información principal */}
        <div className="row">
          <div className="col-12">
            <div className={`card border-${getColorByType(tipo)}`}>
              <div className={`card-header bg-${getColorByType(tipo)} text-white`}>
                <div className="d-flex align-items-center">
                  <i className={`${getIconByType(tipo)} me-3 display-6`}></i>
                  <div>
                    <h2 className="mb-0">{getTitleByType(item, tipo)}</h2>
                    <p className="mb-0">
                      <span className="badge bg-light text-dark me-2">
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </span>
                      <span className="badge bg-light text-dark">
                        ID: #{item.id}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {renderDetails()}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="d-flex gap-2">
              <Link 
                to={`/${tipo}s`} 
                className={`btn btn-outline-${getColorByType(tipo)}`}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Volver a {tipo.charAt(0).toUpperCase() + tipo.slice(1)}s
              </Link>
              <Link 
                to="/busqueda" 
                className="btn btn-outline-secondary"
              >
                <i className="fas fa-search me-2"></i>
                Nueva Búsqueda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesPage; 