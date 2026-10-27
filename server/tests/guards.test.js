import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { app } from '../app.js';
import { pool } from '../config/db.js';
import { pagination, id } from '../lib/http.js';
import { requireRoles, requirePermission, tokenHash } from '../middleware/auth.js';

let server, base;
before(async () => {
  server = app.listen(0,'127.0.0.1');
  await once(server,'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); await pool.end(); });

test('no se consultan jugadores sin sesión válida', async () => {
  const result = await fetch(`${base}/api/jugadores`);
  assert.equal(result.status,401);
  assert.equal((await result.json()).error,'Inicia sesión para continuar.');
});
test('no basta enviar un token inventado con formato incorrecto', async () => {
  const result = await fetch(`${base}/api/pagos`, {headers:{Authorization:'Bearer admin'}});
  assert.equal(result.status,401);
});
test('el servidor rechaza JSON mal formado sin revelar SQL', async () => {
  const result = await fetch(`${base}/api/auth/login`, {method:'POST',headers:{'Content-Type':'application/json'},body:'{'});
  assert.equal(result.status,400);
  assert.equal((await result.json()).error,'JSON inválido.');
});
test('un tutor no puede entrar en listas administrativas aunque conozca la URL', () => {
  let error;
  requireRoles('ADMINISTRADOR','SECRETARIA')({auth:{roles:['TUTOR']}},{},e => {error=e;});
  assert.equal(error.status,403);
});
test('un rol permitido sigue necesitando el permiso de la operación', () => {
  let error;
  requirePermission('pagos','cancelar')({auth:{permissions:[{modulo:'pagos',accion:'consultar'}]}},{},e => {error=e;});
  assert.equal(error.status,403);
});
test('la paginación limita tamaño y rechaza entradas inyectadas', () => {
  assert.deepEqual(pagination({page:'2',limit:'10'}),{page:2,limit:10,offset:10});
  for (const query of [{limit:1000},{page:-1},{limit:'10; DROP TABLE usuarios'},{page:Infinity}]) {
    assert.throws(() => pagination(query));
  }
});
test('los identificadores BIGINT conservan precisión y no aceptan SQL', () => {
  assert.equal(id('18446744073709551615'),'18446744073709551615');
  for (const value of ['0','-1','1 OR 1=1','18446744073709551616',null]) assert.throws(() => id(value));
});
test('la BD guarda hash del token, no la credencial reutilizable', () => {
  const token = 'a'.repeat(64);
  assert.match(tokenHash(token),/^[a-f0-9]{64}$/);
  assert.notEqual(tokenHash(token),token);
});
