import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { pool } from './config/db.js';
import { authenticate } from './middleware/auth.js';
import { asyncRoute } from './lib/http.js';
import authRoutes from './routes/auth.js';
import routes from './routes/index.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.origin }));
app.use('/api', (req,res,next) => { res.set('Cache-Control','no-store'); next(); });
app.use(express.json({ limit: '256kb' }));
app.get('/api/health', asyncRoute(async (req,res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', database: 'ok' });
}));
app.use('/api/auth', authRoutes);
app.use('/api', authenticate, (req,res,next) => {
  res.set('Cache-Control','no-store');
  next();
}, routes);
app.use((req,res) => res.status(404).json({ error: 'Ruta no implementada. Consulta docs/API.md.' }));
app.use((error,req,res,next) => {
  if (res.headersSent) return next(error);
  let status = error.status || 500;
  if (error.code === 'ER_DUP_ENTRY') status = 409;
  if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') status = 400;
  if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_BAD_DB_ERROR') status = 503;
  const message = status === 503 ? 'Base de datos no disponible. Revisa la configuración del servidor.'
    : status === 409 ? 'Ya existe un registro con esos datos.'
    : status >= 500 ? 'Error interno del servidor.'
    : error.expose || error.status ? (error.type === 'entity.parse.failed' ? 'JSON inválido.' : error.message)
    : 'No se pudo guardar el registro.';
  if (status >= 500) console.error('Error de servidor:', error.code || error.name);
  res.status(status).json({ error: message });
});
