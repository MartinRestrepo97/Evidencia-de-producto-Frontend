import React, { useState, useEffect } from 'react';

/**
 * Componente para mostrar el estado de conexión con el backend
 * Solo se muestra en modo desarrollo
 */
const BackendStatus = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV === 'development') {
      setShowStatus(true);
      checkBackendStatus();
    }
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  if (!showStatus) return null;

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected':
        return 'success';
      case 'disconnected':
        return 'warning';
      case 'error':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected':
        return 'Backend Conectado';
      case 'disconnected':
        return 'Backend Desconectado (Usando datos mock)';
      case 'error':
        return 'Error de Backend';
      default:
        return 'Verificando conexión...';
    }
  };

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'connected':
        return '✅';
      case 'disconnected':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className={`alert alert-${getStatusColor()} alert-dismissible fade show`} role="alert">
      <strong>{getStatusIcon()} {getStatusText()}</strong>
      {backendStatus === 'disconnected' && (
        <div className="mt-2">
          <small className="text-muted">
            La aplicación está funcionando con datos de prueba. 
            Para conectar con el backend real, asegúrese de que el servidor Laravel esté ejecutándose en http://localhost:8000
          </small>
        </div>
      )}
      <button
        type="button"
        className="btn-close"
        onClick={() => setShowStatus(false)}
        aria-label="Cerrar"
      ></button>
    </div>
  );
};

export default BackendStatus; 