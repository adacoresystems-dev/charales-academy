import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  FileText, 
  ChevronRight, 
  Clock, 
  Award, 
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { Player, MonthlyRecord } from './types';

interface MonthlyStatsViewProps {
  category: string;
  players: Player[];
  onOpenPdfModal: (player: Player) => void;
}

export const MonthlyStatsView: React.FC<MonthlyStatsViewProps> = ({
  category,
  players,
  onOpenPdfModal
}) => {
  const categoryPlayers = players.filter(p => p.category === category);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    categoryPlayers[0]?.id || ''
  );

  const activePlayer = categoryPlayers.find(p => p.id === selectedPlayerId) || categoryPlayers[0];

  // Calculate category averages per month across all players
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril'];
  const categoryMonthlyAverages = months.map(m => {
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
      avgScore: count > 0 ? (totalScore / count).toFixed(2) : '0',
      avgAttendance: count > 0 ? Math.round(totalAttendance / count) : 0,
      totalCount: count
    };
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-[#111111]">
                Estadísticas Mensuales y Progreso Individual
              </h1>
              <p className="text-xs text-neutral-500">
                Evalúa la curva de evolución deportiva mes a mes en asistencia, minutos y calificación técnica.
              </p>
            </div>
          </div>
        </div>

        {activePlayer && (
          <button
            onClick={() => onOpenPdfModal(activePlayer)}
            className="px-4 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar Reporte PDF</span>
          </button>
        )}
      </div>

      {/* Category Overview: Month-over-Month Trends */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#3B59A8]" />
          Evolución Mensual del Grupo ({category})
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryMonthlyAverages.map((m, idx) => (
            <div key={m.month} className="p-4 bg-[#F8F9FA] rounded-xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider block">
                  {m.month} 2026
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Prom. Técnico</span>
                    <span className="text-xl font-black text-[#3B59A8] font-mono tabular-nums">
                      {m.avgScore}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 block">Asistencia</span>
                    <span className="text-xl font-black text-[#E31B23] font-mono tabular-nums">
                      {m.avgAttendance}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini visual trend bar */}
              <div className="mt-3 pt-2 border-t border-neutral-200">
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#3B59A8] h-full rounded-full" 
                    style={{ width: `${(parseFloat(m.avgScore) / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Player Progression Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Player Selector list (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider px-1">
            Seleccionar Jugador
          </h3>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {categoryPlayers.map((p) => {
              const isSelected = p.id === activePlayer?.id;
              const lastRecord = p.monthlyHistory[p.monthlyHistory.length - 1];

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlayerId(p.id)}
                  className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected ? 'bg-blue-50/80 border border-[#3B59A8]' : 'hover:bg-neutral-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                      isSelected ? 'bg-[#3B59A8] text-white' : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      #{p.dorsal}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">{p.name}</h4>
                      <span className="text-[10px] text-neutral-500">{p.position}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-[#E31B23] font-mono tabular-nums">
                      {lastRecord?.technicalAverage.toFixed(1)} / 10
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      {lastRecord?.attendancePercent}% Asist.
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Player Month-by-Month Progression Details (8 cols) */}
        {activePlayer ? (
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
                <div>
                  <h3 className="text-base font-extrabold text-[#111111]">
                    {activePlayer.name} (Dorsal #{activePlayer.dorsal})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Historial de evolución individual durante el primer cuatrimestre 2026.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">Asistencia Global</span>
                    <span className="text-lg font-black text-emerald-600 font-mono tabular-nums">
                      {activePlayer.overallAttendanceRate}%
                    </span>
                  </div>
                  <div className="text-right pl-3 border-l border-neutral-200">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">Goles Totales</span>
                    <span className="text-lg font-black text-[#E31B23] font-mono tabular-nums">
                      {activePlayer.monthlyHistory.reduce((acc, m) => acc + m.goals, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Monthly Cards Timeline */}
              <div className="mt-4 space-y-3">
                {activePlayer.monthlyHistory.map((rec, i) => {
                  const prevRec = i > 0 ? activePlayer.monthlyHistory[i - 1] : null;
                  const scoreDiff = prevRec ? (rec.technicalAverage - prevRec.technicalAverage).toFixed(2) : null;

                  return (
                    <div 
                      key={rec.month}
                      className="p-4 bg-[#F8F9FA] rounded-xl border border-neutral-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-[#3B59A8] text-white text-[11px] font-bold rounded-md">
                            {rec.month} {rec.year}
                          </span>
                          {scoreDiff && parseFloat(scoreDiff) > 0 && (
                            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              +{scoreDiff} pts
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <div>
                            <span className="text-neutral-500">Asistencia: </span>
                            <strong className="text-neutral-900">{rec.attendancePercent}%</strong>
                          </div>
                          <div>
                            <span className="text-neutral-500">Calificación: </span>
                            <strong className="text-[#E31B23]">{rec.technicalAverage.toFixed(1)} / 10</strong>
                          </div>
                        </div>
                      </div>

                      {/* Performance row */}
                      <div className="grid grid-cols-3 gap-2 text-[11px] py-2 bg-white rounded-lg px-3 border border-neutral-200">
                        <div>
                          <span className="text-neutral-400 block">Partidos Jugados:</span>
                          <strong className="text-neutral-900 font-mono">{rec.matchesPlayed} juegos</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">Minutos en Cancha:</span>
                          <strong className="text-neutral-900 font-mono">{rec.minutesPlayed} min</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">Aportación Ofensiva:</span>
                          <strong className="text-neutral-900 font-mono">{rec.goals}G · {rec.assists}A</strong>
                        </div>
                      </div>

                      {/* Qualitative coach feedback for that month */}
                      <div className="text-xs text-neutral-600 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                        <strong className="not-italic text-amber-900">Comentario del Entrenador: </strong>
                        "{rec.coachFeedback}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
