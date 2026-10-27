import { createHash } from 'node:crypto';
import { pool } from '../config/db.js';
import { asyncRoute, HttpError } from '../lib/http.js';

export const tokenHash = (token) => createHash('sha256').update(token).digest('hex');

export async function loadIdentity(usuarioId, db = pool) {
  const [users] = await db.execute(`
    SELECT u.id, u.email, u.nombre, u.apellido, u.avatar_url, r.nombre AS rol_seguridad,
      t.id AS tutor_id, e.id AS entrenador_id,
      COALESCE(u.nombre, t.nombre, e.nombre) AS nombre_visible
    FROM usuarios u LEFT JOIN roles r ON r.id = u.rol_id AND r.activo = TRUE
    LEFT JOIN tutores t ON t.usuario_id = u.id
    LEFT JOIN entrenadores e ON e.usuario_id = u.id AND e.activo = TRUE
    WHERE u.id = ? AND u.activo = TRUE`, [usuarioId]);
  const user = users[0];
  if (!user) throw new HttpError(401, 'Sesión no válida.');
  const roles = [user.rol_seguridad, user.tutor_id ? 'TUTOR' : null,
    user.entrenador_id ? 'ENTRENADOR' : null].filter(Boolean);
  const [permissions] = await db.execute(`
    SELECT DISTINCT p.modulo, p.accion FROM permisos p
    JOIN rol_permiso rp ON rp.permiso_id = p.id JOIN roles r ON r.id = rp.rol_id
    WHERE r.activo = TRUE AND r.nombre IN (${roles.map(() => '?').join(',') || 'NULL'})`, roles);
  return { ...user, roles, permissions };
}

export const authenticate = asyncRoute(async (req, res, next) => {
  const match = /^Bearer ([a-f0-9]{64})$/i.exec(req.get('Authorization') || '');
  if (!match) throw new HttpError(401, 'Inicia sesión para continuar.');
  const [rows] = await pool.execute(`SELECT id, usuario_id FROM sesiones
    WHERE token_hash = ? AND cerrada_en IS NULL AND expira_en > UTC_TIMESTAMP()`, [tokenHash(match[1])]);
  if (!rows[0]) throw new HttpError(401, 'Sesión expirada o cerrada.');
  req.auth = await loadIdentity(rows[0].usuario_id);
  req.auth.sessionId = rows[0].id;
  await pool.execute('UPDATE sesiones SET ultimo_uso_en = UTC_TIMESTAMP() WHERE id = ?', [rows[0].id]);
  next();
});

export const requireRoles = (...allowed) => (req, res, next) => {
  if (!req.auth?.roles.some((role) => allowed.includes(role))) {
    return next(new HttpError(403, 'Tu perfil no tiene acceso a esta ruta.'));
  }
  next();
};

export const requirePermission = (modulo, accion = 'consultar') => (req, res, next) => {
  if (!req.auth?.permissions.some(p => p.modulo === modulo && p.accion === accion)) {
    return next(new HttpError(403, 'Operación no permitida.'));
  }
  next();
};
