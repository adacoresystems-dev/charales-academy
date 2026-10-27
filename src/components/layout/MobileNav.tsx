import React from 'react';
import {
  Users,
  Trophy,
  CreditCard,
  MessageSquare,
  CalendarCheck2,
  LayoutDashboard,
} from 'lucide-react';
import { Role } from '../../types';

interface MobileNavProps {
  currentRole: Role;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'jugadores', label: 'Jugadores', icon: Users },
    { id: 'entrenamientos', label: 'Entrenamientos', icon: CalendarCheck2 },
    { id: 'partidos', label: 'Partidos', icon: Trophy },
    { id: 'pagos', label: 'Pagos', icon: CreditCard },
    { id: 'avisos_reportes', label: 'Avisos', icon: MessageSquare },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-around shadow-lg">
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
            onClick={() => onSelectTab(tab.id)}
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
