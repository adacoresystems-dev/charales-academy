import { Router } from 'express';
import { pool, withTransaction } from '../config/db.js';
import { asyncRoute, HttpError, pagination, id } from '../lib/http.js';
import { requirePermission, requireRoles } from '../middleware/auth.js';

const router = Router();
const states = ['PRESENTE','AUSENTE','RETARDO','JUSTIFICADO'];
router.get('/', requireRoles('ADMINISTRADOR','SECRETARIA'), requirePermission('asistencias'), asyncRoute(async (req,res) => {
  const { page, limit, offset } = pagination(req.query);
  const [data] = await pool.query('SELECT * FROM asistencias ORDER BY registrado_en DESC,id DESC LIMIT ? OFFSET ?', [limit,offset]);
  res.json({ data, page, limit });
}));

router.post('/', requireRoles('ADMINISTRADOR','SECRETARIA','ENTRENADOR'), requirePermission('asistencias','crear'), asyncRoute(async (req,res) => {
  const sessionId = id(req.body.sesion_id);
  const entries = req.body.registros;
  if (!Array.isArray(entries) || entries.length === 0 || entries.length > 200) {
    throw new HttpError(400, 'Envía entre 1 y 200 registros.');
  }
  const seen = new Set();
  const records = entries.map(entry => {
    if (!entry || typeof entry !== 'object') throw new HttpError(400,'Registro inválido.');
    const playerId = id(entry.jugador_id);
    if (seen.has(playerId)) throw new HttpError(400,'Hay jugadores repetidos en el lote.');
    seen.add(playerId);
    if (!states.includes(entry.estado)) throw new HttpError(400,'Estado de asistencia inválido.');
    if (entry.observaciones != null && (typeof entry.observaciones !== 'string' || entry.observaciones.length > 255)) {
      throw new HttpError(400,'Observación inválida; máximo 255 caracteres.');
    }
    return { playerId, state: entry.estado, notes: entry.observaciones || null };
  });
  await withTransaction(async db => {
    const [sessions] = await db.execute(`SELECT id,categoria_id,fecha,estado,fecha > UTC_DATE() AS futura
      FROM sesiones_entrenamiento WHERE id = ? FOR UPDATE`, [sessionId]);
    const session = sessions[0];
    if (!session) throw new HttpError(404,'Sesión no encontrada.');
    if (session.estado === 'CANCELADO' || session.futura) throw new HttpError(409,'La sesión está cancelada o aún no ocurre.');
    const administrative = req.auth.roles.some(r => ['ADMINISTRADOR','SECRETARIA'].includes(r));
    if (!administrative) {
      const [assigned] = await db.execute(`SELECT ec.id FROM entrenador_categoria ec
        JOIN entrenadores e ON e.id=ec.entrenador_id AND e.activo=TRUE
        WHERE e.usuario_id=? AND ec.categoria_id=? AND ec.activo=TRUE
        AND ec.fecha_inicio <= ? AND (ec.fecha_fin IS NULL OR ec.fecha_fin >= ?)`,
      [req.auth.id,session.categoria_id,session.fecha,session.fecha]);
      if (!assigned.length) throw new HttpError(403,'No estás asignado a esa categoría.');
    }
    for (const record of records) {
      const [members] = await db.execute(`SELECT id FROM jugador_categoria WHERE jugador_id=? AND categoria_id=?
        AND fecha_inicio <= ? AND (fecha_fin IS NULL OR fecha_fin >= ?)`,
      [record.playerId,session.categoria_id,session.fecha,session.fecha]);
      if (!members.length) throw new HttpError(400,`El jugador ${record.playerId} no pertenece a la categoría en esa fecha.`);
      await db.execute(`INSERT INTO asistencias (sesion_entrenamiento_id,jugador_id,estado,observaciones,registrado_por)
        VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE estado=VALUES(estado),observaciones=VALUES(observaciones),
        registrado_por=VALUES(registrado_por)`, [sessionId,record.playerId,record.state,record.notes,req.auth.id]);
    }
    await db.execute("UPDATE sesiones_entrenamiento SET estado='REALIZADO' WHERE id=?", [sessionId]);
    await db.execute(`INSERT INTO auditoria (usuario_id,accion,modulo,entidad,entidad_id,descripcion,datos_nuevos)
      VALUES (?,'EDITAR','asistencias','sesiones_entrenamiento',?,'Registro de asistencia',?)`,
    [req.auth.id,sessionId,JSON.stringify(records)]);
  });
  res.json({ guardados: records.length });
}));
export default router;
