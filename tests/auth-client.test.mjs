import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createRequire } from 'node:module';
const { build } = createRequire(import.meta.resolve('vite'))('esbuild');
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

const source = readFileSync(new URL('../src/services/api.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const api = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const originalFetch = globalThis.fetch;
const identity = { id: '24', nombre: 'Cuenta', apellido: 'Demo', email: 'cuenta@example.test', roles: ['ADMINISTRADOR'] };
function response(body, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(body), { status });
}
function accepted(user = identity) { return response({ token: 'a'.repeat(64), expiresIn: 28800, user }); }

test.afterEach(() => { api.clearSession(); globalThis.fetch = originalFetch; });

test('envía credenciales, toma la identidad del servidor y adjunta el token a futuras consultas', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1 ? accepted() : response({ user: identity });
  };
  const session = await api.login('  cuenta@example.test  ', '  clave con espacios  ');
  assert.equal(session.user.id, 24);
  assert.equal(session.user.nombre, 'Cuenta Demo');
  assert.equal(session.user.rol, 'ADMINISTRADOR');
  assert.equal(session.expiresIn, 28800);
  assert.deepEqual(JSON.parse(calls[0].options.body), { email: identity.email, password: '  clave con espacios  ' });
  assert.equal(calls[0].options.headers.get('Authorization'), null);
  await api.apiRequest('/auth/me');
  assert.equal(calls[1].options.headers.get('Authorization'), `Bearer ${'a'.repeat(64)}`);
});

test('credenciales incorrectas muestran el error sin notificar una expiración inexistente', async () => {
  let expired = false;
  const unsubscribe = api.onSessionExpired(() => { expired = true; });
  try {
    globalThis.fetch = async () => response({ error: 'Correo o contraseña incorrectos.' }, 401);
    await assert.rejects(api.login(identity.email, 'incorrecta'), /Correo o contraseña incorrectos/);
    assert.equal(expired, false);
  } finally { unsubscribe(); }
});

test('una sesión rechazada se elimina y avisa a la pantalla de acceso', async () => {
  let expired = 0;
  const unsubscribe = api.onSessionExpired(() => { expired++; });
  try {
    globalThis.fetch = async () => accepted();
    await api.login(identity.email, 'clave de prueba');
    globalThis.fetch = async () => response({ error: 'Sesión expirada.' }, 401);
    await assert.rejects(api.apiRequest('/auth/me'), /Sesión expirada/);
    assert.equal(expired, 1);
    globalThis.fetch = async (_url, options) => {
      assert.equal(options.headers.get('Authorization'), null);
      return response({});
    };
    await api.apiRequest('/auth/me');
  } finally { unsubscribe(); }
});

test('cerrar sesión revoca en el backend y retira el token incluso si falla la red', async () => {
  globalThis.fetch = async () => accepted();
  await api.login(identity.email, 'clave de prueba');
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/auth/logout');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.get('Authorization'), `Bearer ${'a'.repeat(64)}`);
    return response(null, 204);
  };
  await api.logout();
  globalThis.fetch = async () => accepted();
  await api.login(identity.email, 'clave de prueba');
  globalThis.fetch = async () => { throw new TypeError('network'); };
  await assert.rejects(api.logout(), /No se pudo conectar/);
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.get('Authorization'), null);
    return response({});
  };
  await api.apiRequest('/auth/me');
});

test('mapea perfiles de MySQL y rechaza cuentas sin perfil admitido', async () => {
  assert.equal(api.identityToUser({ ...identity, roles: ['TUTOR'] }).rol, 'PADRE_TUTOR');
  assert.equal(api.identityToUser({ ...identity, roles: ['ENTRENADOR'] }).rol, 'ENTRENADOR');
  assert.equal(api.identityToUser({ ...identity, roles: ['SECRETARIA', 'TUTOR'] }).rol, 'SECRETARIA');
  assert.equal(api.identityToUser({ ...identity, roles: ['TUTOR', 'ADMINISTRADOR'] }).rol, 'ADMINISTRADOR');
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(url);
    return calls.length === 1 ? accepted({ ...identity, roles: [] }) : response(null, 204);
  };
  await assert.rejects(api.login(identity.email, 'clave de prueba'), /perfil habilitado/);
  assert.deepEqual(calls, ['/api/auth/login', '/api/auth/logout']);
});

test('el formulario inicial solicita credenciales y no ofrece acceso demo ni cambio de rol', async () => {
  const result = await build({ entryPoints: ['src/App.tsx'], bundle: true,
    write: false, format: 'esm', platform: 'node', packages: 'external',
    define: { 'import.meta.env': '{}' }, jsx: 'automatic', loader: { '.jpg': 'empty' } });
  // Se coloca junto a node_modules para resolver React al importar el módulo compilado.
  const { writeFile, unlink } = await import('node:fs/promises');
  const path = new URL('../.auth-view-test.mjs', import.meta.url);
  try {
    await writeFile(path, result.outputFiles[0].text);
    const { default: App } = await import(path.href);
    // Incluso con un administrador demo guardado, la entrada exige autenticación.
    globalThis.localStorage = { getItem: () => JSON.stringify({ id: 1, rol: 'ADMINISTRADOR', nombre: 'Admin demo' }) };
    const html = renderToStaticMarkup(React.createElement(App));
    assert.match(html, /type="email"/);
    assert.match(html, /type="password"/);
    assert.match(html, /autocomplete="current-password"/i);
    assert.match(html, /Iniciar sesión/);
    assert.doesNotMatch(html, /Cambiar Rol|Acceso demo|Tablero Principal/);
  } finally { delete globalThis.localStorage; await unlink(path).catch(() => {}); }
});
