import React from 'react';

/**
 * Error Boundary para manejar errores de React de manera elegante
 * Captura errores en componentes hijos y muestra una UI de fallback
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente render muestre la UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error para debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Aquí se podría enviar el error a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      return (
        <div className="error-boundary">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div className="card border-danger">
                  <div className="card-header bg-danger text-white">
                    <h4 className="mb-0">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Error Inesperado
                    </h4>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">
                      Ha ocurrido un error inesperado en la aplicación. 
                      Por favor, intente recargar la página.
                    </p>
                    
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                      <details className="mt-3">
                        <summary className="text-danger cursor-pointer">
                          <i className="fas fa-bug me-2"></i>
                          Detalles del Error (Solo Desarrollo)
                        </summary>
                        <div className="mt-2">
                          <pre className="bg-light p-3 rounded small">
                            <code>
                              {this.state.error && this.state.error.toString()}
                              {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </code>
                          </pre>
                        </div>
                      </details>
                    )}
                    
                    <div className="mt-4">
                      <button 
                        className="btn btn-primary me-2"
                        onClick={() => window.location.reload()}
                      >
                        <i className="fas fa-redo me-2"></i>
                        Recargar Página
                      </button>
                      
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                      >
                        <i className="fas fa-home me-2"></i>
                        Volver al Inicio
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 