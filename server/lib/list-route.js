import { Router } from 'express';
import { pool } from '../config/db.js';
import { asyncRoute, pagination } from './http.js';
import { requireRoles, requirePermission } from '../middleware/auth.js';

// SQL fijo definido por el desarrollador. Nunca acepta tablas/columnas desde req.
// Estas listas generales son administrativas. Entrenador y tutor usan rutas filtradas.
export function listRoute(module, sql, roles = ['ADMINISTRADOR','SECRETARIA']) {
  const router = Router();
  router.get('/', requireRoles(...roles), requirePermission(module), asyncRoute(async (req, res) => {
    const { page, limit, offset } = pagination(req.query);
    const [data] = await pool.query(`${sql} LIMIT ? OFFSET ?`, [limit, offset]);
    res.json({ data, page, limit });
  }));
  return router;
}
