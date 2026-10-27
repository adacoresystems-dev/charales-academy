import { Router } from 'express';
import { pool } from '../config/db.js';
import { asyncRoute } from '../lib/http.js';
import { requireRoles } from '../middleware/auth.js';

const router = Router();
router.get('/jugadores', requireRoles('TUTOR','ENTRENADOR'), asyncRoute(async (req, res) => {
  // Un tutor ve sus hijos; un entrenador ve jugadores de sus categorías vigentes.
  // Datos médicos y contacto se exponen únicamente en rutas autorizadas específicas.
  const [data] = await pool.execute(`SELECT DISTINCT j.id, j.identificador, j.nombre,
    j.apellido_paterno, j.apellido_materno, j.fecha_nacimiento, j.foto_url, j.estatus,
    jc.categoria_id, c.nombre AS categoria_nombre
    FROM jugadores j
    LEFT JOIN jugador_categoria jc ON jc.jugador_id = j.id AND jc.activo = TRUE
      AND jc.fecha_inicio <= UTC_DATE() AND (jc.fecha_fin IS NULL OR jc.fecha_fin >= UTC_DATE())
    LEFT JOIN categorias c ON c.id = jc.categoria_id
    WHERE EXISTS (SELECT 1 FROM tutor_jugador tj JOIN tutores t ON t.id = tj.tutor_id
      WHERE tj.jugador_id = j.id AND t.usuario_id = ?)
    OR EXISTS (SELECT 1 FROM entrenador_categoria ec JOIN entrenadores e ON e.id = ec.entrenador_id
      WHERE ec.categoria_id = jc.categoria_id AND e.usuario_id = ? AND e.activo = TRUE
      AND ec.activo = TRUE AND ec.fecha_inicio <= UTC_DATE()
      AND (ec.fecha_fin IS NULL OR ec.fecha_fin >= UTC_DATE()))
    ORDER BY j.apellido_paterno, j.nombre`, [req.auth.id, req.auth.id]);
  res.json({ data });
}));
export default router;
