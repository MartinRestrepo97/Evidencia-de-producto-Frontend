// Configuración de entorno para la aplicación AMCA
const config = {
  // Configuración del API Backend
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  
  // Configuración de la aplicación
  APP_NAME: process.env.REACT_APP_NAME || 'AMCA - Sistema de Gestión Agrícola',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Configuración de desarrollo
  DEBUG: process.env.REACT_APP_DEBUG === 'true' || false,
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
  
  // Configuración de autenticación
  JWT_STORAGE_KEY: process.env.REACT_APP_JWT_STORAGE_KEY || 'amca_token',
  REFRESH_TOKEN_KEY: process.env.REACT_APP_REFRESH_TOKEN_KEY || 'amca_refresh_token',
  
  // Configuración de PWA
  PWA_ENABLED: process.env.REACT_APP_PWA_ENABLED === 'true' || false,
  OFFLINE_ENABLED: process.env.REACT_APP_OFFLINE_ENABLED === 'true' || false,
};

export default config; 