import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { agricultoresService, fincasService, animalesService, vegetalesService, preparadosService } from '../services/api';

// Definición del contexto para estado global
const AmcaContext = createContext();

// Estado inicial de la aplicación
const initialState = {
  // Datos de las entidades principales
  agricultores: [],
  fincas: [],
  animales: [],
  vegetales: [],
  preparados: [],
  
  // Estado de carga
  loading: false,
  error: null,
  
  // Estado de búsqueda
  searchResults: [],
  searchTerm: '',
  searchCategory: 'todos',
  
  // Estado de formularios
  formData: {},
  isEditing: false,
  
  // Estado de notificaciones
  notifications: []
};

// Tipos de acciones para el reducer
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_AGRICULTORES: 'SET_AGRICULTORES',
  SET_FINCAS: 'SET_FINCAS',
  SET_ANIMALES: 'SET_ANIMALES',
  SET_VEGETALES: 'SET_VEGETALES',
  SET_PREPARADOS: 'SET_PREPARADOS',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SEARCH_CATEGORY: 'SET_SEARCH_CATEGORY',
  SET_FORM_DATA: 'SET_FORM_DATA',
  SET_EDITING: 'SET_EDITING',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_SEARCH: 'CLEAR_SEARCH'
};

/**
 * Reducer para manejar las acciones del estado global
 * @param {Object} state - Estado actual
 * @param {Object} action - Acción a ejecutar
 * @returns {Object} Nuevo estado
 */
function amcaReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.SET_AGRICULTORES:
      return { ...state, agricultores: action.payload, loading: false };
    
    case ACTIONS.SET_FINCAS:
      return { ...state, fincas: action.payload, loading: false };
    
    case ACTIONS.SET_ANIMALES:
      return { ...state, animales: action.payload, loading: false };
    
    case ACTIONS.SET_VEGETALES:
      return { ...state, vegetales: action.payload, loading: false };
    
    case ACTIONS.SET_PREPARADOS:
      return { ...state, preparados: action.payload, loading: false };
    
    case ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    
    case ACTIONS.SET_SEARCH_CATEGORY:
      return { ...state, searchCategory: action.payload };
    
    case ACTIONS.SET_FORM_DATA:
      return { ...state, formData: action.payload };
    
    case ACTIONS.SET_EDITING:
      return { ...state, isEditing: action.payload };
    
    case ACTIONS.ADD_NOTIFICATION:
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };
    
    case ACTIONS.REMOVE_NOTIFICATION:
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    
    case ACTIONS.CLEAR_SEARCH:
      return { 
        ...state, 
        searchResults: [], 
        searchTerm: '', 
        searchCategory: 'todos' 
      };
    
    default:
      return state;
  }
}

/**
 * Proveedor del contexto AMCA
 * Maneja el estado global y las funciones de la aplicación
 */
export function AmcaProvider({ children }) {
  const [state, dispatch] = useReducer(amcaReducer, initialState);

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'info', title = null) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      title: title || type.charAt(0).toUpperCase() + type.slice(1),
      timestamp: new Date()
    };
    dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notification });
    
    // Auto-remover notificación después de 5 segundos
    setTimeout(() => {
      dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: notification.id });
    }, 5000);
  };

  const showSuccess = (message, title = 'Éxito') => {
    showNotification(message, 'success', title);
  };

  const showError = (message, title = 'Error') => {
    showNotification(message, 'error', title);
  };

  const showWarning = (message, title = 'Advertencia') => {
    showNotification(message, 'warning', title);
  };

  const showInfo = (message, title = 'Información') => {
    showNotification(message, 'info', title);
  };

  // Función para cargar datos de agricultores
  const loadAgricultores = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const data = await agricultoresService.getAll();
      dispatch({ type: ACTIONS.SET_AGRICULTORES, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      showNotification('Error al cargar agricultores', 'error');
    }
  };

  // Función para cargar datos de fincas
  const loadFincas = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const data = await fincasService.getAll();
      dispatch({ type: ACTIONS.SET_FINCAS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      showNotification('Error al cargar fincas', 'error');
    }
  };

  // Función para cargar datos de animales
  const loadAnimales = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const data = await animalesService.getAll();
      dispatch({ type: ACTIONS.SET_ANIMALES, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      showNotification('Error al cargar animales', 'error');
    }
  };

  // Función para cargar datos de vegetales
  const loadVegetales = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const data = await vegetalesService.getAll();
      dispatch({ type: ACTIONS.SET_VEGETALES, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      showNotification('Error al cargar vegetales', 'error');
    }
  };

  // Función para cargar datos de preparados
  const loadPreparados = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const data = await preparadosService.getAll();
      dispatch({ type: ACTIONS.SET_PREPARADOS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      showNotification('Error al cargar preparados', 'error');
    }
  };

  // Función para realizar búsquedas
  const performSearch = (term, category = 'todos') => {
    dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: term });
    dispatch({ type: ACTIONS.SET_SEARCH_CATEGORY, payload: category });
    
    // Lógica de búsqueda según categoría
    let results = [];
    const searchTerm = term.toLowerCase();
    
    if (category === 'todos' || category === 'agricultores') {
      results = results.concat(
        state.agricultores.filter(item => 
          item.nombres?.toLowerCase().includes(searchTerm) ||
          item.apellidos?.toLowerCase().includes(searchTerm)
        ).map(item => ({ ...item, tipo: 'agricultor' }))
      );
    }
    
    if (category === 'todos' || category === 'fincas') {
      results = results.concat(
        state.fincas.filter(item => 
          item.nombre?.toLowerCase().includes(searchTerm) ||
          item.ubicacion?.toLowerCase().includes(searchTerm)
        ).map(item => ({ ...item, tipo: 'finca' }))
      );
    }
    
    if (category === 'todos' || category === 'animales') {
      results = results.concat(
        state.animales.filter(item => 
          item.especie?.toLowerCase().includes(searchTerm) ||
          item.raza?.toLowerCase().includes(searchTerm)
        ).map(item => ({ ...item, tipo: 'animal' }))
      );
    }
    
    if (category === 'todos' || category === 'vegetales') {
      results = results.concat(
        state.vegetales.filter(item => 
          item.especie?.toLowerCase().includes(searchTerm) ||
          item.observaciones?.toLowerCase().includes(searchTerm)
        ).map(item => ({ ...item, tipo: 'vegetal' }))
      );
    }
    
    if (category === 'todos' || category === 'preparados') {
      results = results.concat(
        state.preparados.filter(item => 
          item.nombre?.toLowerCase().includes(searchTerm) ||
          item.descripcion?.toLowerCase().includes(searchTerm)
        ).map(item => ({ ...item, tipo: 'preparado' }))
      );
    }
    
    dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: results });
  };

  // Función para limpiar búsqueda
  const clearSearch = () => {
    dispatch({ type: ACTIONS.CLEAR_SEARCH });
  };

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    loadAgricultores();
    loadFincas();
    loadAnimales();
    loadVegetales();
    loadPreparados();
  }, []);

  // Valor del contexto
  const value = {
    ...state,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    loadAgricultores,
    loadFincas,
    loadAnimales,
    loadVegetales,
    loadPreparados,
    performSearch,
    clearSearch
  };

  return (
    <AmcaContext.Provider value={value}>
      {children}
    </AmcaContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto AMCA
 * @returns {Object} Estado y funciones del contexto
 */
export function useAmca() {
  const context = useContext(AmcaContext);
  if (!context) {
    throw new Error('useAmca debe ser usado dentro de AmcaProvider');
  }
  return context;
} 