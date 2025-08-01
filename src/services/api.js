import axios from 'axios';
import config from '../config/env.config.js';

// Configuración base de Axios
const API_BASE_URL = config.API_URL;

// Crear instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Datos mock para desarrollo cuando el backend no esté disponible
const mockData = {
  agricultores: [
    { id: 1, nombres: 'Juan Carlos', apellidos: 'García López', telefono: '3001234567', documento: '12345678' },
    { id: 2, nombres: 'María Elena', apellidos: 'Rodríguez Silva', telefono: '3109876543', documento: '87654321' },
    { id: 3, nombres: 'Pedro Antonio', apellidos: 'Martínez Vega', telefono: '3155551234', documento: '11223344' }
  ],
  fincas: [
    { id: 1, nombre: 'Finca El Paraíso', ubicacion: 'Vereda La Esperanza', hectareas: 15.5, agricultor_id: 1 },
    { id: 2, nombre: 'Finca Los Pinos', ubicacion: 'Vereda San José', hectareas: 8.2, agricultor_id: 2 },
    { id: 3, nombre: 'Finca La Esperanza', ubicacion: 'Vereda El Retiro', hectareas: 12.0, agricultor_id: 3 }
  ],
  animales: [
    { id: 1, nombre: 'Vaca Lola', tipo: 'Bovino', raza: 'Holstein', peso: 450, finca_id: 1 },
    { id: 2, nombre: 'Cerdo Pepe', tipo: 'Porcino', raza: 'Landrace', peso: 120, finca_id: 2 },
    { id: 3, nombre: 'Gallina Clotilde', tipo: 'Ave', raza: 'Leghorn', peso: 2.5, finca_id: 3 }
  ],
  vegetales: [
    { id: 1, nombre: 'Tomate Cherry', tipo: 'Hortaliza', variedad: 'Cherry', finca_id: 1 },
    { id: 2, nombre: 'Lechuga Romana', tipo: 'Verdura', variedad: 'Romana', finca_id: 2 },
    { id: 3, nombre: 'Zanahoria Naranja', tipo: 'Tubérculo', variedad: 'Nantes', finca_id: 3 }
  ],
  preparados: [
    { id: 1, nombre: 'Abono Orgánico', tipo: 'Fertilizante', descripcion: 'Abono natural para cultivos', finca_id: 1 },
    { id: 2, nombre: 'Pesticida Natural', tipo: 'Control de Plagas', descripcion: 'Control biológico de plagas', finca_id: 2 },
    { id: 3, nombre: 'Compost', tipo: 'Mejorador de Suelo', descripcion: 'Mezcla orgánica para suelo', finca_id: 3 }
  ]
};

// Función para verificar si el backend está disponible
const checkBackendAvailability = async () => {
  try {
    await apiClient.get('/health');
    return true;
  } catch (error) {
    console.warn('Backend no disponible, usando datos mock para desarrollo');
    return false;
  }
};

// Variable global para el estado del backend
let isBackendAvailable = null;

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('amca_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de requests en modo debug
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    // Log de responses en modo debug
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    // Manejo centralizado de errores
    const errorResponse = {
      message: 'Error de conexión',
      status: error.response?.status || 0,
      data: error.response?.data || null,
      originalError: error,
    };

    // Manejo específico por tipo de error
    if (error.response) {
      // Error del servidor (4xx, 5xx)
      switch (error.response.status) {
        case 401:
          errorResponse.message = 'No autorizado. Por favor, inicie sesión nuevamente.';
          // Limpiar token inválido
          localStorage.removeItem('amca_token');
          break;
        case 403:
          errorResponse.message = 'Acceso denegado. No tiene permisos para esta acción.';
          break;
        case 404:
          errorResponse.message = 'Recurso no encontrado.';
          break;
        case 422:
          errorResponse.message = 'Datos inválidos. Por favor, verifique la información.';
          break;
        case 500:
          errorResponse.message = 'Error interno del servidor. Intente más tarde.';
          break;
        default:
          errorResponse.message = error.response.data?.message || 'Error del servidor';
      }
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      errorResponse.message = 'Error de conexión. Verifique su conexión a internet.';
      
      // En desarrollo, verificar si el backend está disponible
      if (process.env.NODE_ENV === 'development' && isBackendAvailable === null) {
        isBackendAvailable = await checkBackendAvailability();
      }
    } else {
      // Error de configuración
      errorResponse.message = 'Error de configuración.';
    }

    console.error('API Error:', errorResponse);
    return Promise.reject(errorResponse);
  }
);

// Función para crear respuestas mock
const createMockResponse = (data) => {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
    request: {}
  };
};

// Servicios específicos para cada entidad con fallback a datos mock
export const agricultoresService = {
  getAll: async () => {
    try {
      return await apiClient.get('/agricultores');
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        console.log('Usando datos mock para agricultores');
        return createMockResponse(mockData.agricultores);
      }
      throw error;
    }
  },
  getById: async (id) => {
    try {
      return await apiClient.get(`/agricultores/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const agricultor = mockData.agricultores.find(a => a.id === parseInt(id));
        if (agricultor) {
          return createMockResponse(agricultor);
        }
      }
      throw error;
    }
  },
  create: async (data) => {
    try {
      return await apiClient.post('/agricultores', data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const newAgricultor = { ...data, id: Date.now() };
        mockData.agricultores.push(newAgricultor);
        return createMockResponse(newAgricultor);
      }
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      return await apiClient.put(`/agricultores/${id}`, data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.agricultores.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
          mockData.agricultores[index] = { ...mockData.agricultores[index], ...data };
          return createMockResponse(mockData.agricultores[index]);
        }
      }
      throw error;
    }
  },
  delete: async (id) => {
    try {
      return await apiClient.delete(`/agricultores/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.agricultores.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
          mockData.agricultores.splice(index, 1);
          return createMockResponse({ message: 'Agricultor eliminado exitosamente' });
        }
      }
      throw error;
    }
  },
  search: async (query) => {
    try {
      return await apiClient.get(`/agricultores/search?q=${query}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const filtered = mockData.agricultores.filter(a => 
          a.nombres.toLowerCase().includes(query.toLowerCase()) ||
          a.apellidos.toLowerCase().includes(query.toLowerCase())
        );
        return createMockResponse(filtered);
      }
      throw error;
    }
  },
};

export const fincasService = {
  getAll: async () => {
    try {
      return await apiClient.get('/fincas');
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        console.log('Usando datos mock para fincas');
        return createMockResponse(mockData.fincas);
      }
      throw error;
    }
  },
  getById: async (id) => {
    try {
      return await apiClient.get(`/fincas/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const finca = mockData.fincas.find(f => f.id === parseInt(id));
        if (finca) {
          return createMockResponse(finca);
        }
      }
      throw error;
    }
  },
  create: async (data) => {
    try {
      return await apiClient.post('/fincas', data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const newFinca = { ...data, id: Date.now() };
        mockData.fincas.push(newFinca);
        return createMockResponse(newFinca);
      }
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      return await apiClient.put(`/fincas/${id}`, data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.fincas.findIndex(f => f.id === parseInt(id));
        if (index !== -1) {
          mockData.fincas[index] = { ...mockData.fincas[index], ...data };
          return createMockResponse(mockData.fincas[index]);
        }
      }
      throw error;
    }
  },
  delete: async (id) => {
    try {
      return await apiClient.delete(`/fincas/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.fincas.findIndex(f => f.id === parseInt(id));
        if (index !== -1) {
          mockData.fincas.splice(index, 1);
          return createMockResponse({ message: 'Finca eliminada exitosamente' });
        }
      }
      throw error;
    }
  },
  search: async (query) => {
    try {
      return await apiClient.get(`/fincas/search?q=${query}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const filtered = mockData.fincas.filter(f => 
          f.nombre.toLowerCase().includes(query.toLowerCase()) ||
          f.ubicacion.toLowerCase().includes(query.toLowerCase())
        );
        return createMockResponse(filtered);
      }
      throw error;
    }
  },
};

export const animalesService = {
  getAll: async () => {
    try {
      return await apiClient.get('/animales');
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        console.log('Usando datos mock para animales');
        return createMockResponse(mockData.animales);
      }
      throw error;
    }
  },
  getById: async (id) => {
    try {
      return await apiClient.get(`/animales/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const animal = mockData.animales.find(a => a.id === parseInt(id));
        if (animal) {
          return createMockResponse(animal);
        }
      }
      throw error;
    }
  },
  create: async (data) => {
    try {
      return await apiClient.post('/animales', data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const newAnimal = { ...data, id: Date.now() };
        mockData.animales.push(newAnimal);
        return createMockResponse(newAnimal);
      }
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      return await apiClient.put(`/animales/${id}`, data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.animales.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
          mockData.animales[index] = { ...mockData.animales[index], ...data };
          return createMockResponse(mockData.animales[index]);
        }
      }
      throw error;
    }
  },
  delete: async (id) => {
    try {
      return await apiClient.delete(`/animales/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.animales.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
          mockData.animales.splice(index, 1);
          return createMockResponse({ message: 'Animal eliminado exitosamente' });
        }
      }
      throw error;
    }
  },
  search: async (query) => {
    try {
      return await apiClient.get(`/animales/search?q=${query}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const filtered = mockData.animales.filter(a => 
          a.nombre.toLowerCase().includes(query.toLowerCase()) ||
          a.tipo.toLowerCase().includes(query.toLowerCase()) ||
          a.raza.toLowerCase().includes(query.toLowerCase())
        );
        return createMockResponse(filtered);
      }
      throw error;
    }
  },
};

export const vegetalesService = {
  getAll: async () => {
    try {
      return await apiClient.get('/vegetales');
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        console.log('Usando datos mock para vegetales');
        return createMockResponse(mockData.vegetales);
      }
      throw error;
    }
  },
  getById: async (id) => {
    try {
      return await apiClient.get(`/vegetales/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const vegetal = mockData.vegetales.find(v => v.id === parseInt(id));
        if (vegetal) {
          return createMockResponse(vegetal);
        }
      }
      throw error;
    }
  },
  create: async (data) => {
    try {
      return await apiClient.post('/vegetales', data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const newVegetal = { ...data, id: Date.now() };
        mockData.vegetales.push(newVegetal);
        return createMockResponse(newVegetal);
      }
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      return await apiClient.put(`/vegetales/${id}`, data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.vegetales.findIndex(v => v.id === parseInt(id));
        if (index !== -1) {
          mockData.vegetales[index] = { ...mockData.vegetales[index], ...data };
          return createMockResponse(mockData.vegetales[index]);
        }
      }
      throw error;
    }
  },
  delete: async (id) => {
    try {
      return await apiClient.delete(`/vegetales/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.vegetales.findIndex(v => v.id === parseInt(id));
        if (index !== -1) {
          mockData.vegetales.splice(index, 1);
          return createMockResponse({ message: 'Vegetal eliminado exitosamente' });
        }
      }
      throw error;
    }
  },
  search: async (query) => {
    try {
      return await apiClient.get(`/vegetales/search?q=${query}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const filtered = mockData.vegetales.filter(v => 
          v.nombre.toLowerCase().includes(query.toLowerCase()) ||
          v.tipo.toLowerCase().includes(query.toLowerCase()) ||
          v.variedad.toLowerCase().includes(query.toLowerCase())
        );
        return createMockResponse(filtered);
      }
      throw error;
    }
  },
};

export const preparadosService = {
  getAll: async () => {
    try {
      return await apiClient.get('/preparados');
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        console.log('Usando datos mock para preparados');
        return createMockResponse(mockData.preparados);
      }
      throw error;
    }
  },
  getById: async (id) => {
    try {
      return await apiClient.get(`/preparados/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const preparado = mockData.preparados.find(p => p.id === parseInt(id));
        if (preparado) {
          return createMockResponse(preparado);
        }
      }
      throw error;
    }
  },
  create: async (data) => {
    try {
      return await apiClient.post('/preparados', data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const newPreparado = { ...data, id: Date.now() };
        mockData.preparados.push(newPreparado);
        return createMockResponse(newPreparado);
      }
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      return await apiClient.put(`/preparados/${id}`, data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.preparados.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
          mockData.preparados[index] = { ...mockData.preparados[index], ...data };
          return createMockResponse(mockData.preparados[index]);
        }
      }
      throw error;
    }
  },
  delete: async (id) => {
    try {
      return await apiClient.delete(`/preparados/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const index = mockData.preparados.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
          mockData.preparados.splice(index, 1);
          return createMockResponse({ message: 'Preparado eliminado exitosamente' });
        }
      }
      throw error;
    }
  },
  search: async (query) => {
    try {
      return await apiClient.get(`/preparados/search?q=${query}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        const filtered = mockData.preparados.filter(p => 
          p.nombre.toLowerCase().includes(query.toLowerCase()) ||
          p.tipo.toLowerCase().includes(query.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(query.toLowerCase())
        );
        return createMockResponse(filtered);
      }
      throw error;
    }
  },
};

// Servicio de búsqueda global
export const searchService = {
  globalSearch: async (query, category = 'all') => {
    try {
      return await apiClient.get(`/search?q=${query}&category=${category}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        console.log('Usando búsqueda mock global');
        let results = [];
        
        if (category === 'all' || category === 'agricultores') {
          results.push(...mockData.agricultores.filter(a => 
            a.nombres.toLowerCase().includes(query.toLowerCase()) ||
            a.apellidos.toLowerCase().includes(query.toLowerCase())
          ).map(item => ({ ...item, tipo: 'agricultor' })));
        }
        
        if (category === 'all' || category === 'fincas') {
          results.push(...mockData.fincas.filter(f => 
            f.nombre.toLowerCase().includes(query.toLowerCase()) ||
            f.ubicacion.toLowerCase().includes(query.toLowerCase())
          ).map(item => ({ ...item, tipo: 'finca' })));
        }
        
        if (category === 'all' || category === 'animales') {
          results.push(...mockData.animales.filter(a => 
            a.nombre.toLowerCase().includes(query.toLowerCase()) ||
            a.tipo.toLowerCase().includes(query.toLowerCase())
          ).map(item => ({ ...item, tipo: 'animal' })));
        }
        
        if (category === 'all' || category === 'vegetales') {
          results.push(...mockData.vegetales.filter(v => 
            v.nombre.toLowerCase().includes(query.toLowerCase()) ||
            v.tipo.toLowerCase().includes(query.toLowerCase())
          ).map(item => ({ ...item, tipo: 'vegetal' })));
        }
        
        if (category === 'all' || category === 'preparados') {
          results.push(...mockData.preparados.filter(p => 
            p.nombre.toLowerCase().includes(query.toLowerCase()) ||
            p.tipo.toLowerCase().includes(query.toLowerCase())
          ).map(item => ({ ...item, tipo: 'preparado' })));
        }
        
        return createMockResponse(results);
      }
      throw error;
    }
  },
  
  // Búsqueda específica por categoría
  searchByCategory: async (category, query) => {
    try {
      return await apiClient.get(`/search/${category}?q=${query}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && !isBackendAvailable) {
        console.log(`Usando búsqueda mock para categoría: ${category}`);
        return await searchService.globalSearch(query, category);
      }
      throw error;
    }
  },
};

// Servicio de autenticación
export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  refresh: (refreshToken) => apiClient.post('/auth/refresh', { refresh_token: refreshToken }),
  me: () => apiClient.get('/auth/me'),
};

// Servicio de estadísticas
export const statsService = {
  getDashboardStats: () => apiClient.get('/stats/dashboard'),
  getEntityStats: (entity) => apiClient.get(`/stats/${entity}`),
};

export default apiClient; 