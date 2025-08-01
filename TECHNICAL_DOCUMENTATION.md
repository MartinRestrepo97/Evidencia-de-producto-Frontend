# 📚 Documentación Técnica - Sistema AMCA Frontend

## 🎯 **Descripción General**

**AMCA (Sistema de Gestión Agropecuaria)** es una aplicación web desarrollada en React JS que permite la gestión integral de actividades agropecuarias, incluyendo agricultores, fincas, animales, vegetales y productos preparados.

### **Información del Proyecto**
- **Nombre:** AMCA - Sistema de Gestión Agropecuaria
- **Tipo:** Aplicación Web Frontend
- **Framework:** React 18.x
- **Backend:** Laravel 7.x (API REST)
- **Base de Datos:** MySQL
- **Fecha de Desarrollo:** Diciembre 2024

## 🏗️ **Arquitectura del Sistema**

### **Estructura de Directorios**
```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.js       # Navegación principal
│   ├── Footer.js       # Pie de página
│   └── Navbar.css      # Estilos de navegación
├── pages/              # Páginas principales
│   ├── HomePage.js     # Página de inicio
│   ├── AgricultoresPage.js
│   ├── FincasPage.js
│   ├── AnimalesPage.js
│   ├── VegetalesPage.js
│   ├── PreparadosPage.js
│   ├── BusquedaPage.js
│   ├── DetallesPage.js
│   └── *.css           # Estilos específicos
├── context/            # Gestión de estado global
│   └── AmcaContext.js  # Context API principal
├── services/           # Servicios de API
│   └── api.js          # Configuración de axios
├── styles/             # Estilos globales
│   ├── App.css         # Estilos principales
│   └── index.css       # Estilos base
├── App.js              # Componente principal
└── index.js            # Punto de entrada
```

### **Flujo de Datos**
```
Usuario → Componente → Context API → Service → Backend API
   ↑                                 ↓
   └────────── Estado Global ←───────┘
```

## 🔧 **Tecnologías Utilizadas**

### **Frontend Core**
- **React 18.x:** Framework principal con hooks funcionales
- **React Router 6.x:** Navegación entre páginas
- **Context API:** Gestión de estado global
- **React Hook Form:** Manejo de formularios

### **UI/UX**
- **Bootstrap 5:** Framework CSS responsivo
- **Font Awesome 6.0:** Iconografía agrícola
- **CSS Modules:** Estilos modulares
- **Responsive Design:** Adaptación móvil

### **HTTP Client**
- **Axios:** Cliente HTTP para comunicación con API
- **Interceptors:** Manejo global de errores
- **Timeout:** Configuración de 10 segundos

### **Herramientas de Desarrollo**
- **ESLint:** Linting de código
- **Prettier:** Formateo de código
- **Create React App:** Configuración inicial

## 📊 **Entidades del Sistema**

### **1. Agricultores**
- **Propósito:** Gestión de información personal de agricultores
- **Campos:** nombres, apellidos, teléfono, documento
- **Icono:** `fas fa-user-tie`
- **Color:** Success (verde)

### **2. Fincas**
- **Propósito:** Control de propiedades agrícolas
- **Campos:** nombre, ubicación, tamaño, tipo
- **Icono:** `fas fa-map-marker-alt`
- **Color:** Primary (azul)

### **3. Animales**
- **Propósito:** Inventario de especies ganaderas
- **Campos:** especie, raza, edad, peso
- **Icono:** `fas fa-horse`
- **Color:** Warning (amarillo)

### **4. Vegetales**
- **Propósito:** Gestión de cultivos vegetales
- **Campos:** nombre, tipo, temporada, rendimiento
- **Icono:** `fas fa-seedling`
- **Color:** Info (celeste)

### **5. Preparados**
- **Propósito:** Productos alimenticios procesados
- **Campos:** nombre, ingredientes, proceso, fecha
- **Icono:** `fas fa-utensils`
- **Color:** Danger (rojo)

## 🔄 **Gestión de Estado**

### **Context API Structure**
```javascript
const initialState = {
  // Datos de entidades
  agricultores: [],
  fincas: [],
  animales: [],
  vegetales: [],
  preparados: [],
  
  // Estado de UI
  loading: false,
  error: null,
  
  // Búsqueda
  searchResults: [],
  searchTerm: '',
  searchCategory: 'todos',
  
  // Formularios
  formData: {},
  isEditing: false,
  
  // Notificaciones
  notifications: []
};
```

### **Acciones Principales**
- `SET_LOADING`: Control de estados de carga
- `SET_ERROR`: Manejo de errores
- `SET_[ENTIDAD]`: Actualización de datos
- `SET_SEARCH_RESULTS`: Resultados de búsqueda
- `ADD_NOTIFICATION`: Notificaciones del sistema

## 🌐 **Comunicación con API**

### **Configuración Base**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

### **Servicios Implementados**
- `agricultoresService`: CRUD de agricultores
- `fincasService`: CRUD de fincas
- `animalesService`: CRUD de animales
- `vegetalesService`: CRUD de vegetales
- `preparadosService`: CRUD de preparados

### **Métodos por Servicio**
- `getAll()`: Obtener todos los registros
- `getById(id)`: Obtener registro específico
- `create(data)`: Crear nuevo registro
- `update(id, data)`: Actualizar registro
- `delete(id)`: Eliminar registro

## 🎨 **Sistema de Diseño**

### **Paleta de Colores**
```css
:root {
  --primary-color: #198754;    /* Verde agrícola */
  --secondary-color: #6c757d;  /* Gris neutro */
  --success-color: #198754;    /* Verde éxito */
  --info-color: #0dcaf0;       /* Azul información */
  --warning-color: #ffc107;    /* Amarillo advertencia */
  --danger-color: #dc3545;     /* Rojo peligro */
  --light-color: #f8f9fa;      /* Gris claro */
  --dark-color: #212529;       /* Gris oscuro */
}
```

### **Tipografía**
- **Familia:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Tamaños:** Escala modular (0.875rem - 3.5rem)
- **Pesos:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### **Componentes de UI**
- **Botones:** Estilo Bootstrap con personalización agrícola
- **Tarjetas:** Sombras suaves y bordes redondeados
- **Formularios:** Validación en tiempo real
- **Tablas:** Responsivas con hover effects
- **Modales:** Centrados con backdrop

## 🔍 **Sistema de Búsqueda**

### **Funcionalidades**
- **Búsqueda Global:** En todas las entidades
- **Filtros por Categoría:** Agricultores, Fincas, Animales, etc.
- **Búsqueda en Tiempo Real:** Resultados instantáneos
- **Historial de Búsquedas:** Persistencia local

### **Algoritmo de Búsqueda**
```javascript
const performSearch = (term, category = 'todos') => {
  const searchTerm = term.toLowerCase();
  let results = [];
  
  // Búsqueda por categoría específica
  if (category === 'agricultores' || category === 'todos') {
    results = results.concat(
      agricultores.filter(item => 
        item.nombres?.toLowerCase().includes(searchTerm) ||
        item.apellidos?.toLowerCase().includes(searchTerm)
      )
    );
  }
  
  return results;
};
```

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile:** < 576px
- **Tablet:** 576px - 768px
- **Desktop:** > 768px

### **Adaptaciones**
- **Navegación:** Menú hamburguesa en móvil
- **Tablas:** Scroll horizontal en dispositivos pequeños
- **Formularios:** Campos apilados verticalmente
- **Carrusel:** Controles adaptados al tamaño

## 🚀 **Optimización de Rendimiento**

### **Estrategias Implementadas**
- **React.memo:** Memoización de componentes
- **useCallback:** Optimización de funciones
- **useMemo:** Cálculos costosos
- **Lazy Loading:** Carga diferida de componentes

### **Métricas Objetivo**
- **First Contentful Paint:** < 2 segundos
- **Largest Contentful Paint:** < 4 segundos
- **Cumulative Layout Shift:** < 0.1
- **Lighthouse Score:** > 90

## 🛡️ **Seguridad**

### **Medidas Implementadas**
- **Validación de Entrada:** React Hook Form
- **Sanitización de Datos:** Limpieza de inputs
- **CORS:** Configuración en backend
- **HTTPS:** En producción

### **Buenas Prácticas**
- **No almacenar datos sensibles en localStorage**
- **Validación tanto en frontend como backend**
- **Manejo seguro de errores**
- **Logs de auditoría**

## 🧪 **Testing**

### **Estrategia de Testing**
- **Unit Tests:** Componentes individuales
- **Integration Tests:** Flujos de usuario
- **E2E Tests:** Casos de uso completos

### **Herramientas**
- **Jest:** Framework de testing
- **React Testing Library:** Testing de componentes
- **MSW:** Mock Service Worker para API

## 📦 **Deployment**

### **Configuración de Producción**
```bash
# Build de producción
npm run build

# Variables de entorno
REACT_APP_API_URL=https://api.amca.com
REACT_APP_ENVIRONMENT=production
```

### **Optimizaciones de Build**
- **Code Splitting:** División automática de bundles
- **Tree Shaking:** Eliminación de código no usado
- **Minificación:** Compresión de archivos
- **Gzip:** Compresión adicional

## 🔧 **Configuración de Desarrollo**

### **Requisitos del Sistema**
- **Node.js:** >= 16.0.0
- **npm:** >= 8.0.0
- **Git:** >= 2.0.0

### **Comandos Principales**
```bash
# Instalación
npm install

# Desarrollo
npm start

# Build
npm run build

# Testing
npm test

# Linting
npm run lint
```

## 📝 **Convenciones de Código**

### **Nomenclatura**
- **Componentes:** PascalCase (HomePage)
- **Funciones:** camelCase (handleSubmit)
- **Constantes:** UPPER_SNAKE_CASE (API_BASE_URL)
- **Archivos:** kebab-case (home-page.css)

### **Estructura de Componentes**
```javascript
// 1. Imports
import React from 'react';

// 2. Definición del componente
const ComponentName = () => {
  // 3. Hooks
  const [state, setState] = useState();
  
  // 4. Funciones auxiliares
  const handleAction = () => {};
  
  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 6. Export
export default ComponentName;
```

## 🎯 **Roadmap de Desarrollo**

### **Fase 1 (Completada)**
- ✅ Estructura básica
- ✅ Componentes principales
- ✅ Navegación
- ✅ Formularios

### **Fase 2 (En Progreso)**
- 🔄 Conexión con backend
- 🔄 Testing básico
- 🔄 Optimización

### **Fase 3 (Planificada)**
- 📋 PWA features
- 📋 Funcionalidades avanzadas
- 📋 Analytics

---

**Documentación generada:** Diciembre 2024  
**Versión:** 1.0.0  
**Mantenido por:** Equipo de Desarrollo AMCA 