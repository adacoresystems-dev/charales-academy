import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ShieldAlert, 
  Users, 
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { MatchFixture, TournamentStanding, Player } from './types';

interface MatchesAndTournamentsViewProps {
  category: string;
  matches: MatchFixture[];
  standings: TournamentStanding[];
  players: Player[];
  onTogglePlayerConvocatoria: (matchId: string, playerId: string) => void;
}

export const MatchesAndTournamentsView: React.FC<MatchesAndTournamentsViewProps> = ({
  category,
  matches,
  standings,
  players,
  onTogglePlayerConvocatoria
}) => {
  const categoryMatches = matches.filter(m => m.category === category);
  const categoryPlayers = players.filter(p => p.category === category);

  const [activeTab, setActiveTab] = useState<'partidos' | 'tabla'>('partidos');
  const [selectedMatchId, setSelectedMatchId] = useState<string>(categoryMatches[0]?.id || '');

  const activeMatch = categoryMatches.find(m => m.id === selectedMatchId) || categoryMatches[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-50 text-[#E31B23] rounded-lg">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-[#111111]">
                Competiciones, Partidos y Resultados
              </h1>
              <p className="text-xs text-neutral-500">
                HU-027, HU-038 y HU-041 · Torneos activos, calendario de juegos oficiales y control de convocatorias.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-[#F8F9FA] rounded-xl border border-neutral-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('partidos')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'partidos' 
                ? 'bg-[#3B59A8] text-white shadow-xs' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Partidos y Convocatoria
          </button>
          <button
            onClick={() => setActiveTab('tabla')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'tabla' 
                ? 'bg-[#E31B23] text-white shadow-xs' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Tabla de Posiciones
          </button>
        </div>
      </div>

      {activeTab === 'partidos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Matches List (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider px-1">
                Calendario de Juegos ({category})
              </h3>

              <div className="space-y-2.5">
                {categoryMatches.map((match) => {
                  const isSelected = match.id === activeMatch?.id;

                  return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatchId(match.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50/80 border-[#3B59A8] shadow-xs' 
                          : 'hover:bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                        <span className="text-[#3B59A8] font-bold">{match.date} · {match.time}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          match.status === 'Finalizado' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {match.status}
                        </span>
                      </div>

                      {/* Opponents & Score */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-xs font-extrabold text-neutral-900 block">
                            Charales Chapala
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {match.isHome ? 'Local' : 'Visitante'}
                          </span>
                        </div>

                        {match.status === 'Finalizado' ? (
                          <div className="px-3 py-1 bg-white border border-neutral-300 rounded-lg text-sm font-black font-mono">
                            {match.isHome ? `${match.scoreHome} - ${match.scoreAway}` : `${match.scoreAway} - ${match.scoreHome}`}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-neutral-400">VS</span>
                        )}

                        <div className="flex-1 text-right">
                          <span className="text-xs font-extrabold text-neutral-900 block truncate">
                            {match.opponent}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {match.isHome ? 'Visitante' : 'Local'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="truncate">{match.tournament.split('-')[0]}</span>
                        <span className="text-[#3B59A8] font-bold">{match.convokedPlayerIds.length} citados</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Match Detail & Squad Convocatoria (7 Cols) */}
          {activeMatch ? (
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
              <div className="pb-4 border-b border-neutral-200">
                <span className="text-[10px] font-extrabold tracking-wider text-[#E31B23] uppercase">
                  {activeMatch.tournament}
                </span>
                <h2 className="text-lg font-black text-[#111111] mt-0.5">
                  Charales de Chapala vs {activeMatch.opponent}
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-neutral-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    {activeMatch.date} ({activeMatch.time})
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {activeMatch.location} · {activeMatch.field}
                  </span>
                </div>
              </div>

              {/* Coach Technical Instruction */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong className="block mb-1 font-bold">Instrucciones y Citación Oficial:</strong>
                <p>{activeMatch.coachNotes || 'Citar a los muchachos 1 hora antes del inicio con hidratación personal.'}</p>
              </div>

              {/* Convocatoria Management */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#3B59A8]" />
                    Lista de Convocados ({activeMatch.convokedPlayerIds.length} Jugadores)
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Haz clic para convocar / desconvocar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categoryPlayers.map((player) => {
                    const isConvoked = activeMatch.convokedPlayerIds.includes(player.id);

                    return (
                      <div
                        key={player.id}
                        onClick={() => onTogglePlayerConvocatoria(activeMatch.id, player.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isConvoked 
                            ? 'bg-blue-50/70 border-[#3B59A8] text-neutral-900' 
                            : 'bg-[#F8F9FA] border-neutral-200 text-neutral-400 hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-md font-mono font-bold text-xs flex items-center justify-center ${
                            isConvoked ? 'bg-[#3B59A8] text-white' : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {player.dorsal}
                          </span>
                          <div>
                            <span className="text-xs font-bold block">{player.name}</span>
                            <span className="text-[10px] text-neutral-500">{player.position}</span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isConvoked ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          {isConvoked ? 'Convocado' : 'No convocado'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* Standings Table (HU-027 & HU-041) */
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-[#F8F9FA] border-b border-neutral-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Tabla General - Liga Regional Infantil Ribera de Chapala (Apertura 2026)
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Zona de Clasificación Directa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase text-[10px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 text-center">Pos</th>
                  <th className="py-3 px-4">Club / Equipo</th>
                  <th className="py-3 px-3 text-center">PJ</th>
                  <th className="py-3 px-3 text-center">PG</th>
                  <th className="py-3 px-3 text-center">PE</th>
                  <th className="py-3 px-3 text-center">PP</th>
                  <th className="py-3 px-3 text-center">GF</th>
                  <th className="py-3 px-3 text-center">GC</th>
                  <th className="py-3 px-3 text-center">DIF</th>
                  <th className="py-3 px-4 text-center font-black">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {standings.map((st, i) => (
                  <tr 
                    key={st.id} 
                    className={`${st.isCharales ? 'bg-blue-50/80 font-bold text-neutral-900' : 'hover:bg-neutral-50 text-neutral-700'}`}
                  >
                    <td className="py-3.5 px-4 text-center font-bold">
                      {i + 1}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold flex items-center gap-2">
                      {st.isCharales && (
                        <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
                      )}
                      <span>{st.team}</span>
                      {st.isCharales && (
                        <span className="text-[10px] bg-[#3B59A8] text-white px-1.5 py-0.2 rounded font-sans">
                          Mi Equipo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">{st.pj}</td>
                    <td className="py-3.5 px-3 text-center text-emerald-600">{st.pg}</td>
                    <td className="py-3.5 px-3 text-center text-amber-600">{st.pe}</td>
                    <td className="py-3.5 px-3 text-center text-red-600">{st.pp}</td>
                    <td className="py-3.5 px-3 text-center">{st.gf}</td>
                    <td className="py-3.5 px-3 text-center">{st.gc}</td>
                    <td className="py-3.5 px-3 text-center text-[#3B59A8] font-bold">
                      {st.dg > 0 ? `+${st.dg}` : st.dg}
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-sm text-[#111111]">
                      {st.pts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
