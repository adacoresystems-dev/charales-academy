import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { pool, withTransaction } from '../config/db.js';
import { config } from '../config/env.js';
import { asyncRoute, HttpError } from '../lib/http.js';
import { authenticate, loadIdentity, tokenHash } from '../middleware/auth.js';

const router = Router();
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20,
  standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta más tarde.' } });
const dummyHash = bcrypt.hashSync(randomBytes(32).toString('hex'), 12);

router.post('/login', loginLimit, asyncRoute(async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
  const password = req.body.password;
  if (!email || email.length > 150 || typeof password !== 'string' || password.length > 200) {
    throw new HttpError(400, 'Indica correo y contraseña válidos.');
  }
  const [rows] = await pool.execute('SELECT id, password_hash, activo FROM usuarios WHERE email = ?', [email]);
  const valid = await bcrypt.compare(password, rows[0]?.password_hash || dummyHash);
  if (!valid || !rows[0]?.activo) throw new HttpError(401, 'Correo o contraseña incorrectos.');
  const identity = await loadIdentity(rows[0].id);
  const token = randomBytes(32).toString('hex');
  await withTransaction(async db => {
    await db.execute(`INSERT INTO sesiones (usuario_id,token_hash,expira_en,ip,user_agent)
      VALUES (?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? HOUR),?,?)`,
    [identity.id, tokenHash(token), config.sessionHours, req.ip || null, (req.get('User-Agent') || '').slice(0,500)]);
    await db.execute(`INSERT INTO auditoria (usuario_id,accion,modulo,entidad,entidad_id,descripcion)
      VALUES (?,'LOGIN','usuarios','usuarios',?,'Inicio de sesión')`, [identity.id, identity.id]);
  });
  res.set('Cache-Control','no-store').json({ token, expiresIn: config.sessionHours * 3600, user: identity });
}));
router.get('/me', authenticate, (req, res) => {
  const { sessionId, ...user } = req.auth;
  res.json({ user });
});
router.post('/logout', authenticate, asyncRoute(async (req, res) => {
  await withTransaction(async db => {
    await db.execute('UPDATE sesiones SET cerrada_en = UTC_TIMESTAMP() WHERE id = ?', [req.auth.sessionId]);
    await db.execute(`INSERT INTO auditoria (usuario_id,accion,modulo,entidad,entidad_id,descripcion)
      VALUES (?,'LOGOUT','usuarios','usuarios',?,'Cierre de sesión')`, [req.auth.id, req.auth.id]);
  });
  res.status(204).end();
}));
export default router;
