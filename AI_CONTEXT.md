# 🤖 Contexto para IAs - Sistema AMCA Frontend

## 🎯 **Resumen Ejecutivo**

**AMCA** es un sistema de gestión agropecuaria desarrollado en **React 18** que permite administrar agricultores, fincas, animales, vegetales y productos preparados. El proyecto está estructurado profesionalmente con **Context API** para estado global, **React Router** para navegación, y **Bootstrap 5** para UI.

## 🏗️ **Arquitectura del Sistema**

### **Stack Tecnológico**
- **Frontend:** React 18.x con hooks funcionales
- **Estado:** Context API (AmcaContext)
- **Navegación:** React Router 6.x
- **UI:** Bootstrap 5 + Font Awesome 6
- **Formularios:** React Hook Form
- **HTTP:** Axios para API calls
- **Backend:** Laravel 7.x (API REST)
- **Base de Datos:** MySQL

### **Estructura de Archivos Clave**
```
src/
├── App.js                    # Componente principal con rutas
├── index.js                  # Punto de entrada con providers
├── context/AmcaContext.js    # Estado global del sistema
├── services/api.js           # Configuración de axios y servicios
├── components/               # Navbar, Footer
├── pages/                    # Todas las páginas CRUD
└── styles/                   # CSS global y específico
```

## 📊 **Entidades del Sistema**

### **1. Agricultores** (`/agricultores`)
- **Icono:** `fas fa-user-tie`
- **Color:** Success (verde)
- **Campos:** nombres, apellidos, teléfono, documento
- **Servicio:** `agricultoresService`

### **2. Fincas** (`/fincas`)
- **Icono:** `fas fa-map-marker-alt`
- **Color:** Primary (azul)
- **Campos:** nombre, ubicación, tamaño, tipo
- **Servicio:** `fincasService`

### **3. Animales** (`/animales`)
- **Icono:** `fas fa-horse`
- **Color:** Warning (amarillo)
- **Campos:** especie, raza, edad, peso
- **Servicio:** `animalesService`

### **4. Vegetales** (`/vegetales`)
- **Icono:** `fas fa-seedling`
- **Color:** Info (celeste)
- **Campos:** nombre, tipo, temporada, rendimiento
- **Servicio:** `vegetalesService`

### **5. Preparados** (`/preparados`)
- **Icono:** `fas fa-utensils`
- **Color:** Danger (rojo)
- **Campos:** nombre, ingredientes, proceso, fecha
- **Servicio:** `preparadosService`

## 🔄 **Flujo de Datos**

### **Patrón de Estado Global**
```javascript
// Context API Structure
const initialState = {
  agricultores: [], fincas: [], animales: [], 
  vegetales: [], preparados: [],
  loading: false, error: null,
  searchResults: [], searchTerm: '', searchCategory: 'todos',
  formData: {}, isEditing: false,
  notifications: []
};
```

### **Patrón de Servicios**
```javascript
// Ejemplo: agricultoresService
export const agricultoresService = {
  getAll: async () => { /* GET /api/agricultores */ },
  getById: async (id) => { /* GET /api/agricultores/{id} */ },
  create: async (data) => { /* POST /api/agricultores */ },
  update: async (id, data) => { /* PUT /api/agricultores/{id} */ },
  delete: async (id) => { /* DELETE /api/agricultores/{id} */ }
};
```

## 🎨 **Sistema de Diseño**

### **Paleta de Colores**
```css
:root {
  --primary-color: #198754;    /* Verde agrícola */
  --success-color: #198754;    /* Verde éxito */
  --info-color: #0dcaf0;       /* Azul información */
  --warning-color: #ffc107;    /* Amarillo advertencia */
  --danger-color: #dc3545;     /* Rojo peligro */
}
```

### **Convenciones de Iconos**
- **Agricultores:** `fas fa-user-tie`
- **Fincas:** `fas fa-map-marker-alt`
- **Animales:** `fas fa-horse`
- **Vegetales:** `fas fa-seedling`
- **Preparados:** `fas fa-utensils`
- **Navegación:** `fas fa-home`, `fas fa-search`

## 🔍 **Funcionalidades Principales**

### **1. CRUD Operations**
Cada entidad tiene operaciones completas:
- **Create:** Modal con formulario
- **Read:** Tabla con datos
- **Update:** Modal de edición
- **Delete:** Confirmación antes de eliminar

### **2. Búsqueda Global**
- **Ubicación:** Navbar superior
- **Funcionalidad:** Búsqueda en todas las entidades
- **Filtros:** Por categoría específica
- **Resultados:** Página dedicada (`/busqueda`)

### **3. Navegación**
- **Rutas principales:** `/`, `/agricultores`, `/fincas`, etc.
- **Rutas especiales:** `/busqueda`, `/detalles/:tipo/:id`
- **Responsive:** Menú hamburguesa en móvil

## 🛠️ **Patrones de Desarrollo**

### **Estructura de Componentes**
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAmca } from '../context/AmcaContext';

// 2. Definición del componente
const PageComponent = () => {
  // 3. Hooks
  const { data, loading, showNotification } = useAmca();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 4. React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // 5. Funciones
  const onSubmit = async (data) => {
    try {
      // Lógica de envío
      showNotification('Operación exitosa', 'success');
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };
  
  // 6. Render
  return (
    <div className="page-container">
      {/* JSX */}
    </div>
  );
};

export default PageComponent;
```

### **Patrón de Formularios**
```javascript
// React Hook Form con validación
const { register, handleSubmit, reset, formState: { errors } } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <input 
    {...register('campo', { required: 'Campo requerido' })}
    className={`form-control ${errors.campo ? 'is-invalid' : ''}`}
  />
  {errors.campo && <div className="invalid-feedback">{errors.campo.message}</div>}
</form>
```

## 🔧 **Configuración Técnica**

### **Variables de Entorno**
```javascript
// .env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
```

### **Configuración de Axios**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});
```

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile:** < 576px
- **Tablet:** 576px - 768px
- **Desktop:** > 768px

### **Adaptaciones Clave**
- **Navbar:** Menú hamburguesa en móvil
- **Tablas:** Scroll horizontal en móvil
- **Formularios:** Campos apilados verticalmente
- **Modales:** Tamaño adaptativo

## 🚨 **Problemas Conocidos**

### **Críticos**
1. **No hay conexión real con backend** - Usar datos de prueba
2. **Falta de testing** - Implementar Jest
3. **Manejo básico de errores** - Implementar error boundaries

### **Técnicos**
4. **Performance no optimizada** - Implementar React.memo
5. **Accesibilidad básica** - Implementar ARIA
6. **SEO básico** - Optimizar meta tags

## 🎯 **Tareas Prioritarias**

### **Inmediatas**
- [ ] Conectar con backend Laravel
- [ ] Implementar testing básico
- [ ] Mejorar manejo de errores

### **Corto Plazo**
- [ ] Optimizar performance
- [ ] Mejorar accesibilidad
- [ ] Implementar loading states

### **Mediano Plazo**
- [ ] PWA features
- [ ] Analytics
- [ ] Deployment

## 📝 **Convenciones de Código**

### **Nomenclatura**
- **Componentes:** PascalCase (`HomePage`)
- **Funciones:** camelCase (`handleSubmit`)
- **Constantes:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Archivos:** kebab-case (`home-page.css`)

### **Estructura de Archivos**
- **Componentes:** `src/components/`
- **Páginas:** `src/pages/`
- **Servicios:** `src/services/`
- **Estilos:** `src/styles/`

## 🔍 **Búsqueda y Navegación**

### **Comandos Útiles**
```bash
# Buscar componentes
find src -name "*.js" -type f

# Buscar estilos
find src -name "*.css" -type f

# Buscar iconos
grep -r "fas fa-" src/

# Buscar rutas
grep -r "Route" src/
```

### **Archivos Clave para Modificar**
- **Rutas:** `src/App.js`
- **Estado:** `src/context/AmcaContext.js`
- **API:** `src/services/api.js`
- **Estilos:** `src/styles/index.css`

## 🎨 **Personalización de UI**

### **Colores por Entidad**
- **Agricultores:** Verde (`success`)
- **Fincas:** Azul (`primary`)
- **Animales:** Amarillo (`warning`)
- **Vegetales:** Celeste (`info`)
- **Preparados:** Rojo (`danger`)

### **Iconos por Función**
- **Navegación:** `fas fa-home`, `fas fa-arrow-left`
- **Acciones:** `fas fa-plus`, `fas fa-edit`, `fas fa-trash`
- **Estado:** `fas fa-spinner`, `fas fa-check`, `fas fa-exclamation`

## 📊 **Estado del Proyecto**

### **✅ Completado**
- Estructura básica de React
- Context API para estado global
- Componentes de navegación
- Páginas CRUD básicas
- Sistema de búsqueda
- Estilos responsivos

### **🔄 En Progreso**
- Conexión con backend
- Testing unitario
- Optimización de performance

### **📋 Pendiente**
- PWA features
- Analytics
- Deployment
- Documentación completa

---

**Contexto generado:** Diciembre 2024  
**Versión:** 1.0.0  
**Para uso de:** IAs de desarrollo 