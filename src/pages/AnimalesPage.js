import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAmca } from '../context/AmcaContext';
import { animalesService } from '../services/api';

/**
 * Página de gestión de animales
 * Permite crear, leer, actualizar y eliminar registros de animales
 */
const AnimalesPage = () => {
  const { animales, loading, showNotification } = useAmca();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
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
      if (editingAnimal) {
        await animalesService.update(editingAnimal.id, data);
        showNotification('Animal actualizado exitosamente', 'success');
      } else {
        await animalesService.create(data);
        showNotification('Animal creado exitosamente', 'success');
      }
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  const handleCreateAnimal = () => {
    setEditingAnimal(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEditAnimal = (animal) => {
    setEditingAnimal(animal);
    setValue('especie', animal.especie);
    setValue('raza', animal.raza);
    setIsModalOpen(true);
  };

  const handleDeleteAnimal = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este animal?')) {
      try {
        await animalesService.delete(id);
        showNotification('Animal eliminado exitosamente', 'success');
        window.location.reload();
      } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnimal(null);
    reset();
  };

  const filteredAndSortedAnimales = animales
    .filter(animal => 
      animal.especie?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      animal.raza?.toLowerCase().includes(filterTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      return aValue.localeCompare(bValue);
    });

  return (
    <div className="animales-page">
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold text-warning">
                  <i className="fas fa-cow me-2"></i>
                  Gestión de Animales
                </h1>
                <p className="lead text-muted">
                  Administra el inventario ganadero del sistema
                </p>
              </div>
              <button
                className="btn btn-warning btn-lg"
                onClick={handleCreateAnimal}
              >
                <i className="fas fa-plus me-2"></i>
                Nuevo Animal
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
                placeholder="Buscar animales..."
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
              <option value="raza">Ordenar por Raza</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="d-flex justify-content-end">
              <span className="badge bg-warning fs-6">
                {filteredAndSortedAnimales.length} animales
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando animales...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-warning">
                    <tr>
                      <th>ID</th>
                      <th>Especie</th>
                      <th>Raza</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedAnimales.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <i className="fas fa-inbox text-muted display-4"></i>
                          <p className="mt-2 text-muted">No se encontraron animales</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedAnimales.map((animal) => (
                        <tr key={animal.id}>
                          <td>
                            <span className="badge bg-secondary">#{animal.id}</span>
                          </td>
                          <td>
                            <strong>{animal.especie}</strong>
                          </td>
                          <td>{animal.raza}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEditAnimal(animal)}
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteAnimal(animal.id)}
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

      {/* Modal para crear/editar animal */}
      {isModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  <i className="fas fa-cow me-2"></i>
                  {editingAnimal ? 'Editar Animal' : 'Nuevo Animal'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                                    <div className="mb-3">
                    <label htmlFor="especie" className="form-label">
                      <i className="fas fa-paw me-1"></i>
                      Especie *
                    </label>
                    <input
                      id="especie"
                      type="text"
                      className={`form-control ${errors.especie ? 'is-invalid' : ''}`}
                      placeholder="Ingrese la especie del animal"
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
                    <label htmlFor="raza" className="form-label">
                      <i className="fas fa-tag me-1"></i>
                      Raza *
                    </label>
                    <input
                      id="raza"
                      type="text"
                      className={`form-control ${errors.raza ? 'is-invalid' : ''}`}
                      placeholder="Ingrese la raza del animal"
                      {...register('raza', {
                        required: 'La raza es obligatoria',
                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                      })}
                    />
                    {errors.raza && (
                      <div className="invalid-feedback">{errors.raza.message}</div>
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
                    className="btn btn-warning"
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
                        {editingAnimal ? 'Actualizar' : 'Guardar'}
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

export default AnimalesPage; 