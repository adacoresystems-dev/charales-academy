// Cliente de inicio. Las vistas aún utilizan store.ts y mockData.ts (modo demostración).
// No se guarda el token en localStorage. Al recargar, solicitar un nuevo login.
const API_URL = import.meta.env.VITE_API_URL || '/api';
let accessToken: string | null = null;

export function setAccessToken(token: string | null) { accessToken = token; }

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Ruta de API inválida.');
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401) accessToken = null;
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `Error HTTP ${response.status}`);
  }
  return response.status === 204 ? undefined as T : response.json();
}

export async function login(email: string, password: string) {
  const result = await apiRequest<{token: string; user: Record<string, unknown>}>('/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  });
  setAccessToken(result.token);
  return result.user;
}

export async function logout() {
  try { await apiRequest<void>('/auth/logout', { method: 'POST' }); }
  finally { setAccessToken(null); }
}
