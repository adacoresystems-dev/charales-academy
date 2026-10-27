import React from 'react';
import {
  Trophy,
  CalendarCheck2,
  Users,
  TrendingUp,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { User, Coach, Category, Player, Match, TrainingSession, DirectMessage } from '../../types';

interface CoachDashboardProps {
  currentUser: User;
  coaches: Coach[];
  categories: Category[];
  players: Player[];
  matches: Match[];
  sessions: TrainingSession[];
  messages: DirectMessage[];
  onNavigateTab: (tab: string) => void;
  onOpenQuickAttendance: () => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({
  currentUser,
  coaches,
  categories,
  players,
  matches,
  sessions,
  messages,
  onNavigateTab,
  onOpenQuickAttendance,
}) => {
  // Find coach record
  const coach = coaches.find((c) => c.usuarioId === currentUser.id) || coaches[0];
  const myCategoryIds = coach.categoriasAsignadas || [2, 3];
  const myCategories = categories.filter((c) => myCategoryIds.includes(c.id));

  // My players
  const myPlayers = players.filter(
    (p) => p.categoriaActualId && myCategoryIds.includes(p.categoriaActualId) && p.estatus === 'ACTIVO'
  );

  // Next match for my categories
  const nextMatch = matches
    .filter((m) => myCategoryIds.includes(m.categoriaId) && m.estado === 'PROGRAMADO')
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  // Today or next training session
  const upcomingSession = sessions.find(
    (s) => myCategoryIds.includes(s.categoriaId) && s.estado === 'PROGRAMADA'
  );

  // Unread messages from parents
  const recentMessages = messages
    .filter((m) => m.destinatarioId === currentUser.id || m.remitenteId === currentUser.id)
    .slice(-3);

  return (
    <div className="space-y-6">
      {/* Welcome Coach Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#111111] to-[#1c2438] p-6 sm:p-8 text-white shadow-md border border-neutral-800">
        <div className="absolute top-0 right-0 w-80 h-full pointer-events-none overflow-hidden opacity-25">
          <svg className="w-full h-full" viewBox="0 0 300 160" preserveAspectRatio="none" fill="none">
            <path d="M120 0 L240 160 L280 160 L160 0 Z" fill="#E31B23" />
            <path d="M180 0 L300 160 L340 160 L220 0 Z" fill="#3B59A8" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E31B23] text-white text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Área Técnica & Formativa · {coach.licencia || 'Entrenador FMF'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            Hola Profe {currentUser.nombre}
          </h1>
          <p className="text-sm text-neutral-300 mt-1">
            Tienes {myCategories.map((c) => c.nombre).join(' y ')} a tu cargo con {myPlayers.length} alumnos activos.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('asistencia')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#E31B23] hover:bg-[#c9151c] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Tomar Asistencia Rápida</span>
            </button>
            <button
              onClick={() => onNavigateTab('rendimiento')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#3B59A8] hover:bg-[#2d4480] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Evaluar Rendimiento Alumno</span>
            </button>
            <button
              onClick={() => onNavigateTab('comunicacion')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#3B59A8]" />
              <span>Chat con Padres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Match & Session Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Match Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Próximo Partido Oficial</h2>
                <span className="text-xs text-slate-500">Compromiso de tu categoría</span>
              </div>
            </div>
            {nextMatch && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {nextMatch.categoriaNombre}
              </span>
            )}
          </div>

          {nextMatch ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Rival de la Jornada
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {nextMatch.esLocal ? 'Local' : 'Visitante'}
                </span>
              </div>

              <div className="text-xl font-extrabold text-slate-900">
                vs {nextMatch.equipoRival}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {nextMatch.fecha} · {nextMatch.hora}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{nextMatch.sede}</span>
                </div>
              </div>

              {nextMatch.observaciones && (
                <p className="text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-200/50">
                  {nextMatch.observaciones}
                </p>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No tienes partidos programados para los próximos días.
            </div>
          )}

          <button
            onClick={() => onNavigateTab('partidos')}
            className="w-full text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-1 block"
          >
            Ver todos los partidos y registrar marcadores →
          </button>
        </div>

        {/* Training Session & Fast Attendance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Sesión de Entrenamiento</h2>
                <span className="text-xs text-slate-500">Pase de lista y observaciones</span>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Hoy
            </span>
          </div>

          {upcomingSession ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{upcomingSession.categoriaNombre}</span>
                <span className="font-semibold text-slate-600">
                  {upcomingSession.horaInicio} - {upcomingSession.horaFin}
                </span>
              </div>

              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{upcomingSession.sedeNombre}</span>
              </div>

              {upcomingSession.objetivo && (
                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/50">
                  <span className="font-bold block text-slate-700">Objetivo Técnico:</span>
                  {upcomingSession.objetivo}
                </div>
              )}

              <button
                onClick={() => onNavigateTab('asistencia')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Abrir Pase de Lista</span>
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
              Entrenamientos completados. Puedes consultar el histórico en Asistencias.
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Jugadores en tus grupos:</span>
            <span className="font-extrabold text-slate-900">{myPlayers.length} alumnos</span>
          </div>
        </div>
      </div>

      {/* Parent Direct Communications */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Comunicación Directa con Padres de Familia
            </h2>
            <p className="text-xs text-slate-500">
              Mensajería privada sobre avances deportivos, uniformes o justificaciones
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('comunicacion')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Abrir Bandeja de Chat →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => onNavigateTab('comunicacion')}
              className="p-3.5 rounded-xl border border-slate-200/70 hover:bg-slate-50 cursor-pointer transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  {msg.remitenteId === currentUser.id ? 'Tú (para ' + msg.destinatarioNombre + ')' : msg.remitenteNombre}
                </span>
                <span className="text-[11px] text-slate-400">{msg.fechaHora}</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{msg.contenido}</p>
              <div className="text-[11px] text-emerald-600 font-medium">
                Alumno vinculado: {msg.jugadorNombre}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
