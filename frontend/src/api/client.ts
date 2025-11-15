// frontend/src/api/client.ts
import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
} from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useAuth } from '../store/auth';

// Base URL: proxy en dev, env en prod
const baseURL =
  import.meta.env.MODE === 'development'
    ? '/api'
    : import.meta.env.VITE_API_URL || 'https://finempoder-api.example.com/api';

const client: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ➜ Añade el token JWT
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuth.getState().token;
    if (token) {
      config.headers = config.headers ?? {};
      // Forzamos indexado de headers a string
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// ➜ Manejo centralizado de errores
client.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('[auth] 401 no autorizado: limpiando sesión');
      // Tu store expone clearAuth, no logout
      useAuth.getState().clearAuth?.();
    } else if ((status ?? 0) >= 500) {
      console.error('[server] Error 5xx del servidor');
    }

    return Promise.reject(error);
  }
);

export default client;
export { client };
