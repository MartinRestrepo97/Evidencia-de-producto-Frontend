import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAmca } from '../context/AmcaContext';
import { preparadosService } from '../services/api';


/**
 * Página de gestión de preparados
 */
const PreparadosPage = () => {
  const { preparados, loading, showNotification } = useAmca();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreparado, setEditingPreparado] = useState(null);
  const [filterTerm, setFilterTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (editingPreparado) {
        await preparadosService.update(editingPreparado.id, data);
        showNotification('Preparado actualizado exitosamente', 'success');
      } else {
        await preparadosService.create(data);
        showNotification('Preparado creado exitosamente', 'success');
      }
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  const handleCreatePreparado = () => {
    setEditingPreparado(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEditPreparado = (preparado) => {
    setEditingPreparado(preparado);
    setValue('nombre', preparado.nombre);
    setValue('descripcion', preparado.descripcion);
    setIsModalOpen(true);
  };

  const handleDeletePreparado = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este preparado?')) {
      try {
        await preparadosService.delete(id);
        showNotification('Preparado eliminado exitosamente', 'success');
        window.location.reload();
      } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPreparado(null);
    reset();
  };

  const filteredAndSortedPreparados = preparados
    .filter(preparado => 
      preparado.nombre?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      preparado.descripcion?.toLowerCase().includes(filterTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      return aValue.localeCompare(bValue);
    });

  return (
    <div className="preparados-page">
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold text-danger">
                  <i className="fas fa-utensils me-2"></i>
                  Gestión de Preparados
                </h1>
                <p className="lead text-muted">
                  Administra los productos alimenticios procesados
                </p>
              </div>
              <button
                className="btn btn-danger btn-lg"
                onClick={handleCreatePreparado}
              >
                <i className="fas fa-plus me-2"></i>
                Nuevo Preparado
              </button>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar preparados..."
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
              <option value="nombre">Ordenar por Nombre</option>
              <option value="descripcion">Ordenar por Descripción</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="d-flex justify-content-end">
              <span className="badge bg-danger fs-6">
                {filteredAndSortedPreparados.length} preparados
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando preparados...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-danger">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedPreparados.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <i className="fas fa-inbox text-muted display-4"></i>
                          <p className="mt-2 text-muted">No se encontraron preparados</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedPreparados.map((preparado) => (
                        <tr key={preparado.id}>
                          <td>
                            <span className="badge bg-secondary">#{preparado.id}</span>
                          </td>
                          <td>
                            <strong>{preparado.nombre}</strong>
                          </td>
                          <td>{preparado.descripcion || 'Sin descripción'}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEditPreparado(preparado)}
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeletePreparado(preparado.id)}
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

      {/* Modal para crear/editar preparado */}
      {isModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="fas fa-utensils me-2"></i>
                  {editingPreparado ? 'Editar Preparado' : 'Nuevo Preparado'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                      <i className="fas fa-utensils me-1"></i>
                      Nombre del Preparado *
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                      placeholder="Ingrese el nombre del preparado"
                      {...register('nombre', { 
                        required: 'El nombre es obligatorio',
                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                      })}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">{errors.nombre.message}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">
                      <i className="fas fa-align-left me-1"></i>
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                      placeholder="Ingrese la descripción del preparado"
                      rows="3"
                      {...register('descripcion')}
                    />
                    {errors.descripcion && (
                      <div className="invalid-feedback">{errors.descripcion.message}</div>
                    )}
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
                    className="btn btn-danger"
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
                        {editingPreparado ? 'Actualizar' : 'Guardar'}
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

export default PreparadosPage; 