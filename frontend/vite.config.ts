import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,              // permite acceder desde el móvil en la red local
    port: 5173,              // opcional: fija el puerto
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000', // backend express
        changeOrigin: true,              // ajusta el host de la cabecera
        secure: false,                   // por si usas https self-signed en local (no suele aplicar)
        // rewrite: (p) => p,            // no reescribimos la ruta; /api/* llega igual al backend
      },
    },
  },
});
