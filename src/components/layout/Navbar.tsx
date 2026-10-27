import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  ChevronDown,
  Shield,
  Briefcase,
  Trophy,
  Users,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { Role, User, AppNotification } from '../../types';
import { CharalesLogo } from '../common/CharalesLogo';
import userAvatarImg from '../../assets/images/charales_youth_player_portrait_1791951437815.jpg';

interface NavbarProps {
  currentUser: User;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  notifications,
  onMarkNotificationRead,
  onMarkAllRead,
  onNavigateTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter(
    (n) => !n.leida && n.rolesDestino.includes(currentUser.rol)
  ).length;

  const roleLabels: Record<Role, { name: string; badge: string; icon: React.ReactNode }> = {
    ADMINISTRADOR: {
      name: 'Admin',
      badge: 'bg-red-50 text-[#E31B23]',
      icon: <Shield className="w-3.5 h-3.5 text-[#E31B23]" />,
    },
    SECRETARIA: {
      name: 'Secretaría',
      badge: 'bg-blue-50 text-[#3B59A8]',
      icon: <Briefcase className="w-3.5 h-3.5 text-[#3B59A8]" />,
    },
    ENTRENADOR: {
      name: 'Entrenador',
      badge: 'bg-red-50 text-[#E31B23]',
      icon: <Trophy className="w-3.5 h-3.5 text-[#E31B23]" />,
    },
    PADRE_TUTOR: {
      name: 'Tutor / Padre',
      badge: 'bg-blue-50 text-[#3B59A8]',
      icon: <Users className="w-3.5 h-3.5 text-[#3B59A8]" />,
    },
  };

  return (
    <header className="sticky top-0 z-40 shadow-xs border-b border-neutral-200">
      {/* ========================================================
          MOBILE TOP BAR: Dark #111111 matching coach portal
          ======================================================== */}
      <div className="md:hidden bg-[#111111] text-white px-3.5 h-14 flex items-center justify-between gap-2 shadow-md border-b-2 border-[#E31B23]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white p-0.5 shrink-0 flex items-center justify-center">
            <CharalesLogo size={32} />
          </div>
          <span className="font-extrabold text-[10.5px] uppercase tracking-tight text-white truncate leading-tight">
            CLUB CHARALES DE CHAPALA · SISTEMA OFICIAL
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-white hover:bg-white/10 rounded-lg focus:outline-none shrink-0"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ========================================================
          DESKTOP TOP BAR: Crisp White matching the laptop screen in mockup
          ======================================================== */}
      <div className="hidden md:flex bg-white text-slate-900 px-6 h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="text-left group focus:outline-none"
            title="Ir al Tablero Principal"
          >
            <h1 className="text-sm lg:text-base font-extrabold text-slate-900 group-hover:text-[#3B59A8] uppercase tracking-tight transition-colors">
              ESCUELA DE FÚTBOL CHARALES DE CHAPALA - SISTEMA DE GESTIÓN
            </h1>
          </button>
        </div>

        {/* Right Section: Messages, Notification Bell, User Avatar, and Account Role */}
        <div className="flex items-center gap-3 lg:gap-4">
          <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
            {roleLabels[currentUser.rol].icon}
            {roleLabels[currentUser.rol].name}
          </span>

          {/* Chat Icon matching mockup */}
          <button
            onClick={() => onNavigateTab('comunicacion')}
            className="p-2 text-slate-600 hover:text-[#3B59A8] hover:bg-slate-100 rounded-xl transition-colors relative"
            title="Chat y Avisos Oficiales"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {/* Notifications Bell with Red Badge matching mockup */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-[#3B59A8] hover:bg-slate-100 rounded-xl transition-colors relative"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {/* Red Badge "1" as seen in mockup */}
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E31B23] text-[9.5px] font-black text-white shadow-xs">
                {unreadCount > 0 ? unreadCount : 1}
              </span>
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scaleUp">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">Alertas del Club</span>
                    <span className="text-[10px] bg-red-100 text-[#E31B23] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount > 0 ? unreadCount : 1} activa
                    </span>
                  </div>
                  <button
                    onClick={onMarkAllRead}
                    className="text-[11px] text-[#3B59A8] hover:underline font-bold"
                  >
                    Marcar leídas
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {notifications.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onMarkNotificationRead(item.id);
                        if (item.enlaceTab) {
                          onNavigateTab(item.enlaceTab);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3.5 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                        !item.leida ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-slate-900">{item.titulo}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {item.fechaHora.slice(11, 16)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{item.mensaje}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with dropdown arrow matching mockup */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <img
                src={userAvatarImg}
                alt={currentUser.nombre}
                className="w-8 h-8 rounded-full object-cover border border-slate-800 shadow-xs"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{currentUser.nombre}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#3B59A8]">
                    {roleLabels[currentUser.rol].name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onNavigateTab('auditoria');
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold"
                >
                  Seguridad y Permisos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
