import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

// Importación de componentes de navegación
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import BackendStatus from './components/BackendStatus';

// Importación de páginas principales
import HomePage from './pages/HomePage';
import AgricultoresPage from './pages/AgricultoresPage';
import FincasPage from './pages/FincasPage';
import AnimalesPage from './pages/AnimalesPage';
import VegetalesPage from './pages/VegetalesPage';
import PreparadosPage from './pages/PreparadosPage';
import BusquedaPage from './pages/BusquedaPage';
import DetallesPage from './pages/DetallesPage';

/**
 * Componente principal de la aplicación AMCA
 * Maneja la estructura general y las rutas de navegación
 */
function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        {/* Barra de navegación principal */}
        <Navbar />
        
        {/* Estado del backend (solo en desarrollo) */}
        <BackendStatus />
        
        {/* Contenedor principal de contenido */}
        <main className="main-content">
          <Routes>
            {/* Ruta principal - Página de inicio */}
            <Route path="/" element={<HomePage />} />
            
            {/* Rutas para gestión de entidades */}
            <Route path="/agricultores" element={<AgricultoresPage />} />
            <Route path="/fincas" element={<FincasPage />} />
            <Route path="/animales" element={<AnimalesPage />} />
            <Route path="/vegetales" element={<VegetalesPage />} />
            <Route path="/preparados" element={<PreparadosPage />} />
            
            {/* Rutas para búsqueda y detalles */}
            <Route path="/busqueda" element={<BusquedaPage />} />
            <Route path="/detalles/:tipo/:id" element={<DetallesPage />} />
          </Routes>
        </main>
        
        {/* Pie de página */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App; 