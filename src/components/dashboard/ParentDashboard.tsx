import React from 'react';
import {
  Users,
  Trophy,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Download,
  Shirt,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  User,
  Guardian,
  GuardianPlayerRelation,
  Player,
  Category,
  Match,
  Charge,
  Payment,
  PerformanceEvaluation,
  Notice,
  UniformOrder,
} from '../../types';

interface ParentDashboardProps {
  currentUser: User;
  guardians: Guardian[];
  relations: GuardianPlayerRelation[];
  players: Player[];
  categories: Category[];
  matches: Match[];
  charges: Charge[];
  payments: Payment[];
  evaluations: PerformanceEvaluation[];
  notices: Notice[];
  uniformOrders: UniformOrder[];
  onNavigateTab: (tab: string) => void;
  onOpenPaymentGateway: (chargeId: number) => void;
  onOpenPlayerExpediente: (player: Player) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  currentUser,
  guardians,
  relations,
  players,
  categories,
  matches,
  charges,
  payments,
  evaluations,
  notices,
  uniformOrders,
  onNavigateTab,
  onOpenPaymentGateway,
  onOpenPlayerExpediente,
}) => {
  // Find guardian profile
  const guardian = guardians.find((g) => g.usuarioId === currentUser.id) || guardians[0];
  const myRelationJugadorIds = relations
    .filter((r) => r.tutorId === guardian.id)
    .map((r) => r.jugadorId);

  // My children
  const myChildren = players.filter((p) => myRelationJugadorIds.includes(p.id));

  // My pending charges
  const myPendingCharges = charges.filter(
    (c) => myRelationJugadorIds.includes(c.jugadorId) && (c.estado === 'PENDIENTE' || c.estado === 'VENCIDO')
  );
  const totalPendingBalance = myPendingCharges.reduce(
    (sum, c) => sum + (c.montoFinal - c.montoPagado),
    0
  );

  // My upcoming matches
  const myChildrenCatIds = myChildren
    .map((c) => c.categoriaActualId)
    .filter((id): id is number => id !== undefined);

  const upcomingMatches = matches
    .filter((m) => myChildrenCatIds.includes(m.categoriaId) && m.estado === 'PROGRAMADO')
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <div className="space-y-6">
      {/* Family Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#111111] to-[#1c2438] p-6 sm:p-8 text-white shadow-md border border-neutral-800">
        {/* Dynamic sport stripes decoration */}
        <div className="absolute top-0 right-0 w-80 h-full pointer-events-none overflow-hidden opacity-25">
          <svg className="w-full h-full" viewBox="0 0 300 160" preserveAspectRatio="none" fill="none">
            <path d="M120 0 L240 160 L280 160 L160 0 Z" fill="#E31B23" />
            <path d="M180 0 L300 160 L340 160 L220 0 Z" fill="#3B59A8" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E31B23] text-white text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Portal Familiar Oficial · Charales de Chapala</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            Bienvenido, {currentUser.nombre}
          </h1>
          <p className="text-sm text-neutral-300 mt-1">
            Consulta los partidos, horarios de entrenamiento, avances deportivos y realiza el pago de tus mensualidades en segundos.
          </p>

          {/* Quick Balance Alert in Banner */}
          <div className="mt-5 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-neutral-300 uppercase font-bold tracking-wider block">
                Estado Financiero Familiar
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-white tabular-nums">
                  ${totalPendingBalance.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-300">
                  {totalPendingBalance > 0
                    ? `(${myPendingCharges.length} mensualidad pendiente)`
                    : '¡Estás completamente al corriente!'}
                </span>
              </div>
            </div>

            {totalPendingBalance > 0 ? (
              <button
                onClick={() => onOpenPaymentGateway(myPendingCharges[0].id)}
                className="px-4 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pagar en Línea con 1 Clic</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sin pagos pendientes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Children Overview Cards Grid (HU-061) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#3B59A8]" />
            <span>Mis Hijos Inscritos</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {myChildren.length} alumnos registrados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myChildren.map((child) => {
            const cat = categories.find((c) => c.id === child.categoriaActualId);
            const childEvaluation = evaluations.find((e) => e.jugadorId === child.id);
            const childPending = charges.find(
              (c) => c.jugadorId === child.id && (c.estado === 'PENDIENTE' || c.estado === 'VENCIDO')
            );
            const childNextMatch = matches.find(
              (m) => m.categoriaId === child.categoriaActualId && m.estado === 'PROGRAMADO'
            );

            return (
              <div
                key={child.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#3B59A8]/50 transition-all space-y-4"
              >
                {/* Child Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-[#3B59A8]/30 text-[#3B59A8] font-black text-lg flex items-center justify-center">
                      {child.numeroCamiseta ? `#${child.numeroCamiseta}` : child.nombre.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {child.nombre} {child.apellidoPaterno}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-[#3B59A8]">{cat?.nombre}</span>
                        <span>·</span>
                        <span>{child.posicionHabitual}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {child.identificador}
                  </span>
                </div>

                {/* Training Schedule */}
                {cat && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-700 font-semibold">
                      <span>Días de Entrenamiento:</span>
                      <span className="text-[#3B59A8] font-bold">{cat.horario}</span>
                    </div>
                    <div className="text-slate-600 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cat.diasEntrenamiento.join(', ')}</span>
                    </div>
                    <div className="text-slate-500 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{cat.sedeNombre}</span>
                    </div>
                  </div>
                )}

                {/* Next Game Preview */}
                {childNextMatch ? (
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        <span>Próximo Juego</span>
                      </span>
                      <span className="font-bold text-amber-800">
                        {childNextMatch.fecha} · {childNextMatch.hora}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-800">
                      vs {childNextMatch.equipoRival}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {childNextMatch.sede}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-400 text-center">
                    Sin partidos programados para esta semana
                  </div>
                )}

                {/* Recent Coach Feedback */}
                {childEvaluation && (
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-[#3B59A8]" />
                        <span>Avance Deportivo Reciente</span>
                      </span>
                      <span className="font-extrabold text-[#3B59A8] tabular-nums">
                        {((childEvaluation.controlBalon + childEvaluation.pase + childEvaluation.disciplinaCompromiso) / 3).toFixed(1)}/10
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic line-clamp-2">
                      "{childEvaluation.comentariosFortalezas}"
                    </p>
                  </div>
                )}

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenPlayerExpediente(child)}
                    className="text-xs font-bold text-[#3B59A8] hover:text-[#2d4480] flex items-center gap-1 py-1.5 cursor-pointer"
                  >
                    <span>Ver Expediente Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {childPending ? (
                    <button
                      onClick={() => onOpenPaymentGateway(childPending.id)}
                      className="px-3 py-1.5 text-xs font-bold bg-[#E31B23] hover:bg-[#c9151c] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pagar (${childPending.montoFinal})</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mensualidad Cubierta</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Matches & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Matches Calendar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Juegos de mis Hijos</span>
            </h2>
            <button
              onClick={() => onNavigateTab('partidos')}
              className="text-xs font-semibold text-[#3B59A8] hover:underline cursor-pointer"
            >
              Ver calendario →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl border border-slate-200/70 hover:bg-slate-50 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{m.categoriaNombre}</span>
                    <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {m.fecha} · {m.hora}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">
                    Charales de Chapala vs {m.equipoRival}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{m.sede}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                No hay partidos próximos agendados.
              </div>
            )}
          </div>
        </div>

        {/* Notices & Direct Coach Contact */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#3B59A8]" />
              <span>Avisos del Club & Entrenador</span>
            </h2>
            <button
              onClick={() => onNavigateTab('comunicacion')}
              className="text-xs font-semibold text-[#3B59A8] hover:underline cursor-pointer"
            >
              Muro completo →
            </button>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{notice.titulo}</span>
                  <span className="text-[10px] text-slate-400">{notice.fechaPublicacion}</span>
                </div>
                <p className="text-slate-600 line-clamp-2">{notice.mensaje}</p>
                <div className="text-[11px] text-slate-400">Por {notice.creadoPorNombre}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('comunicacion')}
            className="w-full py-2.5 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-neutral-800"
          >
            <MessageSquare className="w-4 h-4 text-[#3B59A8]" />
            <span>Chatear Directamente con el Entrenador</span>
          </button>
        </div>
      </div>
    </div>
  );
};
