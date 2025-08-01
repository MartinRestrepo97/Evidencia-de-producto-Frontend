import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AmcaProvider } from './context/AmcaContext';

// Punto de entrada principal de la aplicación AMCA
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Proveedor de contexto para estado global de la aplicación */}
    <AmcaProvider>
      {/* Router para navegación entre páginas */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AmcaProvider>
  </React.StrictMode>
); 