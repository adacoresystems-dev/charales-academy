import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Radar, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Trophy, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  FileText,
  Bell,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  Shield,
  ArrowUpRight,
  Megaphone,
  Check
} from 'lucide-react';
import { 
  Coach, 
  Player, 
  TrainingSession, 
  MatchFixture, 
  TournamentStanding, 
  NotificationItem, 
  TechnicalSkills 
} from './types';
import { ClubLogo } from './ClubLogo';
import { RadarChart } from './RadarChart';

interface DashboardViewProps {
  coach: Coach;
  selectedCategory: string;
  players: Player[];
  sessions: TrainingSession[];
  matches: MatchFixture[];
  standings: TournamentStanding[];
  notifications: NotificationItem[];
  todaySession: TrainingSession | undefined;
  nextMatch: MatchFixture | undefined;
  onNavigateTab: (tab: any) => void;
  onSelectPlayerForPdf: (player: Player) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  coach,
  selectedCategory,
  players,
  sessions,
  matches,
  standings,
  notifications,
  todaySession,
  nextMatch,
  onNavigateTab,
  onSelectPlayerForPdf
}) => {
  const categoryPlayers = players.filter(p => p.category === selectedCategory);
  const categorySessions = sessions.filter(s => s.category === selectedCategory);
  const categoryMatches = matches.filter(m => m.category === selectedCategory);
  
  // Player selected for quick radar inspection on dashboard
  const [selectedRadarPlayerId, setSelectedRadarPlayerId] = useState<string>(
    categoryPlayers[0]?.id || ''
  );
  const radarPlayer = categoryPlayers.find(p => p.id === selectedRadarPlayerId) || categoryPlayers[0];

  // 1. Calculations for ASISTENCIAS
  const avgAttendance = Math.round(
    categoryPlayers.reduce((acc, p) => acc + p.overallAttendanceRate, 0) / (categoryPlayers.length || 1)
  );
  const perfectAttendanceCount = categoryPlayers.filter(p => p.overallAttendanceRate >= 95).length;
  const needsAttentionCount = categoryPlayers.filter(p => p.overallAttendanceRate < 90).length;

  // 2. Calculations for RENDIMIENTO TÉCNICO
  const avgSkills: TechnicalSkills = {
    control: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.control, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    pase: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.pase, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    tiro: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.tiro, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    velocidad: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.velocidad, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    tactica: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.tactica, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    disciplina: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.disciplina, 0) / (categoryPlayers.length || 1)).toFixed(1)),
  };

  const avgTechnicalScore = (
    Object.values(avgSkills).reduce((a, b) => a + b, 0) / 6
  ).toFixed(1);

  // Top performers ranking
  const sortedPlayersByScore = [...categoryPlayers].sort((a, b) => {
    const avgA = Object.values(a.currentSkills).reduce((x, y) => x + y, 0);
    const avgB = Object.values(b.currentSkills).reduce((x, y) => x + y, 0);
    return avgB - avgA;
  });
  const topPerformer = sortedPlayersByScore[0];

  // 3. Calculations for ESTADÍSTICAS MENSUALES
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril'];
  const monthlyProgression = months.map(m => {
    let totalScore = 0;
    let totalAttendance = 0;
    let count = 0;
    categoryPlayers.forEach(p => {
      const rec = p.monthlyHistory.find(h => h.month === m);
      if (rec) {
        totalScore += rec.technicalAverage;
        totalAttendance += rec.attendancePercent;
        count++;
      }
    });
    return {
      month: m,
      avgScore: count > 0 ? (totalScore / count).toFixed(1) : '0',
      avgAttendance: count > 0 ? Math.round(totalAttendance / count) : 0,
    };
  });

  // Total team stats
  const totalGoals = categoryPlayers.reduce(
    (acc, p) => acc + p.monthlyHistory.reduce((s, m) => s + m.goals, 0), 0
  );
  const totalMinutes = categoryPlayers.reduce(
    (acc, p) => acc + p.monthlyHistory.reduce((s, m) => s + m.minutesPlayed, 0), 0
  );

  // 4. Comparative Radar Datasets
  const radarDatasets = [
    {
      label: radarPlayer ? radarPlayer.name.split(' ')[0] : 'Jugador',
      skills: radarPlayer ? radarPlayer.currentSkills : avgSkills,
      strokeColor: '#3B59A8',
      fillColor: 'rgba(59, 89, 168, 0.25)'
    },
    {
      label: 'Promedio Categoría',
      skills: avgSkills,
      strokeColor: '#94A3B8',
      fillColor: 'rgba(148, 163, 184, 0.15)'
    }
  ];

  // 7. Recent notifications
  const recentNotifs = notifications.slice(0, 3);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8 pb-10">
      {/* =========================================================================
          HERO EXECUTIVE SUMMARY BAR
         ========================================================================= */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#111111] to-[#1c2438] text-white p-6 md:p-8 shadow-md border border-neutral-800">
        {/* Dynamic diagonal sports stripes (fiel a la identidad gráfica) */}
        <div className="absolute top-0 right-0 w-80 h-full pointer-events-none overflow-hidden opacity-30">
          <svg className="w-full h-full" viewBox="0 0 300 160" preserveAspectRatio="none" fill="none">
            <path d="M120 0 L240 160 L280 160 L160 0 Z" fill="#E31B23" />
            <path d="M180 0 L300 160 L340 160 L220 0 Z" fill="#3B59A8" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ClubLogo size="lg" className="shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-[#E31B23] text-white rounded-md">
                  Panel Ejecutivo DT
                </span>
                <span className="text-xs font-semibold text-neutral-300">
                  {selectedCategory}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
                Tablero Central de Mando y Rendimiento
              </h1>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                Resumen integral en tiempo real: asistencias, evaluaciones técnicas, curva de progreso mensual, comparativas biomecánicas, agenda de entrenamientos, torneos y comunicación.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('asistencia')}
              className="px-4 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Pasar Lista</span>
            </button>
            <button
              onClick={() => onNavigateTab('rendimiento')}
              className="px-4 py-2 bg-[#3B59A8] hover:bg-[#2d4480] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Evaluar Jugador</span>
            </button>
            {topPerformer && (
              <button
                onClick={() => onSelectPlayerForPdf(topPerformer)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#E31B23]" />
                <span>Exportar Reporte PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI Strip at Bottom of Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div>
            <span className="text-neutral-400 block text-[11px]">Plantel Asignado:</span>
            <strong className="text-white text-lg font-mono font-bold">{categoryPlayers.length} Jugadores</strong>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Asistencia Global:</span>
            <strong className="text-emerald-400 text-lg font-mono font-bold">{avgAttendance}%</strong>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Promedio Técnico:</span>
            <strong className="text-[#E31B23] text-lg font-mono font-bold">{avgTechnicalScore} / 10</strong>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Liderato en Liga:</span>
            <strong className="text-blue-300 text-lg font-mono font-bold">1° Lugar (19 Pts)</strong>
          </div>
        </div>
      </div>

      {/* =========================================================================
          GRID ROW 1: RESUMEN DE ASISTENCIAS & RENDIMIENTO TÉCNICO
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: RESUMEN DE ASISTENCIAS */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E31B23] flex items-center justify-center font-bold">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider">
                    1. Resumen de Asistencias
                  </h2>
                  <p className="text-[11px] text-neutral-500">
                    Seguimiento continuo de puntualidad y participación en cancha.
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                todaySession?.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-[#E31B23]'
              }`}>
                {todaySession?.completed ? 'Lista Tomada' : 'Pendiente Hoy'}
              </span>
            </div>

            {/* Attendance Metrics */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Tasa Global</span>
                <span className="text-2xl font-black text-[#3B59A8] font-mono tabular-nums">
                  {avgAttendance}%
                </span>
                <span className="text-[10px] text-emerald-600 block font-semibold mt-0.5">
                  Meta ≥ 85%
                </span>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Asistencia Top</span>
                <span className="text-2xl font-black text-emerald-600 font-mono tabular-nums">
                  {perfectAttendanceCount}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  Jugadores ≥ 95%
                </span>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Atención</span>
                <span className="text-2xl font-black text-[#E31B23] font-mono tabular-nums">
                  {needsAttentionCount}
                </span>
                <span className="text-[10px] text-red-600 block mt-0.5">
                  Inasistencias &lt; 90%
                </span>
              </div>
            </div>

            {/* Today's Session Attendance Callout */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-[#3B59A8]/30 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-900 block">
                  {todaySession ? todaySession.title : 'Sesión de hoy'}
                </span>
                <span className="text-[11px] text-neutral-600">
                  {todaySession?.time} · {todaySession?.field.split('(')[0]}
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('asistencia')}
                className="px-3 py-1.5 bg-[#E31B23] hover:bg-[#c9151c] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {todaySession?.completed ? 'Ver Lista' : 'Tomar Lista'}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Registrado conforme a HU-030 y HU-031
            </span>
            <button
              onClick={() => onNavigateTab('asistencia')}
              className="text-xs font-bold text-[#3B59A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Asistencia Completa</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECTION 2: RESUMEN DE RENDIMIENTO TÉCNICO */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B59A8] flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider">
                    2. Rendimiento Técnico
                  </h2>
                  <p className="text-[11px] text-neutral-500">
                    Evaluación de las 6 dimensiones formativas del club (Escala 1 a 10).
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">Media General</span>
                <span className="text-base font-black text-[#3B59A8] font-mono">
                  {avgTechnicalScore} <span className="text-xs text-neutral-400 font-normal">/ 10</span>
                </span>
              </div>
            </div>

            {/* 6 Core Skills Progress Bars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-xs">
              {[
                { label: 'Control', val: avgSkills.control },
                { label: 'Pase', val: avgSkills.pase },
                { label: 'Tiro', val: avgSkills.tiro },
                { label: 'Velocidad', val: avgSkills.velocidad },
                { label: 'Táctica', val: avgSkills.tactica },
                { label: 'Disciplina', val: avgSkills.disciplina },
              ].map((skill, i) => (
                <div key={i} className="p-2.5 bg-[#F8F9FA] rounded-xl border border-neutral-200">
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-neutral-700">{skill.label}</span>
                    <span className="font-mono text-[#3B59A8]">{skill.val}</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#3B59A8] h-full rounded-full"
                      style={{ width: `${(skill.val / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Performer Spotlight Mini */}
            {topPerformer && (
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#3B59A8] text-white flex items-center justify-center font-bold text-xs font-mono">
                    #{topPerformer.dorsal}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">
                      {topPerformer.name} ({topPerformer.position})
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Mejor puntuación técnica: {(Object.values(topPerformer.currentSkills).reduce((a, b) => a + b, 0) / 6).toFixed(1)} / 10
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectPlayerForPdf(topPerformer)}
                  className="text-[11px] font-bold text-[#E31B23] hover:underline"
                >
                  Ficha PDF
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Evaluación según HU-024
            </span>
            <button
              onClick={() => onNavigateTab('rendimiento')}
              className="text-xs font-bold text-[#3B59A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ir a Evaluaciones Técnicas</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          GRID ROW 2: ESTADÍSTICAS MENSUALES & GRÁFICAS COMPARATIVAS (RADAR)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 3: ESTADÍSTICAS MENSUALES (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider">
                    3. Estadísticas Mensuales
                  </h2>
                  <p className="text-[11px] text-neutral-500">
                    Evolución cuatrimestral del plantel en 2026.
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly Trend Bars */}
            <div className="space-y-3 my-4">
              {monthlyProgression.map((item, idx) => (
                <div key={item.month} className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                  <div className="w-20">
                    <span className="font-bold text-neutral-900 block">{item.month}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">2026</span>
                  </div>

                  <div className="flex-1 mx-4">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-neutral-500">Asistencia: <strong className="text-neutral-900">{item.avgAttendance}%</strong></span>
                      <span className="text-neutral-500">Técnico: <strong className="text-[#3B59A8]">{item.avgScore}</strong></span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#3B59A8] h-full rounded-full"
                        style={{ width: `${(parseFloat(item.avgScore) / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-600 flex items-center justify-end">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Activo
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Season Aggregates */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-center">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold">Goles Acumulados</span>
                <span className="text-xl font-black text-[#E31B23] font-mono">{totalGoals}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold">Minutos de Cancha</span>
                <span className="text-xl font-black text-neutral-900 font-mono">{totalMinutes}'</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Historial cuatrimestral</span>
            <button
              onClick={() => onNavigateTab('estadisticas')}
              className="text-xs font-bold text-[#3B59A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Estadísticas Completas</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECTION 4: GRÁFICAS COMPARATIVAS - RADAR EMBEBIDO (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Radar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider">
                    4. Gráficas Comparativas
                  </h2>
                  <p className="text-[11px] text-neutral-500">
                    Polígono Radar de habilidades: Jugador vs Promedio de la Categoría.
                  </p>
                </div>
              </div>

              {/* Player Quick Selector for Radar */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500">Jugador:</span>
                <select
                  value={selectedRadarPlayerId}
                  onChange={(e) => setSelectedRadarPlayerId(e.target.value)}
                  className="text-xs font-semibold bg-[#F8F9FA] border border-neutral-300 rounded-lg py-1 px-2.5 outline-none focus:ring-1 focus:ring-[#3B59A8]"
                >
                  {categoryPlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.dorsal} {p.name.split(' ')[0]} ({p.position})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Radar Visual Display */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-3">
              <div className="md:col-span-7 flex justify-center py-2">
                <RadarChart
                  size={260}
                  data={radarDatasets}
                />
              </div>

              <div className="md:col-span-5 space-y-2 text-xs">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200">
                  <strong className="text-[#3B59A8] block font-bold">
                    {radarPlayer?.name}
                  </strong>
                  <span className="text-[11px] text-neutral-600">
                    Dorsal #{radarPlayer?.dorsal} · {radarPlayer?.position}
                  </span>
                </div>

                <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 space-y-1 text-[11px] text-neutral-600">
                  <span className="font-bold text-neutral-900 block">Diagnóstico Rápido:</span>
                  <p>
                    {radarPlayer?.coachObservations ? `"${radarPlayer.coachObservations.slice(0, 95)}..."` : 'Desempeño consistente en sesiones formativas.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Modo Cara a Cara y rankings disponibles
            </span>
            <button
              onClick={() => onNavigateTab('comparativas')}
              className="text-xs font-bold text-[#3B59A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Gráficos Comparativos Completos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          GRID ROW 3: ACTIVIDADES Y SESIONES, PARTIDOS Y TORNEOS, AVISOS Y COMUNICACIÓN
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SECTION 5: ACTIVIDADES Y SESIONES (HU-025, HU-029) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B59A8] flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider">
                    5. Actividades & Sesiones
                  </h2>
                  <p className="text-[11px] text-neutral-500">HU-025 y HU-029</p>
                </div>
              </div>
            </div>

            {/* Training Sessions Highlights */}
            <div className="mt-4 space-y-3">
              {categorySessions.slice(0, 2).map((s) => (
                <div key={s.id} className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                    <span className="font-bold text-[#3B59A8]">{s.date}</span>
                    <span className="text-neutral-500">{s.time}</span>
                  </div>
                  <h4 className="font-bold text-neutral-900 leading-tight">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                    {s.objective}
                  </p>
                  <div className="mt-2 text-[10px] text-neutral-400">
                    Sede: {s.field.split('(')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Horarios y ejercicios</span>
            <button
              onClick={() => onNavigateTab('sesiones')}
              className="text-xs font-bold text-[#3B59A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Sesiones</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECTION 6: PARTIDOS Y TORNEOS (HU-027, HU-038, HU-041) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E31B23] flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider">
                    6. Partidos & Torneos
                  </h2>
                  <p className="text-[11px] text-neutral-500">HU-027, HU-038, HU-041</p>
                </div>
              </div>
            </div>

            {/* Next Match Card */}
            {nextMatch ? (
              <div className="mt-4 p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#E31B23]">Próximo Partido</span>
                  <span className="text-neutral-500 font-mono">{nextMatch.date} · {nextMatch.time}</span>
                </div>
                
                <div className="text-center py-1">
                  <div className="text-xs font-bold text-neutral-900">
                    Charales Chapala <span className="text-neutral-400">vs</span> {nextMatch.opponent}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    {nextMatch.isHome ? 'Local en Unidad Deportiva' : 'Visitante'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-200">
                  <span>Convocados: <strong className="text-neutral-900 font-mono">{nextMatch.convokedPlayerIds.length}</strong></span>
                  <span className="text-[#3B59A8] font-bold">Jornada 8</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 text-center text-xs text-neutral-500">
                Sin partidos programados esta semana.
              </div>
            )}

            {/* Standings Snippet */}
            <div className="mt-3 p-3 bg-blue-50/60 rounded-xl border border-[#3B59A8]/30 text-xs">
              <div className="flex justify-between items-center font-bold text-neutral-900">
                <span>Liga Regional Chapala</span>
                <span className="text-[#3B59A8]">1° Lugar</span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5">
                Récord invicto: 6 Ganados · 1 Empate · 19 Puntos
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Tabla y fixtures</span>
            <button
              onClick={() => onNavigateTab('partidos')}
              className="text-xs font-bold text-[#3B59A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Torneos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECTION 7: AVISOS Y COMUNICACIÓN (HU-060) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider">
                    7. Avisos & Comunicación
                  </h2>
                  <p className="text-[11px] text-neutral-500">HU-060</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <span className="bg-[#E31B23] text-white text-[10px] font-bold px-2 py-0.2 rounded-full">
                  {unreadCount} nuevos
                </span>
              )}
            </div>

            {/* Notification items */}
            <div className="mt-4 space-y-2.5">
              {recentNotifs.map((n) => (
                <div key={n.id} className="p-2.5 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-xs">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`px-1.5 py-0.2 font-bold rounded uppercase ${
                      n.type === 'convocatoria' ? 'bg-red-100 text-[#E31B23]' : 'bg-blue-100 text-[#3B59A8]'
                    }`}>
                      {n.type}
                    </span>
                    <span className="text-neutral-400 font-mono">{n.date.split(' ')[1] || n.date}</span>
                  </div>
                  <h4 className="font-bold text-neutral-900 truncate">
                    {n.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {n.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Canal entrenadores/padres</span>
            <button
              onClick={() => onNavigateTab('avisos')}
              className="text-xs font-bold text-[#3B59A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Avisos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
