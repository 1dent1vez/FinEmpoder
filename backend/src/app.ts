// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { authRouter } from './routes/auth.js';

export const app = express();

// Middleware base
app.use(cors({
  origin: ['http://localhost:5173'], // tu frontend (Vite)
  credentials: false,
}));
app.use(express.json());             // <<--- IMPORTANTE (req.body)
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'finempoder-api' });
});

// Rutas de la API
app.use('/api/auth', authRouter);

// 404 API
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Manejador de errores (simple)
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[api] unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
