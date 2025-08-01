import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAmca } from '../context/AmcaContext';
import { agricultoresService } from '../services/api';

/**
 * Página de gestión de agricultores
 * Permite crear, leer, actualizar y eliminar registros de agricultores
 */
const AgricultoresPage = () => {
  const { agricultores, loading, showNotification } = useAmca();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgricultor, setEditingAgricultor] = useState(null);
  const [filterTerm, setFilterTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombres');

  // Configuración de React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  /**
   * Maneja el envío del formulario (crear/actualizar)
   * @param {Object} data - Datos del formulario
   */
  const onSubmit = async (data) => {
    try {
      if (editingAgricultor) {
        // Actualizar agricultor existente
        await agricultoresService.update(editingAgricultor.id, data);
        showNotification('Agricultor actualizado exitosamente', 'success');
      } else {
        // Crear nuevo agricultor
        await agricultoresService.create(data);
        showNotification('Agricultor creado exitosamente', 'success');
      }
      
      // Cerrar modal y limpiar formulario
      handleCloseModal();
      
      // Recargar datos
      window.location.reload();
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  /**
   * Abre el modal para crear un nuevo agricultor
   */
  const handleCreateAgricultor = () => {
    setEditingAgricultor(null);
    reset();
    setIsModalOpen(true);
  };

  /**
   * Abre el modal para editar un agricultor existente
   * @param {Object} agricultor - Datos del agricultor a editar
   */
  const handleEditAgricultor = (agricultor) => {
    setEditingAgricultor(agricultor);
    setValue('nombres', agricultor.nombres);
    setValue('apellidos', agricultor.apellidos);
    setValue('telefono', agricultor.telefono);
    setValue('documento', agricultor.documento);
    setIsModalOpen(true);
  };

  /**
   * Elimina un agricultor
   * @param {number} id - ID del agricultor a eliminar
   */
  const handleDeleteAgricultor = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este agricultor?')) {
      try {
        await agricultoresService.delete(id);
        showNotification('Agricultor eliminado exitosamente', 'success');
        window.location.reload();
      } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
      }
    }
  };

  /**
   * Cierra el modal y limpia el formulario
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAgricultor(null);
    reset();
  };

  /**
   * Filtra y ordena los agricultores según los criterios seleccionados
   */
  const filteredAndSortedAgricultores = agricultores
    .filter(agricultor => 
      agricultor.nombres?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      agricultor.apellidos?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      agricultor.documento?.toLowerCase().includes(filterTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      return aValue.localeCompare(bValue);
    });

  return (
    <div className="agricultores-page">
      <div className="container py-4">
        {/* Header de la página */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold text-success">
                  <i className="fas fa-user-tie me-2"></i>
                  Gestión de Agricultores
                </h1>
                <p className="lead text-muted">
                  Administra la información de los agricultores registrados en el sistema
                </p>
              </div>
              <button
                className="btn btn-success btn-lg"
                onClick={handleCreateAgricultor}
              >
                <i className="fas fa-plus me-2"></i>
                Nuevo Agricultor
              </button>
            </div>
          </div>
        </div>

        {/* Filtros y controles */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar agricultores..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nombres">Ordenar por Nombres</option>
              <option value="apellidos">Ordenar por Apellidos</option>
              <option value="documento">Ordenar por Documento</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="d-flex justify-content-end">
              <span className="badge bg-success fs-6">
                {filteredAndSortedAgricultores.length} agricultores
              </span>
            </div>
          </div>
        </div>

        {/* Tabla de agricultores */}
        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando agricultores...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-success">
                    <tr>
                      <th>ID</th>
                      <th>Nombres</th>
                      <th>Apellidos</th>
                      <th>Teléfono</th>
                      <th>Documento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedAgricultores.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <i className="fas fa-inbox text-muted display-4"></i>
                          <p className="mt-2 text-muted">No se encontraron agricultores</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedAgricultores.map((agricultor) => (
                        <tr key={agricultor.id}>
                          <td>
                            <span className="badge bg-secondary">#{agricultor.id}</span>
                          </td>
                          <td>
                            <strong>{agricultor.nombres}</strong>
                          </td>
                          <td>{agricultor.apellidos}</td>
                          <td>
                            <i className="fas fa-phone me-1 text-muted"></i>
                            {agricultor.telefono}
                          </td>
                          <td>
                            <code>{agricultor.documento}</code>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditAgricultor(agricultor)}
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteAgricultor(agricultor.id)}
                                title="Eliminar"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para crear/editar agricultor */}
      {isModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-user-tie me-2"></i>
                  {editingAgricultor ? 'Editar Agricultor' : 'Nuevo Agricultor'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nombres" className="form-label">
                        <i className="fas fa-user me-1"></i>
                        Nombres *
                      </label>
                      <input
                        id="nombres"
                        type="text"
                        className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
                        placeholder="Ingrese los nombres"
                        {...register('nombres', { 
                          required: 'Los nombres son obligatorios',
                          minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                        })}
                      />
                      {errors.nombres && (
                        <div className="invalid-feedback">{errors.nombres.message}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="apellidos" className="form-label">
                        <i className="fas fa-user me-1"></i>
                        Apellidos *
                      </label>
                      <input
                        id="apellidos"
                        type="text"
                        className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                        placeholder="Ingrese los apellidos"
                        {...register('apellidos', { 
                          required: 'Los apellidos son obligatorios',
                          minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                        })}
                      />
                      {errors.apellidos && (
                        <div className="invalid-feedback">{errors.apellidos.message}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="telefono" className="form-label">
                        <i className="fas fa-phone me-1"></i>
                        Teléfono
                      </label>
                      <input
                        id="telefono"
                        type="tel"
                        className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                        placeholder="Ingrese el teléfono"
                        {...register('telefono', {
                          pattern: {
                            value: /^[0-9+\-\s()]+$/,
                            message: 'Formato de teléfono inválido'
                          }
                        })}
                      />
                      {errors.telefono && (
                        <div className="invalid-feedback">{errors.telefono.message}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="documento" className="form-label">
                        <i className="fas fa-id-card me-1"></i>
                        Documento *
                      </label>
                      <input
                        id="documento"
                        type="text"
                        className={`form-control ${errors.documento ? 'is-invalid' : ''}`}
                        placeholder="Ingrese el número de documento"
                        {...register('documento', { 
                          required: 'El documento es obligatorio',
                          minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                        })}
                      />
                      {errors.documento && (
                        <div className="invalid-feedback">{errors.documento.message}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        {editingAgricultor ? 'Actualizar' : 'Guardar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgricultoresPage; 