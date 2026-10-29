import React, { useEffect, useRef, useState } from 'react';
import { Bell, MessageSquare, ChevronDown, Menu, PanelLeftClose, PanelLeftOpen, LogOut, ShieldCheck } from 'lucide-react';
import { Role, User, AppNotification } from '../../types';
import { CharalesLogo } from '../common/CharalesLogo';
interface Props {
  currentUser: User; notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void; onMarkAllRead: () => void;
  onNavigateTab: (tab: string) => void; mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void; sidebarVisible: boolean;
  onToggleSidebar: () => void; onLogout: () => void; closing: boolean;
}
const labels: Record<Role, string> = { ADMINISTRADOR: 'Administración', SECRETARIA: 'Secretaría', ENTRENADOR: 'Entrenador', PADRE_TUTOR: 'Padre / tutor' };
export function Navbar({ currentUser, notifications, onMarkNotificationRead, onMarkAllRead, onNavigateTab, mobileMenuOpen, setMobileMenuOpen, sidebarVisible, onToggleSidebar, onLogout, closing }: Props) {
  const [popover, setPopover] = useState<'notifications' | 'account' | null>(null);
  const root = useRef<HTMLElement>(null);
  const notificationTrigger = useRef<HTMLButtonElement>(null), accountTrigger = useRef<HTMLButtonElement>(null);
  const visible = notifications.filter(n => n.rolesDestino.includes(currentUser.rol));
  const unread = visible.filter(n => !n.leida).length;
  const initials = currentUser.nombre.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  useEffect(() => {
    const outside = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setPopover(null); };
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape' && popover) { setPopover(null); (popover === 'account' ? accountTrigger : notificationTrigger).current?.focus(); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [popover]);
  const iconButton = 'p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900';
  return <header ref={root} className="sticky top-0 z-40 h-16 flex items-center justify-between gap-3 px-4 lg:px-6 bg-white/95 backdrop-blur-lg border-b border-slate-200/80">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:bg-white focus:p-3 focus:shadow-lg">Ir al contenido</a>
    <div className="flex items-center gap-3 min-w-0">
      <button onClick={onToggleSidebar} aria-label={sidebarVisible ? 'Ocultar menú' : 'Mostrar menú'} aria-expanded={sidebarVisible} aria-controls="desktop-navigation" title={sidebarVisible ? 'Ocultar menú' : 'Mostrar menú'} className={`hidden md:flex ${iconButton}`}>
        {sidebarVisible ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}</button>
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Abrir menú" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" className={`md:hidden ${iconButton}`}><Menu className="w-5 h-5" /></button>
      <button onClick={() => onNavigateTab('dashboard')} className="flex items-center gap-2.5 min-w-0 text-left" title="Ir a inicio">
        <span className="md:hidden"><CharalesLogo size={32} /></span><span className="min-w-0"><span className="block text-sm font-extrabold text-slate-900 truncate">Charales de Chapala</span><span className="hidden sm:block text-[11px] text-slate-500 mt-0.5">Gestión de la academia</span></span></button>
    </div>
    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
      <button onClick={() => onNavigateTab('comunicacion')} aria-label="Mensajes y avisos" title="Mensajes y avisos" className={`hidden sm:block ${iconButton}`}><MessageSquare className="w-5 h-5" /></button>
      <button ref={notificationTrigger} onClick={() => setPopover(popover === 'notifications' ? null : 'notifications')} aria-label={`Notificaciones: ${unread} sin leer`} aria-expanded={popover === 'notifications'} aria-controls="notification-panel" className={`relative ${iconButton}`}><Bell className="w-5 h-5" />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-[#E31B23] text-white text-[9px] px-1 flex items-center justify-center">{unread}</span>}</button>
      <div className="hidden sm:block h-7 w-px bg-slate-200 mx-2" />
      <button ref={accountTrigger} onClick={() => setPopover(popover === 'account' ? null : 'account')} aria-label="Mi cuenta" aria-expanded={popover === 'account'} aria-controls="account-panel" className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 text-left">
        <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-[#3B59A8] text-xs font-extrabold">{initials}</span>
        <span className="hidden lg:block max-w-40"><span className="block text-xs font-bold text-slate-800 truncate">{currentUser.nombre}</span><span className="block text-[10px] text-slate-500 mt-0.5">{labels[currentUser.rol]}</span></span><ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" /></button>
    </div>
    {popover === 'notifications' && <section id="notification-panel" aria-label="Notificaciones" className="absolute right-3 sm:right-20 top-[calc(100%+8px)] w-[min(380px,calc(100vw-24px))] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-slate-100"><h2 className="text-sm font-bold">Notificaciones <span className="text-slate-400 font-normal">({unread})</span></h2><button onClick={onMarkAllRead} className="text-[11px] font-semibold text-[#3B59A8]">Marcar leídas</button></div>
      <div className="max-h-[60dvh] overflow-y-auto divide-y divide-slate-100">
        {visible.length === 0 && <p className="text-sm text-slate-500 p-6 text-center">No tienes notificaciones.</p>}
        {visible.map(item => <button key={item.id} onClick={() => { onMarkNotificationRead(item.id); if (item.enlaceTab) onNavigateTab(item.enlaceTab); setPopover(null); }} className={`block w-full text-left p-4 hover:bg-slate-50 ${item.leida ? '' : 'bg-blue-50/50'}`}><p className="text-xs font-bold text-slate-800">{item.titulo}</p><p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.mensaje}</p></button>)}
      </div>
    </section>}
    {popover === 'account' && <section id="account-panel" aria-label="Mi cuenta" className="absolute right-3 sm:right-6 top-[calc(100%+8px)] w-[min(280px,calc(100vw-24px))] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
      <div className="p-3 border-b border-slate-100 mb-1"><p className="font-bold text-sm text-slate-900">{currentUser.nombre}</p><p className="text-xs text-slate-500 mt-1 break-all">{currentUser.email}</p><span className="inline-block mt-2 text-[10px] font-semibold bg-blue-50 text-[#3B59A8] rounded-md px-2 py-1">{labels[currentUser.rol]}</span></div>
      {currentUser.rol === 'ADMINISTRADOR' && <button onClick={() => { onNavigateTab('auditoria'); setPopover(null); }} className="flex items-center gap-2 w-full text-left rounded-xl p-3 text-xs hover:bg-slate-50"><ShieldCheck className="w-4 h-4" />Auditoría y seguridad</button>}
      <button onClick={onLogout} disabled={closing} className="flex items-center gap-2 w-full text-left p-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><LogOut className="w-4 h-4" />{closing ? 'Cerrando…' : 'Cerrar sesión'}</button>
    </section>}
  </header>;
}
