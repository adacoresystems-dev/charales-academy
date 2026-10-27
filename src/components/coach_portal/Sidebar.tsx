import React from 'react';
import { 
  Home, 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Radar, 
  Calendar, 
  Trophy, 
  Bell, 
  ChevronRight,
  LogOut,
  UserCheck
} from 'lucide-react';
import { ClubLogo } from './ClubLogo';
import { Coach } from './types';

export type NavigationTab = 
  | 'inicio' 
  | 'asistencia' 
  | 'rendimiento' 
  | 'estadisticas' 
  | 'comparativas' 
  | 'sesiones' 
  | 'partidos' 
  | 'avisos';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  activeCoach: Coach;
  allCoaches: Coach[];
  onSelectCoach: (coach: Coach) => void;
  unreadNotifsCount: number;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeCoach,
  allCoaches,
  onSelectCoach,
  unreadNotifsCount,
  isOpen,
  onCloseMobile
}) => {
  const [showCoachMenu, setShowCoachMenu] = React.useState(false);

  const navItems = [
    { id: 'inicio' as NavigationTab, label: 'Inicio', icon: Home, badge: null },
    { id: 'asistencia' as NavigationTab, label: 'Asistencia', icon: CalendarCheck, badge: 'Hoy' },
    { id: 'rendimiento' as NavigationTab, label: 'Rendimiento Técnico', icon: Users, badge: null },
    { id: 'estadisticas' as NavigationTab, label: 'Estadísticas Mensuales', icon: TrendingUp, badge: null },
    { id: 'comparativas' as NavigationTab, label: 'Gráficos Comparativos', icon: Radar, badge: 'Radar' },
    { id: 'sesiones' as NavigationTab, label: 'Actividades & Sesiones', icon: Calendar, badge: null },
    { id: 'partidos' as NavigationTab, label: 'Partidos & Torneos', icon: Trophy, badge: null },
    { id: 'avisos' as NavigationTab, label: 'Avisos & Comunicación', icon: Bell, badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#111111] text-white flex flex-col justify-between
        transition-transform duration-300 ease-in-out border-r border-neutral-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Dynamic Sport Stripes in sidebar background bottom corner (matching provided interface screenshot) */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-40 opacity-90">
          <svg className="w-full h-full" viewBox="0 0 288 160" preserveAspectRatio="none" fill="none">
            <path d="M-20 180 L180 20 L220 20 L20 180 Z" fill="#E31B23" fillOpacity="0.85" />
            <path d="M20 180 L220 20 L250 20 L50 180 Z" fill="#3B59A8" fillOpacity="0.9" />
          </svg>
        </div>

        {/* Top Header & Club Crest */}
        <div className="p-5 border-b border-white/10 relative z-10 flex flex-col items-center text-center">
          <ClubLogo size="lg" className="mb-2 justify-center" />
          <h2 className="text-sm font-bold tracking-wider text-white uppercase mt-1">
            Club Charales Chapala
          </h2>
          <span className="text-[11px] font-semibold text-[#E31B23] tracking-widest uppercase">
            Portal Entrenadores
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto relative z-10 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Menú Principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-[#E31B23] text-white shadow-md shadow-red-900/30 font-semibold' 
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : item.id === 'avisos' 
                        ? 'bg-[#E31B23] text-white' 
                        : 'bg-[#3B59A8] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Coach Profile Card & Switcher */}
        <div className="p-3.5 border-t border-white/10 relative z-10 bg-black/40 backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={() => setShowCoachMenu(!showCoachMenu)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img 
                  src={activeCoach.avatar} 
                  alt={activeCoach.name} 
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-[#3B59A8] shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {activeCoach.name}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {activeCoach.assignedCategories[0]}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${showCoachMenu ? 'rotate-90' : ''}`} />
            </button>

            {/* Coach Switch Dropdown */}
            {showCoachMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1f2c] border border-white/15 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-white/10">
                  Cambiar Entrenador
                </div>
                {allCoaches.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCoach(c);
                      setShowCoachMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors ${
                      c.id === activeCoach.id ? 'bg-[#3B59A8] text-white font-medium' : 'text-neutral-200 hover:bg-white/10'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 shrink-0" />
                    <div className="truncate">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-neutral-300 opacity-80">{c.assignedCategories[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
