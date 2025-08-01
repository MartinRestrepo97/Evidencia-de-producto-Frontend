import React, { useEffect, useState } from 'react';

/**
 * Componente de Toast Notification mejorado
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de toast ('success', 'error', 'warning', 'info')
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.title - Título del toast
 * @param {number} props.duration - Duración en milisegundos (0 = no auto-close)
 * @param {boolean} props.show - Si el toast debe mostrarse
 * @param {Function} props.onClose - Función llamada al cerrar el toast
 */
const Toast = ({ 
  type = 'info', 
  message, 
  title, 
  duration = 5000, 
  show = false, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(show);
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onClose && onClose();
    }, 300);
  };

  const getToastClasses = () => {
    const baseClasses = 'toast show';
    const typeClasses = {
      success: 'bg-success text-white',
      error: 'bg-danger text-white',
      warning: 'bg-warning text-dark',
      info: 'bg-info text-white'
    };
    return `${baseClasses} ${typeClasses[type] || typeClasses.info}`;
  };

  const getIcon = () => {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
  };

  if (!isVisible) return null;

  return (
    <div className={`toast-container position-fixed top-0 end-0 p-3 ${isExiting ? 'fade-out' : 'fade-in'}`}
         style={{ zIndex: 1055 }}>
      <div className={getToastClasses()} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <i className={`${getIcon()} me-2`}></i>
          <strong className="me-auto">{title || type.charAt(0).toUpperCase() + type.slice(1)}</strong>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={handleClose}
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  );
};

/**
 * Hook personalizado para manejar múltiples toasts
 */
export const useToasts = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    const newToast = { ...toast, id, show: true };
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, title = 'Éxito') => {
    return addToast({ type: 'success', message, title });
  };

  const showError = (message, title = 'Error') => {
    return addToast({ type: 'error', message, title });
  };

  const showWarning = (message, title = 'Advertencia') => {
    return addToast({ type: 'warning', message, title });
  };

  const showInfo = (message, title = 'Información') => {
    return addToast({ type: 'info', message, title });
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

/**
 * Componente contenedor para múltiples toasts
 */
export const ToastContainer = () => {
  const { toasts, removeToast } = useToasts();

  return (
    <div className="toast-container-wrapper">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast; 