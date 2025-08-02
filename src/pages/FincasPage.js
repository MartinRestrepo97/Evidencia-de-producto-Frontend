import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAmca } from '../context/AmcaContext';
import { fincasService } from '../services/api';


/**
 * Página de gestión de fincas
 * Permite crear, leer, actualizar y eliminar registros de fincas
 */
const FincasPage = () => {
  const { fincas, loading, showNotification } = useAmca();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFinca, setEditingFinca] = useState(null);
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
      if (editingFinca) {
        await fincasService.update(editingFinca.id, data);
        showNotification('Finca actualizada exitosamente', 'success');
      } else {
        await fincasService.create(data);
        showNotification('Finca creada exitosamente', 'success');
      }
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  const handleCreateFinca = () => {
    setEditingFinca(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEditFinca = (finca) => {
    setEditingFinca(finca);
    setValue('nombre', finca.nombre);
    setValue('ubicacion', finca.ubicacion);
    setIsModalOpen(true);
  };

  const handleDeleteFinca = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta finca?')) {
      try {
        await fincasService.delete(id);
        showNotification('Finca eliminada exitosamente', 'success');
        window.location.reload();
      } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFinca(null);
    reset();
  };

  const filteredAndSortedFincas = fincas
    .filter(finca => 
      finca.nombre?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      finca.ubicacion?.toLowerCase().includes(filterTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      return aValue.localeCompare(bValue);
    });

  return (
    <div className="fincas-page">
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold text-primary">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Gestión de Fincas
                </h1>
                <p className="lead text-muted">
                  Administra las propiedades agrícolas registradas en el sistema
                </p>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleCreateFinca}
              >
                <i className="fas fa-plus me-2"></i>
                Nueva Finca
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
                placeholder="Buscar fincas..."
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
              <option value="ubicacion">Ordenar por Ubicación</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="d-flex justify-content-end">
              <span className="badge bg-primary fs-6">
                {filteredAndSortedFincas.length} fincas
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando fincas...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-primary">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Ubicación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedFincas.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <i className="fas fa-inbox text-muted display-4"></i>
                          <p className="mt-2 text-muted">No se encontraron fincas</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedFincas.map((finca) => (
                        <tr key={finca.id}>
                          <td>
                            <span className="badge bg-secondary">#{finca.id}</span>
                          </td>
                          <td>
                            <strong>{finca.nombre}</strong>
                          </td>
                          <td>
                            <i className="fas fa-map-marker-alt me-1 text-muted"></i>
                            {finca.ubicacion}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditFinca(finca)}
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteFinca(finca.id)}
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

      {/* Modal para crear/editar finca */}
      {isModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {editingFinca ? 'Editar Finca' : 'Nueva Finca'}
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
                      <i className="fas fa-tag me-1"></i>
                      Nombre de la Finca *
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                      placeholder="Ingrese el nombre de la finca"
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
                    <label htmlFor="ubicacion" className="form-label">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      Ubicación *
                    </label>
                    <input
                      id="ubicacion"
                      type="text"
                      className={`form-control ${errors.ubicacion ? 'is-invalid' : ''}`}
                      placeholder="Ingrese la ubicación de la finca"
                      {...register('ubicacion', { 
                        required: 'La ubicación es obligatoria',
                        minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                      })}
                    />
                    {errors.ubicacion && (
                      <div className="invalid-feedback">{errors.ubicacion.message}</div>
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
                    className="btn btn-primary"
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
                        {editingFinca ? 'Actualizar' : 'Guardar'}
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

export default FincasPage; 