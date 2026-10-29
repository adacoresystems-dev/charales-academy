import { Avatar } from '../common/Avatar';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Check, ChevronDown, Calendar, Shield, ExternalLink, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Coach, NotificationItem } from './types';

interface HeaderProps {
  desktopVisible?: boolean;
  onToggleDesktop?: () => void;
  onLogout?: () => void;
  closing?: boolean;
  onToggleSidebar: () => void;
  activeCoach: Coach;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onOpenNotificationsTab: () => void;
  onSwitchRole?: (role: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  desktopVisible,
  onToggleDesktop,
  onLogout,
  closing,
  activeCoach,
  selectedCategory,
  onSelectCategory,
  categories,
  notifications,
  onMarkNotificationAsRead,
  onOpenNotificationsTab,
  onSwitchRole,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-neutral-200 px-4 md:px-6 flex items-center justify-between gap-4 shadow-xs">
      {/* Left zone: Hamburger + Brand + Category */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button onClick={onToggleDesktop} aria-label={desktopVisible ? 'Ocultar menú' : 'Mostrar menú'} aria-expanded={desktopVisible} aria-controls="coach-desktop-navigation" className="hidden md:block p-2 rounded-lg text-slate-600 hover:bg-slate-100">
          {desktopVisible ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
        {/* Brand label & DEMO pill matching screenshot */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-[#111111]">
            Charales
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold rounded-md bg-[#3B59A8] text-white tracking-wider">
            DEMO
          </span>
        </div>

        {/* Category switcher */}
        <div className="hidden sm:flex items-center ml-2">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="appearance-none bg-[#F8F9FA] hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800 py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B59A8] transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right zone: Notification bell + Coach profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onLogout && <button onClick={onLogout} disabled={closing} aria-label="Cerrar sesión" title="Cerrar sesión" className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><LogOut className="w-4 h-4" /></button>}
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E31B23]"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 text-neutral-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#E31B23] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-3.5 bg-[#F8F9FA] border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Notificaciones y Avisos
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-[#E31B23] text-white text-[10px] font-semibold px-2 py-0.2 rounded-full">
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>
                <button
                  onClick={onOpenNotificationsTab}
                  className="text-xs text-[#3B59A8] hover:underline font-semibold flex items-center gap-1"
                >
                  Ver todas
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-500">
                    No hay notificaciones pendientes.
                  </div>
                ) : (
                  notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 hover:bg-neutral-50 transition-colors ${
                        !notif.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          notif.type === 'convocatoria' 
                            ? 'bg-red-100 text-[#E31B23]' 
                            : notif.type === 'asistencia'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-[#3B59A8]'
                        }`}>
                          {notif.type.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {notif.date.split(' ')[1] || notif.date}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-neutral-900 mt-1">
                        {notif.title}
                      </h4>
                      <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                        {notif.message}
                      </p>
                      {!notif.read && (
                        <button
                          onClick={() => onMarkNotificationAsRead(notif.id)}
                          className="mt-2 text-[10px] text-[#3B59A8] hover:text-[#2d4480] font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coach profile info */}
        <div className="flex items-center gap-3 pl-2 border-l border-neutral-200">
          <Avatar src={activeCoach.avatar} name={activeCoach.name} className="w-9 h-9 rounded-full object-cover border-2 border-[#3B59A8]" />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-neutral-900 leading-tight">
              {activeCoach.name}
            </span>
            <span className="text-[10px] font-medium text-neutral-500">
              {activeCoach.title}
            </span>
          </div>
        </div>

        {/* Role Switcher Pill (Switch to other roles) */}
        {onSwitchRole && (
          <div className="relative pl-2 border-l border-neutral-200">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/90 hover:bg-blue-100 border border-blue-200 text-[#3B59A8] text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Cambiar rol activo en el sistema"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-neutral-500 font-medium hidden sm:inline">Rol:</span>
              <span className="font-extrabold text-[#3B59A8]">Entrenador</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#3B59A8] transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-200 p-1.5 z-50 text-xs animate-scaleUp">
                <div className="px-2.5 py-1.5 border-b border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Cambiar Rol Activo
                </div>
                {[
                  { id: 'ADMINISTRADOR', label: 'Admin' },
                  { id: 'SECRETARIA', label: 'Secretaría' },
                  { id: 'ENTRENADOR', label: 'Entrenador' },
                  { id: 'PADRE_TUTOR', label: 'Tutor / Padre' },
                ].map((r) => {
                  const isActive = r.id === 'ENTRENADOR';
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        onSwitchRole(r.id as any);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#E31B23] text-white shadow-md shadow-red-900/30'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{r.label}</span>
                      {isActive && <span className="text-[10px] font-semibold text-white/90">Activo</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
