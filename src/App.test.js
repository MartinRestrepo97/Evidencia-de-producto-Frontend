import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AmcaProvider } from './context/AmcaContext';
import '@testing-library/jest-dom';
jest.mock('axios');

describe('App', () => {
  test('renderiza la barra de navegación y el footer', () => {
    render(
      <BrowserRouter>
        <AmcaProvider>
          <App />
        </AmcaProvider>
      </BrowserRouter>
    );
    // Verifica que la barra de navegación y el footer estén en el documento
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});