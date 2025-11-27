import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
// 1. Importación necesaria para la PWA
import { registerSW } from 'virtual:pwa-register';

const qc = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6C5CE7' },  // acento
    secondary: { main: '#00B894' } // apoyo
  },
  shape: { borderRadius: 12 }
});

// 2. Registro del Service Worker
// Se hace antes del render para iniciar la caché en segundo plano
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      // Se dispara cuando hay una nueva versión desplegada y el usuario debe recargar
      console.log("Nueva versión disponible. Recarga para actualizar.");
    },
    onOfflineReady() {
      // Se dispara cuando la app ya descargó todos los recursos necesarios
      console.log("Aplicación lista para usarse sin conexión.");
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);