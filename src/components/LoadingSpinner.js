import React from 'react';

/**
 * Componente de loading spinner mejorado
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de spinner ('spinner', 'dots', 'pulse')
 * @param {string} props.size - Tamaño del spinner ('sm', 'md', 'lg')
 * @param {string} props.color - Color del spinner
 * @param {string} props.text - Texto a mostrar junto al spinner
 * @param {boolean} props.overlay - Si debe mostrar overlay de fondo
 */
const LoadingSpinner = ({ 
  type = 'spinner', 
  size = 'md', 
  color = 'primary', 
  text = 'Cargando...',
  overlay = false 
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
    info: 'text-info',
    light: 'text-light',
    dark: 'text-dark'
  };

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`spinner-grow ${sizeClasses[size]} ${colorClasses[color]}`} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        );
      case 'pulse':
        return (
          <div className={`spinner-grow ${sizeClasses[size]} ${colorClasses[color]}`} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        );
      default:
        return (
          <div className={`spinner-border ${sizeClasses[size]} ${colorClasses[color]}`} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        );
    }
  };

  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          {renderSpinner()}
          {text && <p className="mt-2 text-muted">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      {renderSpinner()}
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
};

export default LoadingSpinner; 