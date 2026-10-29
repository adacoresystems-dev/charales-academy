import React from 'react';
import {
  Users,
  Trophy,
  CreditCard,
  MessageSquare,
  CalendarCheck2,
  LayoutDashboard,
  Menu,
} from 'lucide-react';
import { Role } from '../../types';

interface MobileNavProps {
  currentRole: Role;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMenu?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  onOpenMenu,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'jugadores', label: 'Jugadores', icon: Users },
    { id: 'pagos', label: 'Pagos', icon: CreditCard },
    { id: 'menu', label: 'Más', icon: Menu },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 pt-1 pb-[max(4px,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          activeTab === tab.id ||
          (tab.id === 'jugadores' && activeTab === 'alumnos') ||
          (tab.id === 'entrenamientos' && activeTab === 'asistencia') ||
          (tab.id === 'pagos' && activeTab === 'finanzas') ||
          (tab.id === 'avisos_reportes' && (activeTab === 'comunicacion' || activeTab === 'rendimiento'));

        return (
          <button
            key={tab.id}
            onClick={() => tab.id === 'menu' ? onOpenMenu?.() : onSelectTab(tab.id)}
            aria-label={tab.id === 'menu' ? 'Ver todas las secciones' : tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              isActive ? 'text-[#E31B23] font-black' : 'text-neutral-500 hover:text-[#3B59A8]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[9.5px] mt-0.5 whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
