import { Router } from 'express';
import { pool } from '../config/db.js';
import { asyncRoute, pagination } from '../lib/http.js';
import { requirePermission } from '../middleware/auth.js';
const router = Router();
router.get('/', requirePermission('avisos'), asyncRoute(async (req,res) => {
  const { page, limit, offset } = pagination(req.query);
  const admin = req.auth.roles.some(r => ['ADMINISTRADOR','SECRETARIA'].includes(r));
  const [data] = await pool.query(`SELECT a.* FROM avisos a
    WHERE a.publicado = TRUE
      AND (a.fecha_inicio IS NULL OR a.fecha_inicio <= UTC_TIMESTAMP())
      AND (a.fecha_fin IS NULL OR a.fecha_fin >= UTC_TIMESTAMP())
      AND (? = TRUE OR EXISTS (SELECT 1 FROM aviso_destinatario ad WHERE ad.aviso_id = a.id AND (
        ad.tipo_audiencia = 'GENERAL' OR ad.tutor_id = ? OR ad.entrenador_id = ?
        OR EXISTS (SELECT 1 FROM tutor_jugador tj JOIN jugador_categoria jc ON jc.jugador_id = tj.jugador_id
          WHERE tj.tutor_id = ? AND jc.categoria_id = ad.categoria_id AND jc.activo = TRUE
          AND jc.fecha_inicio <= UTC_DATE() AND (jc.fecha_fin IS NULL OR jc.fecha_fin >= UTC_DATE()))
        OR EXISTS (SELECT 1 FROM entrenador_categoria ec WHERE ec.entrenador_id = ?
          AND ec.categoria_id = ad.categoria_id AND ec.activo = TRUE AND ec.fecha_inicio <= UTC_DATE()
          AND (ec.fecha_fin IS NULL OR ec.fecha_fin >= UTC_DATE()))
      ))) ORDER BY a.fecha_publicacion DESC,a.id DESC LIMIT ? OFFSET ?`,
    [admin,req.auth.tutor_id,req.auth.entrenador_id,req.auth.tutor_id,req.auth.entrenador_id,limit,offset]);
  res.json({ data, page, limit });
}));
export default router;
