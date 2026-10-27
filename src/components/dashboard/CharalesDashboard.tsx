import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Receipt,
  UserPlus,
  ArrowRight,
  Clock,
  Sparkles,
  Users,
  CalendarCheck2,
  Calendar,
  CreditCard,
  Trophy,
  Layers,
  ShieldCheck,
  Megaphone,
  TrendingUp,
} from 'lucide-react';
import { Player, Charge, Role, Category, Match, TrainingSession } from '../../types';
import { CharalesLogo } from '../common/CharalesLogo';

// High-fidelity Charales youth players portraits
import boyPortrait1 from '../../assets/images/charales_youth_player_portrait_1791951437815.jpg';
import girlPortrait1 from '../../assets/images/charales_girl_player_portrait_1791951454077.jpg';
import boyPortrait2 from '../../assets/images/charales_boy_player_defender_1791951510917.jpg';
import boyPortrait3 from '../../assets/images/charales_boy_player_midfielder_1791951531582.jpg';

interface CharalesDashboardProps {
  players: Player[];
  charges: Charge[];
  categories?: Category[];
  matches?: Match[];
  sessions?: TrainingSession[];
  currentRole: Role;
  onNavigateTab: (tab: string) => void;
  onOpenPlayerModal: (player: Player) => void;
  onOpenPaymentModal: (charge: Charge) => void;
  onOpenNewPlayerModal: () => void;
  onOpenNewTournamentModal?: () => void;
}

export const CharalesDashboard: React.FC<CharalesDashboardProps> = ({
  players,
  charges,
  categories = [],
  matches = [],
  sessions = [],
  currentRole,
  onNavigateTab,
  onOpenPlayerModal,
  onOpenPaymentModal,
  onOpenNewPlayerModal,
  onOpenNewTournamentModal,
}) => {
  // Mobile accordion state
  const [mobileAttendanceOpen, setMobileAttendanceOpen] = useState(true);
  const [mobileRosterOpen, setMobileRosterOpen] = useState(true);
  const [mobilePaymentsOpen, setMobilePaymentsOpen] = useState(true);
  const [mobileSearch, setMobileSearch] = useState('');

  // Expand "Mostrar más" on Upcoming Practices
  const [showAllPractices, setShowAllPractices] = useState(false);

  // Quick interactive attendance toggle state for dashboard
  const [attendanceState, setAttendanceState] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: true,
    6: true,
    7: false,
    8: true,
  });

  const toggleAttendance = (id: number) => {
    setAttendanceState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 8 Player Profiles matching the exact 4x2 grid from mockup
  const playerProfiles = [
    {
      id: 1,
      name: 'Alumno demo 94',
      category: 'Sub-10',
      position: 'Mediocampista',
      photo: boyPortrait1,
      origPlayer: players[0] || players[0],
    },
    {
      id: 2,
      name: 'Alumno demo 95',
      category: 'Sub-8',
      position: 'Delantera',
      photo: girlPortrait1,
      origPlayer: players[1] || players[0],
    },
    {
      id: 3,
      name: 'Alumno demo 96',
      category: 'Sub-12',
      position: 'Portero',
      photo: boyPortrait2,
      origPlayer: players[2] || players[0],
    },
    {
      id: 4,
      name: 'Alumno demo 97',
      category: 'Sub-10',
      position: 'Defensa Central',
      photo: boyPortrait3,
      origPlayer: players[3] || players[0],
    },
    {
      id: 5,
      name: 'Alumno demo 98',
      category: 'Sub-8',
      position: 'Mediocampista',
      photo: girlPortrait1,
      origPlayer: players[4] || players[0],
    },
    {
      id: 6,
      name: 'Alumno demo 99',
      category: 'Sub-12',
      position: 'Extremo Izquierdo',
      photo: boyPortrait1,
      origPlayer: players[5] || players[0],
    },
    {
      id: 7,
      name: 'Alumno demo 100',
      category: 'Sub-14',
      position: 'Defensa Lateral',
      photo: boyPortrait2,
      origPlayer: players[0] || players[0],
    },
    {
      id: 8,
      name: 'Alumno demo 101',
      category: 'Sub-8',
      position: 'Delantera',
      photo: girlPortrait1,
      origPlayer: players[1] || players[0],
    },
  ];

  // Upcoming Practices list in Spanish
  const upcomingPracticesList = [
    { id: 1, name: 'Alumno demo 01', photo: boyPortrait1, category: 'Sub-10' },
    { id: 2, name: 'Alumno demo 02', photo: girlPortrait1, category: 'Sub-8' },
    { id: 3, name: 'Alumno demo 03', photo: boyPortrait2, category: 'Sub-12' },
    { id: 4, name: 'Alumno demo 102', photo: boyPortrait3, category: 'Sub-10' },
    { id: 5, name: 'Alumno demo 103', photo: boyPortrait1, category: 'Sub-12' },
    { id: 6, name: 'Alumno demo 104', photo: girlPortrait1, category: 'Sub-8' },
    { id: 7, name: 'Alumno demo 105', photo: boyPortrait2, category: 'Sub-14' },
    { id: 8, name: 'Alumno demo 106', photo: girlPortrait1, category: 'Sub-8' },
  ];

  // Payments & Fees table matching mockup with Spanish labels & status
  const paymentRows = [
    {
      id: 1,
      playerName: 'Alumno demo 01',
      status: 'Pagado',
      amount: '$650.00',
      statusType: 'paid',
      charge: charges[0],
    },
    {
      id: 2,
      playerName: 'Alumno demo 02',
      status: 'Pendiente',
      amount: '$650.00',
      statusType: 'pending',
      charge: charges[1] || charges[0],
    },
    {
      id: 3,
      playerName: 'Alumno demo 03',
      status: 'Vencido',
      amount: '$650.00',
      statusType: 'overdue',
      charge: charges[2] || charges[0],
    },
    {
      id: 4,
      playerName: 'Alumno demo 102',
      status: 'Vencido',
      amount: '$350.00',
      statusType: 'overdue',
      charge: charges[3] || charges[0],
    },
    {
      id: 5,
      playerName: 'Alumno demo 103',
      status: 'Pagado',
      amount: '$650.00',
      statusType: 'paid',
      charge: charges[4] || charges[0],
    },
  ];

  // Filtered lists for mobile search
  const filteredPractices = upcomingPracticesList.filter((p) =>
    p.name.toLowerCase().includes(mobileSearch.toLowerCase())
  );
  const filteredPayments = paymentRows.filter((p) =>
    p.playerName.toLowerCase().includes(mobileSearch.toLowerCase())
  );
  const filteredProfiles = playerProfiles.filter((p) =>
    p.name.toLowerCase().includes(mobileSearch.toLowerCase())
  );

  // Indicators calculations
  const activePlayersCount = players.filter((p) => p.estatus === 'ACTIVO').length || players.length;
  const categoriesCount = categories.length || 4;
  const matchesCount = matches.length || 6;
  const paidChargesCount = charges.filter((c) => c.estado === 'PAGADO').length;
  const totalChargesCount = charges.length || 1;
  const collectionRate = Math.round((paidChargesCount / totalChargesCount) * 100) || 88;

  return (
    <div className="space-y-6">
      {/* ========================================================
          SECCIÓN 1: INDICADORES CLAVE (KPIS)
          ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Alumnos Inscritos */}
        <div
          onClick={() => onNavigateTab('jugadores')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-[#3B59A8]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Alumnos Inscritos
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3B59A8] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {activePlayersCount}
              </span>
              <span className="text-xs font-bold text-emerald-600">Activos</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Plantel oficial ciclo 2026</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>

        {/* KPI 2: Asistencia Promedio */}
        <div
          onClick={() => onNavigateTab('entrenamientos')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-emerald-400/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Asistencia en Cancha
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                94%
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Regular
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Pase de lista al día</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>

        {/* KPI 3: Cobranza del Mes */}
        <div
          onClick={() => onNavigateTab('pagos')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-[#3B59A8]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cobranza y Mensualidades
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                {collectionRate}%
              </span>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Al corriente
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Control de ingresos activo</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>

        {/* KPI 4: Torneos y Partidos */}
        <div
          onClick={() => onNavigateTab('partidos')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-amber-400/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Torneos y Ligas
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {matchesCount}
              </span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Jornadas
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>{categoriesCount} categorías en juego</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          SECCIÓN 2: ACCESOS RÁPIDOS
          ======================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#3B59A8]" />
            <span>Accesos Rápidos</span>
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">Acciones directas del club</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={onOpenNewPlayerModal}
            className="p-3 bg-red-50 hover:bg-red-100 text-[#E31B23] rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-2 border border-red-100 cursor-pointer group shadow-2xs"
          >
            <UserPlus className="w-4 h-4 text-[#E31B23] group-hover:scale-110 transition-transform" />
            <span>+ Inscribir Alumno</span>
          </button>

          <button
            onClick={() => onNavigateTab('entrenamientos')}
            className="p-3 bg-blue-50 hover:bg-blue-100 text-[#3B59A8] rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-2 border border-blue-100 cursor-pointer group shadow-2xs"
          >
            <CalendarCheck2 className="w-4 h-4 text-[#3B59A8] group-hover:scale-110 transition-transform" />
            <span>Pase de Lista</span>
          </button>

          <button
            onClick={() => onNavigateTab('pagos')}
            className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-2 border border-emerald-100 cursor-pointer group shadow-2xs"
          >
            <Receipt className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>Registrar Cobro</span>
          </button>

          {currentRole === 'ADMINISTRADOR' && onOpenNewTournamentModal ? (
            <button
              onClick={onOpenNewTournamentModal}
              className="p-3 bg-red-50 hover:bg-red-100 text-[#E31B23] rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-2 border border-red-200 cursor-pointer group shadow-2xs"
            >
              <Trophy className="w-4 h-4 text-[#E31B23] group-hover:scale-110 transition-transform" />
              <span>+ Agregar Liga / Torneo</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('partidos')}
              className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-2 border border-amber-100 cursor-pointer group shadow-2xs"
            >
              <Trophy className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              <span>Partidos y Ligas</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('partidos')}
            className="p-3 bg-blue-50 hover:bg-blue-100 text-[#3B59A8] rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-2 border border-blue-100 cursor-pointer group shadow-2xs"
          >
            <Calendar className="w-4 h-4 text-[#3B59A8] group-hover:scale-110 transition-transform" />
            <span>Calendario de Juegos</span>
          </button>

          <button
            onClick={() => onNavigateTab('jugadores')}
            className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-2 border border-slate-200 cursor-pointer group shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#3B59A8] group-hover:scale-110 transition-transform" />
            <span>Credenciales Oficiales</span>
          </button>

          <button
            onClick={() => onNavigateTab('avisos_reportes')}
            className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-2 border border-indigo-100 cursor-pointer group shadow-2xs"
          >
            <Megaphone className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span>Publicar Aviso</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW (Shown on phones < 768px, matching mobile layout in Spanish)
          ======================================================== */}
      <div className="md:hidden space-y-4">
        {/* Mobile Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={mobileSearch}
            onChange={(e) => setMobileSearch(e.target.value)}
            placeholder="Buscar alumno, asistencia o pago..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
          />
        </div>

        {/* 1. Mobile Accordion: Asistencia Reciente */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <button
            onClick={() => setMobileAttendanceOpen(!mobileAttendanceOpen)}
            className="w-full px-4 py-3 flex items-center justify-between font-bold text-xs text-slate-900 border-b border-slate-100 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-[#3B59A8]" />
              <span>Asistencia Reciente en Cancha</span>
            </span>
            {mobileAttendanceOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {mobileAttendanceOpen && (
            <div className="p-3 space-y-2.5">
              {filteredPractices.slice(0, 4).map((p) => {
                const isAttended = attendanceState[p.id] ?? true;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-800"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block leading-tight">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{p.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAttendance(p.id)}
                      className="focus:outline-none transition-transform active:scale-90 cursor-pointer"
                      title="Alternar asistencia (Presente / Falta)"
                    >
                      {isAttended ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                          ✓
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-[#E31B23] text-white flex items-center justify-center text-xs font-black shadow-xs">
                          ✕
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}

              <div className="pt-1 text-center">
                <button
                  onClick={() => onNavigateTab('entrenamientos')}
                  className="text-[11px] font-bold text-slate-600 hover:text-[#3B59A8] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver pase de lista completo</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Mobile Accordion: Plantel de Alumnos */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <button
            onClick={() => setMobileRosterOpen(!mobileRosterOpen)}
            className="w-full px-4 py-3 flex items-center justify-between font-bold text-xs text-slate-900 border-b border-slate-100 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E31B23]" />
              <span>Plantel de Alumnos</span>
            </span>
            {mobileRosterOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {mobileRosterOpen && (
            <div>
              <div className="bg-[#E31B23] text-white px-3 py-2 flex items-center justify-between text-[11px] font-bold">
                <span>Nombre del Alumno</span>
                <span>Categoría / Posición</span>
              </div>
              <div className="divide-y divide-slate-100 p-2">
                {filteredProfiles.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => p.origPlayer && onOpenPlayerModal(p.origPlayer)}
                    className="flex items-center justify-between py-2 px-1 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-900"
                      />
                      <span className="text-xs font-semibold text-slate-800">{p.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600 font-mono">
                      {p.category} · {p.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Mobile Accordion: Estado de Pagos */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <button
            onClick={() => setMobilePaymentsOpen(!mobilePaymentsOpen)}
            className="w-full px-4 py-3 flex items-center justify-between font-bold text-xs text-slate-900 border-b border-slate-100 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#3B59A8]" />
              <span>Control de Pagos y Cobranza</span>
            </span>
            {mobilePaymentsOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {mobilePaymentsOpen && (
            <div>
              <div className="bg-[#3B59A8] text-white px-3 py-2 grid grid-cols-4 text-[10px] font-bold text-center">
                <span className="text-left col-span-1">Alumno</span>
                <span>Estatus</span>
                <span>Monto</span>
                <span className="text-right">Acción</span>
              </div>
              <div className="divide-y divide-slate-100 p-2 text-xs">
                {filteredPayments.slice(0, 4).map((r) => (
                  <div key={r.id} className="py-2 grid grid-cols-4 items-center text-center">
                    <span className="text-left font-bold text-slate-800 truncate col-span-1">
                      {r.playerName}
                    </span>
                    <div>
                      {r.statusType === 'paid' && (
                        <span className="bg-[#059669] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full inline-block">
                          Pagado
                        </span>
                      )}
                      {r.statusType === 'pending' && (
                        <span className="bg-[#E31B23] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full inline-block">
                          Pendiente
                        </span>
                      )}
                      {r.statusType === 'overdue' && (
                        <span className="bg-[#7F1D1D] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full inline-block">
                          Vencido
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-slate-700 font-mono text-[11px]">{r.amount}</span>
                    <div className="flex items-center justify-end gap-1.5 text-[#3B59A8]">
                      <button
                        onClick={() => r.charge && onOpenPaymentModal(r.charge)}
                        className="p-1 hover:bg-slate-100 rounded"
                        title="Gestionar pago"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          DESKTOP / LAPTOP VIEW (Exact 4-Card Grid in Spanish)
          ======================================================== */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {/* CARD 1: Próximos Entrenamientos y Asistencia */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-[#3B59A8]" />
                <span>Entrenamientos Programados y Asistencia</span>
              </h2>
              <span className="text-[10.5px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                En Cancha
              </span>
            </div>

            {/* Encabezado de tabla */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-500">
              <span>Nombre del Alumno</span>
              <span>Asistencia</span>
            </div>

            {/* Lista de Alumnos */}
            <div className="divide-y divide-slate-100">
              {(showAllPractices ? upcomingPracticesList : upcomingPracticesList.slice(0, 5)).map(
                (player) => {
                  const isAttended = attendanceState[player.id] ?? true;
                  return (
                    <div
                      key={player.id}
                      className="py-2.5 flex items-center justify-between group hover:bg-slate-50/60 px-1 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-slate-900 shadow-2xs"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block leading-tight">{player.name}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{player.category}</span>
                        </div>
                      </div>

                      {/* Botón de Asistencia: Verde / Rojo */}
                      <button
                        onClick={() => toggleAttendance(player.id)}
                        className="focus:outline-none transition-transform active:scale-90 cursor-pointer"
                        title="Alternar asistencia (Presente / Falta)"
                      >
                        {isAttended ? (
                          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-[#E31B23] text-white flex items-center justify-center text-xs font-black shadow-xs">
                            ✕
                          </span>
                        )}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Pie de tarjeta con Ver más */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('entrenamientos')}
              className="text-xs font-bold text-[#3B59A8] hover:underline"
            >
              Módulo de Entrenamientos →
            </button>
            <button
              onClick={() => setShowAllPractices(!showAllPractices)}
              className="text-xs font-bold text-slate-500 hover:text-[#3B59A8] inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{showAllPractices ? 'Mostrar menos' : 'Mostrar más'}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAllPractices ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* CARD 2: Perfiles de Alumnos (Player Profiles) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-[#3B59A8]" />
              <span>Perfiles de Alumnos</span>
            </h2>
            <button
              onClick={onOpenNewPlayerModal}
              className="text-[11px] font-bold text-[#3B59A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Inscribir</span>
            </button>
          </div>

          {/* Cuadrícula 4x2 de Alumnos */}
          <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
            {playerProfiles.map((p) => (
              <div
                key={p.id}
                onClick={() => p.origPlayer && onOpenPlayerModal(p.origPlayer)}
                className="group cursor-pointer flex flex-col items-center p-1 rounded-xl hover:bg-slate-50 transition-all hover:-translate-y-0.5"
                title={`Ver expediente completo de ${p.name}`}
              >
                {/* Foto circular con borde oscuro */}
                <div className="relative">
                  <img
                    src={p.photo}
                    alt={p.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-slate-900 shadow-xs group-hover:border-[#3B59A8] transition-colors"
                  />
                </div>
                {/* Nombre */}
                <span className="text-[11px] sm:text-xs font-black text-slate-900 mt-1.5 leading-tight truncate max-w-[85px] block">
                  {p.name}
                </span>
                {/* Categoría */}
                <span className="text-[10px] font-bold text-slate-500 block leading-tight">
                  {p.category}
                </span>
                {/* Posición en español */}
                <span className="text-[10px] text-slate-600 block leading-tight font-medium">
                  {p.position}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: Actividad Reciente del Club (Recent Activity) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3B59A8]" />
              <span>Actividad y Bitácora Reciente</span>
            </h2>
            <span className="text-[10.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              En Tiempo Real
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Actividad 1 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-800">
                <CharalesLogo size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Escuela de Fútbol Charales de Chapala
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Convocatoria oficial para el Torneo Apertura 2026 publicada.
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Hace 3 minutos</span>
              </div>
            </div>

            {/* Actividad 2 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-800">
                <CharalesLogo size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Escuela de Fútbol Charales de Chapala
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Entrenamiento de la categoría Sub-8 programado en Campo Los Pinos.
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Hace 5 minutos</span>
              </div>
            </div>

            {/* Actividad 3 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-800">
                <CharalesLogo size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Escuela de Fútbol Charales de Chapala
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Acreditación de pago de colegiatura #REC-2026-089 registrado con éxito.
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Hace 12 minutos</span>
              </div>
            </div>

            {/* Actividad 4 */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-800">
                <CharalesLogo size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Escuela de Fútbol Charales de Chapala
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Entrega de kit oficial de uniforme realizada en secretaría del club.
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Hace 25 minutos</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: Pagos y Mensualidades (Payments & Fees) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#3B59A8]" />
                <span>Control de Pagos y Colegiaturas</span>
              </h2>
            </div>

            {/* Encabezado Azul Marino de Tabla */}
            <div className="bg-[#3B59A8] text-white px-5 py-2.5 grid grid-cols-4 items-center text-xs font-bold">
              <span className="col-span-1">Nombre del Alumno</span>
              <span className="text-center">Estatus</span>
              <span className="text-center">Monto</span>
              <span className="text-right">Acciones</span>
            </div>

            {/* Filas de Pagos */}
            <div className="divide-y divide-slate-100 text-xs">
              {paymentRows.map((row) => (
                <div
                  key={row.id}
                  className="px-5 py-3 grid grid-cols-4 items-center hover:bg-slate-50/70 transition-colors"
                >
                  {/* Nombre */}
                  <span className="font-bold text-slate-800 truncate">{row.playerName}</span>

                  {/* Estatus en español: Pagado (Verde), Pendiente (Rojo), Vencido (Rojo Oscuro) */}
                  <div className="text-center">
                    {row.statusType === 'paid' && (
                      <span className="bg-[#059669] text-white text-[10.5px] font-bold px-3 py-1 rounded-full inline-block shadow-2xs">
                        Pagado
                      </span>
                    )}
                    {row.statusType === 'pending' && (
                      <span className="bg-[#E31B23] text-white text-[10.5px] font-bold px-3 py-1 rounded-full inline-block shadow-2xs">
                        Pendiente
                      </span>
                    )}
                    {row.statusType === 'overdue' && (
                      <span className="bg-[#7F1D1D] text-white text-[10.5px] font-bold px-3 py-1 rounded-full inline-block shadow-2xs">
                        Vencido
                      </span>
                    )}
                  </div>

                  {/* Monto */}
                  <span className="font-bold text-slate-700 text-center font-mono">
                    {row.amount}
                  </span>

                  {/* Acciones */}
                  <div className="flex items-center justify-end gap-2 text-[#3B59A8]">
                    <button
                      onClick={() => row.charge && onOpenPaymentModal(row.charge)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Procesar o editar pago"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigateTab('pagos')}
                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Ver estado de cuenta y recibos"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">Ciclo Apertura 2026</span>
            <button
              onClick={() => onNavigateTab('pagos')}
              className="text-xs font-bold text-[#3B59A8] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Módulo Completo de Pagos y Cobranza</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharalesDashboard;
