import { Router } from 'express';
import { pool } from '../config/db.js';
import { asyncRoute, pagination } from '../lib/http.js';
import { requirePermission } from '../middleware/auth.js';
const router = Router();
router.get('/', requirePermission('mensajes'), asyncRoute(async (req,res) => {
  const { page, limit, offset } = pagination(req.query);
  const [data] = await pool.query(`SELECT id,remitente_id,destinatario_id,jugador_id,contenido,enviado_en,leido_en
    FROM mensajes_directos WHERE remitente_id = ? OR destinatario_id = ?
    ORDER BY enviado_en DESC,id DESC LIMIT ? OFFSET ?`, [req.auth.id,req.auth.id,limit,offset]);
  res.json({ data, page, limit });
}));
export default router;
