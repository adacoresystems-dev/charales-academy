import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });
const positiveInt = (value, fallback) => {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error('Configuración numérica inválida.');
  return parsed;
};
export const config = {
  host: process.env.HOST || '127.0.0.1',
  port: positiveInt(process.env.PORT, 3001),
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  sessionHours: positiveInt(process.env.SESSION_HOURS, 8),
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: positiveInt(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'charales_app',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'escuela_futbol',
    waitForConnections: true,
    connectionLimit: 10,
    timezone: 'Z',
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: false,
  },
};
