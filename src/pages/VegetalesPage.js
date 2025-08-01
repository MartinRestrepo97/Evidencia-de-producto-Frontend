import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAmca } from '../context/AmcaContext';
import { vegetalesService } from '../services/api';


/**
 * Página de gestión de vegetales
 */
const VegetalesPage = () => {
  const { vegetales, loading, showNotification } = useAmca();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVegetal, setEditingVegetal] = useState(null);
  const [filterTerm, setFilterTerm] = useState('');
  const [sortBy, setSortBy] = useState('especie');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (editingVegetal) {
        await vegetalesService.update(editingVegetal.id, data);
        showNotification('Vegetal actualizado exitosamente', 'success');
      } else {
        await vegetalesService.create(data);
        showNotification('Vegetal creado exitosamente', 'success');
      }
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  const handleCreateVegetal = () => {
    setEditingVegetal(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEditVegetal = (vegetal) => {
    setEditingVegetal(vegetal);
    setValue('especie', vegetal.especie);
    setValue('observaciones', vegetal.observaciones);
    setIsModalOpen(true);
  };

  const handleDeleteVegetal = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este vegetal?')) {
      try {
        await vegetalesService.delete(id);
        showNotification('Vegetal eliminado exitosamente', 'success');
        window.location.reload();
      } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVegetal(null);
    reset();
  };

  const filteredAndSortedVegetales = vegetales
    .filter(vegetal => 
      vegetal.especie?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      vegetal.observaciones?.toLowerCase().includes(filterTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      return aValue.localeCompare(bValue);
    });

  return (
    <div className="vegetales-page">
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold text-info">
                  <i className="fas fa-seedling me-2"></i>
                  Gestión de Vegetales
                </h1>
                <p className="lead text-muted">
                  Administra los cultivos y productos vegetales
                </p>
              </div>
              <button
                className="btn btn-info btn-lg"
                onClick={handleCreateVegetal}
              >
                <i className="fas fa-plus me-2"></i>
                Nuevo Vegetal
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
                placeholder="Buscar vegetales..."
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
              <option value="especie">Ordenar por Especie</option>
              <option value="observaciones">Ordenar por Observaciones</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="d-flex justify-content-end">
              <span className="badge bg-info fs-6">
                {filteredAndSortedVegetales.length} vegetales
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando vegetales...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-info">
                    <tr>
                      <th>ID</th>
                      <th>Especie</th>
                      <th>Observaciones</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedVegetales.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <i className="fas fa-inbox text-muted display-4"></i>
                          <p className="mt-2 text-muted">No se encontraron vegetales</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedVegetales.map((vegetal) => (
                        <tr key={vegetal.id}>
                          <td>
                            <span className="badge bg-secondary">#{vegetal.id}</span>
                          </td>
                          <td>
                            <strong>{vegetal.especie}</strong>
                          </td>
                          <td>{vegetal.observaciones || 'Sin observaciones'}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => handleEditVegetal(vegetal)}
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteVegetal(vegetal.id)}
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

      {/* Modal para crear/editar vegetal */}
      {isModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  <i className="fas fa-seedling me-2"></i>
                  {editingVegetal ? 'Editar Vegetal' : 'Nuevo Vegetal'}
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
                    <label className="form-label">
                      <i className="fas fa-seedling me-1"></i>
                      Especie *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.especie ? 'is-invalid' : ''}`}
                      placeholder="Ingrese la especie del vegetal"
                      {...register('especie', { 
                        required: 'La especie es obligatoria',
                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                      })}
                    />
                    {errors.especie && (
                      <div className="invalid-feedback">{errors.especie.message}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-sticky-note me-1"></i>
                      Observaciones
                    </label>
                    <textarea
                      className={`form-control ${errors.observaciones ? 'is-invalid' : ''}`}
                      placeholder="Ingrese observaciones sobre el vegetal"
                      rows="3"
                      {...register('observaciones')}
                    />
                    {errors.observaciones && (
                      <div className="invalid-feedback">{errors.observaciones.message}</div>
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
                    className="btn btn-info"
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
                        {editingVegetal ? 'Actualizar' : 'Guardar'}
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

export default VegetalesPage; 