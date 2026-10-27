import bcrypt from 'bcryptjs';
import { pool, withTransaction } from '../config/db.js';

try {
  const email = (process.env.ADMIN_EMAIL || '').trim();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = (process.env.ADMIN_NOMBRE || 'Administrador').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150 ||
      password.length < 12 || Buffer.byteLength(password,'utf8') > 72 || !name || name.length > 100) {
    throw new Error('Configura ADMIN_EMAIL, ADMIN_NOMBRE y ADMIN_PASSWORD (12 caracteres mínimo, 72 bytes máximo) en server/.env.');
  }
  const hash = await bcrypt.hash(password, 12);
  await withTransaction(async db => {
    const [roles] = await db.execute("SELECT id FROM roles WHERE nombre = 'ADMINISTRADOR' AND tipo = 'SEGURIDAD'");
    if (!roles[0]) throw new Error('Importa primero database/charales_completa.sql.');
    await db.execute('INSERT INTO usuarios (rol_id,nombre,email,password_hash) VALUES (?,?,?,?)', [roles[0].id,name,email,hash]);
  });
  console.log('Administrador creado. Retira ADMIN_PASSWORD del archivo de configuración.');
} catch (error) {
  console.error(error.code === 'ER_DUP_ENTRY' ? 'Ese correo ya existe. No se modificó la cuenta.' : (error.code || error.message));
  process.exitCode = 1;
} finally { await pool.end(); }
