import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { app } from '../app.js';

test('integración en MariaDB: acceso, propiedad, transacciones y restricciones', {
  skip: process.env.RUN_DB_TESTS !== '1' ? 'Requiere BD aislada y RUN_DB_TESTS=1' : false,
}, async t => {
  assert.match(process.env.DB_NAME || '', /_test$/, 'Usa una BD cuyo nombre termine en _test.');
  const [existing] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
  assert.equal(Number(existing[0].total), 0, 'La BD de pruebas debe estar recién importada y sin cuentas.');
  let server;
  try {
    const [schema] = await pool.query(`SELECT COUNT(*) AS total FROM information_schema.tables
      WHERE table_schema=DATABASE() AND table_type='BASE TABLE'`);
    assert.equal(Number(schema[0].total),47);
    const password = 'Solo-pruebas-2026!';
    const hash = await bcrypt.hash(password,12);
    const [roles] = await pool.query('SELECT id,nombre FROM roles');
    const adminRole = roles.find(r=>r.nombre==='ADMINISTRADOR').id;
    const [admin] = await pool.execute('INSERT INTO usuarios (rol_id,nombre,email,password_hash) VALUES (?,?,?,?)', [adminRole,'Prueba Admin','admin@example.test',hash]);
    const [tutorUser] = await pool.execute('INSERT INTO usuarios (email,password_hash) VALUES (?,?)',['tutor@example.test',hash]);
    const [otherUser] = await pool.execute('INSERT INTO usuarios (email,password_hash) VALUES (?,?)',['otro@example.test',hash]);
    const [coachUser] = await pool.execute('INSERT INTO usuarios (email,password_hash) VALUES (?,?)',['coach@example.test',hash]);
    const [tutor] = await pool.execute('INSERT INTO tutores (usuario_id,nombre,apellido_paterno) VALUES (?,?,?)',[tutorUser.insertId,'Tutor','Prueba']);
    const [otherTutor] = await pool.execute('INSERT INTO tutores (usuario_id,nombre,apellido_paterno) VALUES (?,?,?)',[otherUser.insertId,'Otro','Prueba']);
    const [coach] = await pool.execute('INSERT INTO entrenadores (usuario_id,nombre,apellido_paterno) VALUES (?,?,?)',[coachUser.insertId,'Coach','Prueba']);
    const [season] = await pool.query("INSERT INTO temporadas (nombre,fecha_inicio,fecha_fin,es_actual) VALUES ('Prueba','2020-01-01','2099-12-31',TRUE)");
    const [category] = await pool.execute("INSERT INTO categorias (temporada_id,nombre,edad_minima,edad_maxima) VALUES (?,'Sub prueba',1,99)",[season.insertId]);
    const [otherCategory] = await pool.execute("INSERT INTO categorias (temporada_id,nombre,edad_minima,edad_maxima) VALUES (?,'Otra prueba',1,99)",[season.insertId]);
    const [venue] = await pool.query("INSERT INTO sedes (nombre) VALUES ('Sede de prueba')");
    const [player] = await pool.query("INSERT INTO jugadores (identificador,nombre,apellido_paterno,fecha_nacimiento) VALUES ('TEST-A','Jugador','Prueba','2015-01-01')");
    const [otherPlayer] = await pool.query("INSERT INTO jugadores (identificador,nombre,apellido_paterno,fecha_nacimiento) VALUES ('TEST-B','Otro','Prueba','2015-01-01')");
    await pool.execute("INSERT INTO tutor_jugador (tutor_id,jugador_id,parentesco,es_contacto_principal) VALUES (?,?,'Tutor',TRUE),(?,?,'Tutor',TRUE)",[tutor.insertId,player.insertId,otherTutor.insertId,otherPlayer.insertId]);
    await pool.execute("INSERT INTO jugador_categoria (jugador_id,categoria_id,fecha_inicio) VALUES (?,?,'2020-01-01'),(?,?,'2020-01-01')",[player.insertId,category.insertId,otherPlayer.insertId,otherCategory.insertId]);
    await pool.execute("INSERT INTO entrenador_categoria (entrenador_id,categoria_id,fecha_inicio) VALUES (?,?,'2020-01-01')",[coach.insertId,category.insertId]);
    const [session] = await pool.execute("INSERT INTO sesiones_entrenamiento (categoria_id,sede_id,fecha,hora_inicio,hora_fin) VALUES (?,?,'2021-01-01','16:00','17:00')",[category.insertId,venue.insertId]);
    const [noti] = await pool.query("INSERT INTO notificaciones (titulo,mensaje,tipo) VALUES ('Solo otro','Prueba','AVISO')");
    await pool.execute('INSERT INTO notificacion_usuario (notificacion_id,usuario_id) VALUES (?,?)',[noti.insertId,otherUser.insertId]);
    const [notice] = await pool.execute("INSERT INTO avisos (creado_por,titulo,mensaje) VALUES (?,'Privado otro','Prueba')",[admin.insertId]);
    await pool.execute("INSERT INTO aviso_destinatario (aviso_id,tutor_id,tipo_audiencia) VALUES (?,?,'TUTOR')",[notice.insertId,otherTutor.insertId]);

    server=app.listen(0,'127.0.0.1'); await once(server,'listening');
    const base=`http://127.0.0.1:${server.address().port}/api`;
    async function request(path, token, method='GET', body) {
      return fetch(base+path,{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
    }
    async function login(email) {
      const response=await request('/auth/login',null,'POST',{email,password});
      assert.equal(response.status,200,JSON.stringify(await response.clone().json()));
      const result=await response.json(); assert.ok(result.token); return result.token;
    }
    const adminToken=await login('admin@example.test');
    const tutorToken=await login('tutor@example.test');
    const otherToken=await login('otro@example.test');
    const coachToken=await login('coach@example.test');

    await t.test('todas las consultas iniciales ejecutan SQL válido',async()=>{
      for (const path of ['/health','/auth/me','/jugadores','/tutores','/categorias','/temporadas','/sedes','/entrenadores','/inscripciones','/entrenamientos','/horarios','/asistencias','/competencias','/partidos','/clasificacion','/cargos','/pagos','/uniformes','/pedidos','/materiales','/rendimiento','/usuarios','/auditoria','/avisos','/mensajes','/notificaciones']) {
        const response=await request(path,adminToken);
        assert.equal(response.status,200,`${path}: ${await response.clone().text()}`);
      }
    });
    await t.test('tutor y entrenador consultan únicamente sus jugadores',async()=>{
      for (const token of [tutorToken,coachToken]) {
        assert.equal((await request('/jugadores',token)).status,403);
        const {data}=await (await request('/mi-portal/jugadores',token)).json();
        assert.deepEqual(data.map(p=>String(p.id)),[String(player.insertId)]);
      }
      const {data}=await (await request('/mi-portal/jugadores',otherToken)).json();
      assert.deepEqual(data.map(p=>String(p.id)),[String(otherPlayer.insertId)]);
    });
    await t.test('lectura de avisos y notificaciones respeta destinatarios',async()=>{
      assert.equal((await (await request('/avisos',tutorToken)).json()).data.length,0);
      assert.equal((await (await request('/avisos',otherToken)).json()).data.length,1);
      assert.equal((await (await request('/notificaciones',tutorToken)).json()).data.length,0);
      assert.equal((await request(`/notificaciones/${noti.insertId}/leida`,tutorToken,'PATCH')).status,204);
      const [before]=await pool.execute('SELECT leida_en FROM notificacion_usuario WHERE notificacion_id=?',[noti.insertId]);
      assert.equal(before[0].leida_en,null);
      await request(`/notificaciones/${noti.insertId}/leida`,otherToken,'PATCH');
      const [after]=await pool.execute('SELECT leida_en FROM notificacion_usuario WHERE notificacion_id=?',[noti.insertId]);
      assert.ok(after[0].leida_en);
    });
    await t.test('fila inválida revierte asistencia y estado de sesión completos',async()=>{
      const response=await request('/asistencias',coachToken,'POST',{sesion_id:String(session.insertId),registros:[
        {jugador_id:String(player.insertId),estado:'PRESENTE'},
        {jugador_id:String(otherPlayer.insertId),estado:'AUSENTE'}]});
      assert.equal(response.status,400);
      const [rows]=await pool.query('SELECT COUNT(*) AS total FROM asistencias'); assert.equal(Number(rows[0].total),0);
      const [sessions]=await pool.execute('SELECT estado FROM sesiones_entrenamiento WHERE id=?',[session.insertId]);
      assert.equal(sessions[0].estado,'PROGRAMADO');
    });
    await t.test('asistencia válida guarda una fila y permite actualización sin duplicados',async()=>{
      const body={sesion_id:String(session.insertId),registros:[{jugador_id:String(player.insertId),estado:'RETARDO'}]};
      assert.equal((await request('/asistencias',coachToken,'POST',body)).status,200);
      assert.equal((await request('/asistencias',coachToken,'POST',body)).status,200);
      const [rows]=await pool.query('SELECT COUNT(*) AS total FROM asistencias'); assert.equal(Number(rows[0].total),1);
      const [rates]=await pool.query('SELECT porcentaje_asistencia FROM v_asistencia_jugador'); assert.equal(Number(rates[0].porcentaje_asistencia),100);
    });
    await t.test('saldo excluye pagos cancelados y evita aplicar a otro jugador',async()=>{
      const [concept]=await pool.query('SELECT id FROM conceptos_cobro LIMIT 1');
      const [charge]=await pool.execute("INSERT INTO cargos (jugador_id,concepto_id,fecha_cargo,monto_original) VALUES (?,?,UTC_DATE(),100)",[player.insertId,concept[0].id]);
      const [otherCharge]=await pool.execute("INSERT INTO cargos (jugador_id,concepto_id,fecha_cargo,monto_original) VALUES (?,?,UTC_DATE(),100)",[otherPlayer.insertId,concept[0].id]);
      await pool.execute("INSERT INTO descuentos (cargo_id,tipo,motivo,monto_original,monto_ajuste) VALUES (?,'DESCUENTO','Prueba',100,10)",[charge.insertId]);
      const [payment]=await pool.execute("INSERT INTO pagos (folio,jugador_id,importe,forma_pago) VALUES ('TEST-P',?,40,'EFECTIVO')",[player.insertId]);
      await pool.execute('INSERT INTO pago_aplicacion (pago_id,cargo_id,jugador_id,importe_aplicado) VALUES (?,?,?,40)',[payment.insertId,charge.insertId,player.insertId]);
      await assert.rejects(pool.execute('INSERT INTO pago_aplicacion (pago_id,cargo_id,jugador_id,importe_aplicado) VALUES (?,?,?,1)',[payment.insertId,otherCharge.insertId,player.insertId]));
      let [balance]=await pool.execute('SELECT saldo FROM v_estado_cuenta WHERE cargo_id=?',[charge.insertId]); assert.equal(Number(balance[0].saldo),50);
      await pool.execute("UPDATE pagos SET estado='CANCELADO',motivo_cancelacion='Prueba',cancelado_por=?,cancelado_en=UTC_TIMESTAMP() WHERE id=?",[admin.insertId,payment.insertId]);
      [balance]=await pool.execute('SELECT saldo FROM v_estado_cuenta WHERE cargo_id=?',[charge.insertId]); assert.equal(Number(balance[0].saldo),90);
    });
    await t.test('cierre de sesión invalida el token',async()=>{
      assert.equal((await request('/auth/logout',adminToken,'POST')).status,204);
      assert.equal((await request('/auth/me',adminToken)).status,401);
    });
  } finally {
    if (server) await new Promise(resolve=>server.close(resolve));
    await pool.end();
  }
});
