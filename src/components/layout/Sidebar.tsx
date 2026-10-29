import React from 'react';
import { Users, Layers, UserCheck, CalendarCheck2, Trophy, CreditCard, Shirt, MessageSquare, LayoutDashboard, PanelLeftClose, PanelLeftOpen, ShieldCheck } from 'lucide-react';
import { Role } from '../../types';
import { CharalesLogo } from '../common/CharalesLogo';

interface SidebarProps {
  currentRole: Role;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  compact?: boolean;
  mobile?: boolean;
  onToggleCompact?: () => void;
}

const items = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, aliases: [] },
  { id: 'jugadores', label: 'Jugadores y tutores', icon: Users, aliases: ['alumnos'] },
  { id: 'categorias', label: 'Categorías', icon: Layers, aliases: [] },
  { id: 'entrenadores', label: 'Entrenadores', icon: UserCheck, aliases: [] },
  { id: 'entrenamientos', label: 'Entrenamientos', icon: CalendarCheck2, aliases: ['asistencia'] },
  { id: 'partidos', label: 'Torneos y partidos', icon: Trophy, aliases: [] },
  { id: 'pagos', label: 'Pagos y cobranza', icon: CreditCard, aliases: ['finanzas'] },
  { id: 'uniformes', label: 'Uniformes', icon: Shirt, aliases: ['inventario'] },
  { id: 'avisos_reportes', label: 'Avisos y reportes', icon: MessageSquare, aliases: ['comunicacion', 'rendimiento'] },
];

export function Sidebar({ currentRole, activeTab, onSelectTab, compact = false, mobile = false, onToggleCompact }: SidebarProps) {
  const navigation = currentRole === 'ADMINISTRADOR'
    ? [...items, { id: 'auditoria', label: 'Auditoría', icon: ShieldCheck, aliases: [] }]
    : items;
  return (
    <aside id={mobile ? 'mobile-navigation' : 'desktop-navigation'} aria-label="Navegación principal"
      className={`club-sidebar flex flex-col text-white ${mobile ? 'h-full w-full' : `sticky top-16 h-[calc(100dvh-4rem)] ${compact ? 'w-20' : 'w-64'}`}`}>
      <button onClick={() => onSelectTab('dashboard')} title="Charales de Chapala · Inicio"
        className={`flex items-center gap-3 border-b border-white/10 py-6 ${compact ? 'justify-center px-2' : 'px-5 text-left'}`}>
        <span className="bg-white rounded-xl p-1 shrink-0"><CharalesLogo size={40} /></span>
        {!compact && <span><span className="block text-sm font-extrabold tracking-wide">CHARALES</span><span className="block mt-1 text-[10px] text-slate-400 tracking-[0.18em] uppercase">De Chapala · Academia</span></span>}
      </button>
      <nav className={`flex-1 overflow-y-auto overscroll-contain py-5 space-y-1 ${compact ? 'px-3' : 'px-3.5'}`}>
        {!compact && <p className="px-3 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">Tu academia</p>}
        {navigation.map(({ id, label, icon: Icon, aliases }) => {
          const active = id === activeTab || aliases.includes(activeTab);
          return <button key={id} onClick={() => onSelectTab(id)} title={compact ? label : undefined}
            aria-label={label} aria-current={active ? 'page' : undefined}
            className={`group w-full flex items-center gap-3 rounded-xl py-3 text-[13px] transition-colors ${compact ? 'justify-center px-2' : 'px-3'} ${active ? 'bg-[#E31B23] text-white shadow-lg shadow-red-950/25' : 'text-slate-400 hover:bg-white/7 hover:text-white'}`}>
            <Icon className="w-[19px] h-[19px] shrink-0" />
            {!compact && <span className="text-left font-semibold">{label}</span>}
            {!compact && active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full shrink-0" />}
          </button>;
        })}
      </nav>
      {!mobile && <button onClick={onToggleCompact} aria-label={compact ? 'Ampliar menú' : 'Compactar menú'} title={compact ? 'Ampliar menú' : 'Compactar menú'}
        className={`flex items-center gap-3 border-t border-white/10 p-5 text-xs text-slate-400 hover:text-white hover:bg-white/5 ${compact ? 'justify-center' : ''}`}>
        {compact ? <PanelLeftOpen className="w-5 h-5" /> : <><PanelLeftClose className="w-5 h-5" /><span>Compactar menú</span></>}
      </button>}
      {!compact && <div className="px-6 py-4 text-[10px] tracking-wider text-slate-500 border-t border-white/5">FORMACIÓN · EQUIPO · COMUNIDAD</div>}
    </aside>
  );
}
export default Sidebar;
