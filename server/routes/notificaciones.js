import { Router } from 'express';
import { pool } from '../config/db.js';
import { asyncRoute, pagination, id } from '../lib/http.js';
import { requirePermission } from '../middleware/auth.js';
const router = Router();
router.get('/', requirePermission('notificaciones'), asyncRoute(async (req,res) => {
  const { page, limit, offset } = pagination(req.query);
  const [data] = await pool.query(`SELECT n.id,n.titulo,n.mensaje,n.tipo,n.enlace_tab,n.jugador_id,n.creado_en,nu.leida_en
    FROM notificaciones n JOIN notificacion_usuario nu ON nu.notificacion_id = n.id
    WHERE nu.usuario_id = ? ORDER BY n.creado_en DESC,n.id DESC LIMIT ? OFFSET ?`, [req.auth.id,limit,offset]);
  res.json({ data, page, limit });
}));
router.patch('/:id/leida', requirePermission('notificaciones','editar'), asyncRoute(async (req,res) => {
  // La propiedad se valida dentro del UPDATE; no se acepta usuario_id del cliente.
  await pool.execute(`UPDATE notificacion_usuario SET leida_en = COALESCE(leida_en,UTC_TIMESTAMP())
    WHERE notificacion_id = ? AND usuario_id = ?`, [id(req.params.id),req.auth.id]);
  res.status(204).end();
}));
export default router;
