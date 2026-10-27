import React, { useState } from 'react';
import { CharalesLogo } from '../common/CharalesLogo';
import { login } from '../../services/api';
import type { User } from '../../types';

interface Props {
  message: string;
  onLogin: (session: { user: User; expiresIn: number }) => void;
}
export function LoginView({ message, onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const session = await login(email, password);
      setPassword('');
      onLogin(session);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión.');
    } finally { setBusy(false); }
  };
  return <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10 font-sans">
    <section className="w-full max-w-md bg-white rounded-2xl shadow-lg border-t-4 border-[#E31B23] p-7 sm:p-9">
      <div className="text-center mb-7">
        <CharalesLogo size={88} />
        <p className="mt-4 text-sm font-bold tracking-wide text-[#3B59A8]">CHARALES DE CHAPALA</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-slate-600">Ingresa con la cuenta que registraste en el sistema.</p>
      </div>
      {message && <p role="status" className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">{message}</p>}
      <form onSubmit={submit} className="space-y-5" aria-busy={busy}>
        <div>
          <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-2">Correo electrónico</label>
          <input id="login-email" type="email" autoComplete="username" required maxLength={150}
            value={email} onChange={e => setEmail(e.target.value)} disabled={busy}
            className="w-full rounded-lg border border-slate-300 px-3 py-3 focus:outline-2 focus:outline-[#3B59A8]" />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
          <input id="login-password" type="password" autoComplete="current-password" required maxLength={200}
            value={password} onChange={e => setPassword(e.target.value)} disabled={busy}
            className="w-full rounded-lg border border-slate-300 px-3 py-3 focus:outline-2 focus:outline-[#3B59A8]" />
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={busy}
          className="w-full rounded-lg bg-[#3B59A8] text-white font-bold py-3 hover:bg-[#253E7B] disabled:opacity-50">
          {busy ? 'Validando…' : 'Entrar'}
        </button>
      </form>
      <p className="mt-5 text-xs text-slate-500 text-center">Al recargar la página deberás iniciar sesión nuevamente.</p>
    </section>
  </main>;
}
