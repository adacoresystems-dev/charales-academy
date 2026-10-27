import type { User, Role } from '../types';

// El token vive solo en memoria: al recargar se solicita iniciar sesión otra vez.
const API_URL = import.meta.env?.VITE_API_URL || '/api';
let accessToken: string | null = null;
const expiredListeners = new Set<() => void>();
export function onSessionExpired(listener: () => void) {
  expiredListeners.add(listener);
  return () => { expiredListeners.delete(listener); };
}
export function clearSession() {
  accessToken = null;
}
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Ruta de API inválida.');
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  let response: Response;
  try { response = await fetch(`${API_URL}${path}`, { ...options, headers }); }
  catch { throw new Error('No se pudo conectar con el servidor. Comprueba que el backend esté encendido.'); }
  if (response.status === 401 && accessToken) {
    clearSession();
    expiredListeners.forEach(listener => listener());
  }
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `Error HTTP ${response.status}`);
  }
  return response.status === 204 ? undefined as T : response.json();
}

interface Identity {
  id: number | string;
  email: string;
  nombre: string;
  apellido?: string;
  avatar_url?: string;
  roles: string[];
}
export function identityToUser(identity: Identity): User {
  // Prioridad para cuentas con más de un perfil; ningún rol proviene de localStorage.
  const mapping: [string, Role][] = [
    ['ADMINISTRADOR', 'ADMINISTRADOR'], ['SECRETARIA', 'SECRETARIA'],
    ['ENTRENADOR', 'ENTRENADOR'], ['TUTOR', 'PADRE_TUTOR'],
  ];
  const role = mapping.find(([serverRole]) => identity.roles.includes(serverRole))?.[1];
  if (!role) throw new Error('Tu cuenta no tiene un perfil habilitado. Contacta al administrador.');
  return { id: Number(identity.id), email: identity.email,
    nombre: [identity.nombre, identity.apellido].filter(Boolean).join(' '),
    avatarUrl: identity.avatar_url, rol: role, activo: true };
}
export async function login(email: string, password: string) {
  clearSession();
  const result = await apiRequest<{token: string; expiresIn: number; user: Identity}>('/auth/login', {
    method: 'POST', body: JSON.stringify({ email: email.trim(), password }),
  });
  accessToken = result.token;
  try {
    return { user: identityToUser(result.user), expiresIn: result.expiresIn };
  } catch (error) {
    await logout().catch(() => {});
    throw error;
  }
}
export async function logout() {
  try { await apiRequest<void>('/auth/logout', { method: 'POST' }); }
  finally { clearSession(); }
}
