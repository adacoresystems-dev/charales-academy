import React from 'react';
import {
  Users,
  Layers,
  UserCheck,
  CalendarCheck2,
  Trophy,
  CreditCard,
  Shirt,
  MessageSquare,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';
import { Role } from '../../types';
import { CharalesLogo } from '../common/CharalesLogo';

interface SidebarProps {
  currentRole: Role;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  hasDropdown?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
}) => {
  // Las 8 opciones oficiales del menú solicitadas por el usuario, todas en español:
  const navItems: NavItem[] = [
    {
      id: 'jugadores',
      label: 'Jugadores y Tutores',
      sublabel: 'Alumnos, tutores y expedientes',
      icon: Users,
    },
    {
      id: 'categorias',
      label: 'Categorías',
      sublabel: 'Planteles, edades y cupos',
      icon: Layers,
    },
    {
      id: 'entrenadores',
      label: 'Entrenadores',
      sublabel: 'Cuerpo técnico y licencias',
      icon: UserCheck,
    },
    {
      id: 'entrenamientos',
      label: 'Entrenamientos',
      sublabel: 'Sesiones y pases de lista',
      icon: CalendarCheck2,
    },
    {
      id: 'partidos',
      label: 'Torneos, Ligas y Partidos',
      sublabel: 'Calendario, jornadas y resultados',
      icon: Trophy,
    },
    {
      id: 'pagos',
      label: 'Pagos y Cobranza',
      sublabel: 'Mensualidades y cobranza',
      icon: CreditCard,
    },
    {
      id: 'uniformes',
      label: 'Uniformes',
      sublabel: 'Kits oficiales y pedidos',
      icon: Shirt,
    },
    {
      id: 'avisos_reportes',
      label: 'Avisos y Reportes',
      sublabel: 'Comunicados y evaluaciones',
      icon: MessageSquare,
    },
  ];

  return (
    <aside className="w-64 bg-[#111111] text-white flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 shadow-lg z-20 border-r border-neutral-800 relative overflow-hidden">
      {/* Dynamic Sport Stripes in sidebar background bottom corner (matching coach portal colorimetry) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-36 opacity-85 z-0">
        <svg className="w-full h-full" viewBox="0 0 288 160" preserveAspectRatio="none" fill="none">
          <path d="M-20 180 L180 20 L220 20 L20 180 Z" fill="#E31B23" fillOpacity="0.85" />
          <path d="M20 180 L220 20 L250 20 L50 180 Z" fill="#3B59A8" fillOpacity="0.9" />
        </svg>
      </div>

      {/* Top Header & Club Crest */}
      <div className="pt-5 pb-3 px-3 flex flex-col items-center justify-center border-b border-white/10 select-none relative z-10">
        <button
          onClick={() => onSelectTab('dashboard')}
          className="group flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 focus:outline-none"
          title="Ver Tablero Principal"
        >
          <div className="w-18 h-18 rounded-full bg-white p-1 flex items-center justify-center shadow-lg overflow-hidden border-2 border-white/90 ring-2 ring-white/20">
            <img
              src="/public/assets/aistudio/logo_b0fcde7b.jpg"
              alt="Logo Oficial Charales de Chapala"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                const currentSrc = e.currentTarget.getAttribute('src');
                if (currentSrc?.startsWith('/public/')) {
                  e.currentTarget.src = '/assets/aistudio/logo_b0fcde7b.jpg';
                } else {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-logo');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }
              }}
            />
            <div className="fallback-logo hidden items-center justify-center w-full h-full">
              <CharalesLogo size={68} />
            </div>
          </div>
          <span className="text-[12px] font-black tracking-wider uppercase text-white mt-2">
            Charales de Chapala
          </span>
          <span className="text-[9.5px] font-extrabold text-[#E31B23] tracking-widest uppercase">
            A.C. · Jalisco, México
          </span>
        </button>

        {/* Quick Link to Tablero Principal */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`mt-2.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#E31B23] text-white shadow-md shadow-red-900/30'
              : 'text-neutral-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Tablero Principal</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto relative z-10 custom-scrollbar">
        <div className="px-3 pb-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
          Menú Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'jugadores' && activeTab === 'alumnos') ||
            (item.id === 'entrenamientos' && activeTab === 'asistencia') ||
            (item.id === 'pagos' && activeTab === 'finanzas') ||
            (item.id === 'uniformes' && activeTab === 'inventario') ||
            (item.id === 'avisos_reportes' && (activeTab === 'comunicacion' || activeTab === 'rendimiento' || activeTab === 'auditoria'));

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#E31B23] text-white shadow-md shadow-red-900/30 font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-neutral-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Support Info */}
      <div className="p-3.5 border-t border-white/10 bg-black/50 backdrop-blur-xs text-[11px] text-neutral-300 space-y-1 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Ciclo Activo</span>
          <span className="font-bold text-white">Apertura 2026</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Identidad</span>
          <span className="font-extrabold text-[#E31B23]">Formativa Oficial</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
