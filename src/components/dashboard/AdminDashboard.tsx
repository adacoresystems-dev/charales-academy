import React from 'react';
import {
  Users,
  Trophy,
  DollarSign,
  AlertCircle,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Shirt,
  UserPlus,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Player, Category, Match, Charge, UniformOrder, Notice } from '../../types';

interface AdminDashboardProps {
  players: Player[];
  categories: Category[];
  matches: Match[];
  charges: Charge[];
  uniformOrders: UniformOrder[];
  notices: Notice[];
  onNavigateTab: (tab: string) => void;
  onOpenNewPlayerModal: () => void;
  onOpenScheduleMatchModal: () => void;
  onOpenNewTournamentModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  players,
  categories,
  matches,
  charges,
  uniformOrders,
  notices,
  onNavigateTab,
  onOpenNewPlayerModal,
  onOpenScheduleMatchModal,
  onOpenNewTournamentModal,
}) => {
  const activePlayers = players.filter((p) => p.estatus === 'ACTIVO');
  const upcomingMatches = matches
    .filter((m) => m.estado === 'PROGRAMADO')
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const totalCollected = charges
    .filter((c) => c.estado === 'PAGADO')
    .reduce((sum, c) => sum + c.montoPagado, 0);

  const pendingDebt = charges
    .filter((c) => c.estado === 'PENDIENTE' || c.estado === 'VENCIDO')
    .reduce((sum, c) => sum + (c.montoFinal - c.montoPagado), 0);

  const overdueCount = charges.filter((c) => c.estado === 'VENCIDO').length;
  const pendingUniforms = uniformOrders.filter((u) => u.estado !== 'ENTREGADO').length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner with Sports Academy Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 text-white min-h-[180px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/src/assets/images/soccer_academy_hero_1791387846069.jpg"
          alt="Academia de Fútbol Infantil"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-[#E31B23] text-xs font-bold tracking-wider uppercase mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Panel de Administración Central · Ciclo 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
            Escuela de Futbol Charales de Chapala
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Control integral de alumnos, torneos, recaudación de mensualidades, material deportivo y comunicación familiar.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenNewPlayerModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-[#E31B23] hover:bg-[#c9151c] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Inscribir Alumno</span>
            </button>
            {onOpenNewTournamentModal && (
              <button
                onClick={onOpenNewTournamentModal}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-[#3B59A8] hover:bg-[#2d4480] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>+ Agregar Liga / Torneo</span>
              </button>
            )}
            <button
              onClick={onOpenScheduleMatchModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-xs border border-white/20 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Programar Partido</span>
            </button>
            <button
              onClick={() => onNavigateTab('finanzas')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-xs border border-white/20 transition-colors cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Revisar Cobranza</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Players */}
        <div
          onClick={() => onNavigateTab('alumnos')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Alumnos Activos</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {activePlayers.length}
            </span>
            <span className="text-xs text-slate-400">/ {players.length} reg.</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
            <span>{categories.length} categorías operativas</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Collected Month */}
        <div
          onClick={() => onNavigateTab('finanzas')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Cobranza Recaudada</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              ${totalCollected.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-medium">
            Ciclo actual Apertura 2026
          </div>
        </div>

        {/* Pending Debt */}
        <div
          onClick={() => onNavigateTab('finanzas')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#E31B23]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Adeudo por Cobrar</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E31B23] flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E31B23] tabular-nums">
              ${pendingDebt.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#E31B23] font-medium">
            {overdueCount} cargos vencidos
          </div>
        </div>

        {/* Next Match */}
        <div
          onClick={() => onNavigateTab('partidos')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Próximo Partido</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 truncate">
            {upcomingMatches.length > 0 ? (
              <>
                <span className="text-lg font-bold text-slate-900 block truncate">
                  vs {upcomingMatches[0].equipoRival}
                </span>
                <span className="text-xs text-slate-500 block">
                  {upcomingMatches[0].fecha} · {upcomingMatches[0].hora}
                </span>
              </>
            ) : (
              <span className="text-sm text-slate-400">Sin partidos agendados</span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-medium flex items-center gap-1">
            <span>Ver calendario completo</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Categories Capacity & Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Capacity (HU-021) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Capacidad y Ocupación por Categoría
              </h2>
              <p className="text-xs text-slate-500">
                Control de cupos máximos reglamentarios por grupo de entrenamiento
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('categorias')}
              className="text-xs font-bold text-[#3B59A8] hover:underline cursor-pointer"
            >
              Gestionar Categorías →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const enrolled = players.filter(
                (p) => p.categoriaActualId === cat.id && p.estatus === 'ACTIVO'
              ).length;
              const percentage = Math.min(100, Math.round((enrolled / cat.cupoMaximo) * 100));
              const isFull = enrolled >= cat.cupoMaximo;

              return (
                <div key={cat.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{cat.nombre}</span>
                      <span className="text-slate-400 ml-2">
                        ({cat.edadMinima} a {cat.edadMaxima} años)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono tabular-nums font-bold text-slate-700">
                        {enrolled} / {cat.cupoMaximo}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isFull
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? 'bg-rose-500'
                          : percentage > 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {cat.diasEntrenamiento.join(', ')} · {cat.horario}
                    </span>
                    <span className="text-slate-400">{cat.sedeNombre.split('(')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Operational Alerts & Uniform Deliveries */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Alertas Operativas</h2>

          <div className="space-y-3">
            {/* Overdue Debt Alert */}
            {overdueCount > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Cobranza Vencida</span>
                  <span>
                    Hay {overdueCount} mensualidades pendientes de regularización este mes.
                  </span>
                  <button
                    onClick={() => onNavigateTab('finanzas')}
                    className="mt-1.5 block font-semibold text-rose-900 underline"
                  >
                    Abrir módulo de caja →
                  </button>
                </div>
              </div>
            )}

            {/* Pending Uniforms Alert */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-start gap-3">
              <Shirt className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Uniformes por Entregar</span>
                <span>
                  {pendingUniforms} pedidos en almacén listos para entregar a las familias.
                </span>
                <button
                  onClick={() => onNavigateTab('inventario')}
                  className="mt-1.5 block font-semibold text-blue-900 underline"
                >
                  Ver órdenes de uniformes →
                </button>
              </div>
            </div>

            {/* Recent Match Result */}
            {matches.filter((m) => m.estado === 'JUGADO').length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Último Resultado Oficial</span>
                  {(() => {
                    const last = matches.find((m) => m.estado === 'JUGADO')!;
                    return (
                      <>
                        <span className="font-medium">
                          Charales de Chapala {last.golesFavor} - {last.golesContra} {last.equipoRival}
                        </span>
                        <span className="block text-[11px] text-emerald-700 mt-0.5">
                          {last.categoriaNombre} ({last.fecha})
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('auditoria')}
              className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Consultar Bitácora de Auditoría
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
