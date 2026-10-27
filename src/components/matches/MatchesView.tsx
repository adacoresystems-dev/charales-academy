import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Plus,
  CheckCircle,
  Filter,
  Edit3,
  X,
  AlertCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Match, Tournament, Category, Role } from '../../types';
import { TournamentModal } from './TournamentModal';

interface MatchesViewProps {
  matches: Match[];
  tournaments: Tournament[];
  categories: Category[];
  currentRole: Role;
  onScheduleMatch: (matchData: Omit<Match, 'id' | 'estado'>) => void;
  onAddTournament?: (tournamentData: Omit<Tournament, 'id'>) => void;
  onUpdateMatchResult: (
    id: number,
    result: {
      golesFavor: number;
      golesContra: number;
      goleadores?: string;
      observaciones?: string;
    }
  ) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  tournaments,
  categories,
  currentRole,
  onScheduleMatch,
  onAddTournament,
  onUpdateMatchResult,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PROGRAMADO' | 'JUGADO'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTournament, setSelectedTournament] = useState<string>('all');

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [selectedMatchForScore, setSelectedMatchForScore] = useState<Match | null>(null);

  // Form Schedule Match
  const [torneoId, setTorneoId] = useState<number>(tournaments[0]?.id || 1);
  const [categoriaId, setCategoriaId] = useState<number>(categories[0]?.id || 1);
  const [equipoRival, setEquipoRival] = useState('');
  const [esLocal, setEsLocal] = useState(true);
  const [fecha, setFecha] = useState('2026-10-17');
  const [hora, setHora] = useState('10:00');
  const [sede, setSede] = useState('Cancha Principal (Pasto Sintético)');
  const [cancha, setCancha] = useState('Cancha 1');
  const [observaciones, setObservaciones] = useState('');

  // Form Score Record
  const [golesFavor, setGolesFavor] = useState<number>(2);
  const [golesContra, setGolesContra] = useState<number>(1);
  const [goleadores, setGoleadores] = useState('');
  const [scoreNotes, setScoreNotes] = useState('');

  const canEditMatches =
    currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA' || currentRole === 'ENTRENADOR';

  const filteredMatches = matches.filter((m) => {
    const matchesStatus = selectedFilter === 'ALL' || m.estado === selectedFilter;
    const matchesCat =
      selectedCategory === 'all' || String(m.categoriaId) === selectedCategory;
    const matchesTourney =
      selectedTournament === 'all' || String(m.torneoId) === selectedTournament;
    return matchesStatus && matchesCat && matchesTourney;
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipoRival.trim()) return;

    const tourney = tournaments.find((t) => t.id === torneoId);
    const cat = categories.find((c) => c.id === categoriaId);

    onScheduleMatch({
      torneoId,
      torneoNombre: tourney?.nombre || 'Torneo Formativo',
      categoriaId,
      categoriaNombre: cat?.nombre || 'Categoría',
      equipoRival: equipoRival.trim(),
      esLocal,
      fecha,
      hora,
      sede,
      cancha,
      observaciones: observaciones.trim() || undefined,
    });

    setShowScheduleModal(false);
    setEquipoRival('');
    setObservaciones('');
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForScore) return;

    onUpdateMatchResult(selectedMatchForScore.id, {
      golesFavor,
      golesContra,
      goleadores: goleadores.trim() || undefined,
      observaciones: scoreNotes.trim() || undefined,
    });

    setSelectedMatchForScore(null);
    setGoleadores('');
    setScoreNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-neutral-900 tracking-tight">
            Torneos, Ligas y Partidos
          </h1>
          <p className="text-xs text-neutral-500">
            Jornadas competitivas, ligas de la ribera, copas oficiales y registro de marcadores
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentRole === 'ADMINISTRADOR' && onAddTournament && (
            <button
              onClick={() => setShowTournamentModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#E31B23] hover:bg-[#c9151c] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>+ Agregar Liga o Torneo</span>
            </button>
          )}

          {canEditMatches && (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#3B59A8] hover:bg-[#2d4480] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Programar Partido</span>
            </button>
          )}
        </div>
      </div>

      {/* Tournaments in Progress Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#E31B23]" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-700">
              Ligas y Torneos Registrados ({tournaments.length})
            </h2>
          </div>
          {currentRole === 'ADMINISTRADOR' && onAddTournament && (
            <button
              onClick={() => setShowTournamentModal(true)}
              className="text-xs font-bold text-[#3B59A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Competición</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((tourney) => {
            const tourneyMatches = matches.filter((m) => m.torneoId === tourney.id);
            const isSelected = selectedTournament === String(tourney.id);

            return (
              <div
                key={tourney.id}
                className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-[#3B59A8] ring-2 ring-[#3B59A8]/20 shadow-sm'
                    : 'border-neutral-200/90 shadow-2xs hover:border-[#3B59A8]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10.5px] font-bold text-amber-800 uppercase tracking-wider block truncate">
                        {tourney.tipo} · {tourney.temporada}
                      </span>
                      <h3 className="font-bold text-neutral-900 text-sm truncate" title={tourney.nombre}>
                        {tourney.nombre}
                      </h3>
                      <span className="text-[11px] text-neutral-500 block truncate">
                        Org: {tourney.organizador}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      tourney.estatus === 'EN_CURSO'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tourney.estatus === 'FINALIZADO'
                        ? 'bg-neutral-100 text-neutral-700'
                        : 'bg-blue-100 text-[#3B59A8]'
                    }`}
                  >
                    {tourney.estatus}
                  </span>
                </div>

                {/* Dates and Categories */}
                <div className="pt-2 border-t border-neutral-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>{tourney.fechaInicio} al {tourney.fechaFin}</span>
                    </span>
                    <span className="font-bold text-neutral-700">
                      {tourneyMatches.length} partidos
                    </span>
                  </div>

                  {/* Enrolled Categories */}
                  <div className="flex flex-wrap gap-1">
                    {tourney.categoriasInscritas.map((catId) => {
                      const catObj = categories.find((c) => c.id === catId);
                      return (
                        <span
                          key={catId}
                          className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-semibold"
                        >
                          {catObj?.nombre || `Cat #${catId}`}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTournament(isSelected ? 'all' : String(tourney.id))
                    }
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#3B59A8] text-white'
                        : 'text-[#3B59A8] hover:bg-blue-50'
                    }`}
                  >
                    {isSelected ? 'Ver Todos' : 'Filtrar Partidos'}
                  </button>

                  {canEditMatches && (
                    <button
                      type="button"
                      onClick={() => {
                        setTorneoId(tourney.id);
                        if (tourney.categoriasInscritas.length > 0) {
                          setCategoriaId(tourney.categoriasInscritas[0]);
                        }
                        setShowScheduleModal(true);
                      }}
                      className="text-xs font-bold text-neutral-600 hover:text-[#E31B23] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Programar Juego</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Status segmented tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos los Partidos
          </button>
          <button
            onClick={() => setSelectedFilter('PROGRAMADO')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedFilter === 'PROGRAMADO'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Próximos Juegos
          </button>
          <button
            onClick={() => setSelectedFilter('JUGADO')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedFilter === 'JUGADO'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resultados Oficiales
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tournament filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Torneo:</span>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] text-slate-700 font-semibold"
            >
              <option value="all">Todos los Torneos</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Grupo:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] text-slate-700 font-semibold"
            >
              <option value="all">Todas las Categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{match.categoriaNombre}</span>
              <span className="text-slate-400 font-medium">{match.torneoNombre}</span>
            </div>

            {/* Score or Match Lineup */}
            <div className="py-2 flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-900 block">Charales de Chapala</span>
                <span className="text-[11px] text-rose-600 font-medium">
                  {match.esLocal ? 'Local' : 'Visitante'}
                </span>
              </div>

              {match.estado === 'JUGADO' ? (
                <div className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-black text-lg tracking-wider tabular-nums">
                  {match.golesFavor} - {match.golesContra}
                </div>
              ) : (
                <div className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                  VS
                </div>
              )}

              <div className="flex-1 text-right">
                <span className="text-sm font-bold text-slate-900 block truncate">
                  {match.equipoRival}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {!match.esLocal ? 'Local' : 'Visitante'}
                </span>
              </div>
            </div>

            {/* Match Date, Time and Venue */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {match.fecha} · {match.hora}
                </span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{match.sede}</span>
              </div>
            </div>

            {/* Scorers or Notes */}
            {match.goleadores && (
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-900">
                <span className="font-bold">Goleadores: </span>
                <span>{match.goleadores}</span>
              </div>
            )}

            {match.observaciones && (
              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                "{match.observaciones}"
              </p>
            )}

            {/* Action to update score (Coaches / Admins) */}
            {canEditMatches && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedMatchForScore(match);
                    setGolesFavor(match.golesFavor ?? 0);
                    setGolesContra(match.golesContra ?? 0);
                    setGoleadores(match.goleadores ?? '');
                    setScoreNotes(match.observaciones ?? '');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>
                    {match.estado === 'JUGADO' ? 'Editar Marcador' : 'Registrar Resultado'}
                  </span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Schedule Match */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Programar Partido de Torneo</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Competencia / Torneo:</label>
                <select
                  value={torneoId}
                  onChange={(e) => setTorneoId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoría:</label>
                  <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Condición:</label>
                  <select
                    value={esLocal ? 'LOCAL' : 'VISITA'}
                    onChange={(e) => setEsLocal(e.target.value === 'LOCAL')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="LOCAL">Local</option>
                    <option value="VISITA">Visitante</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Equipo Rival *:</label>
                <input
                  required
                  type="text"
                  value={equipoRival}
                  onChange={(e) => setEquipoRival(e.target.value)}
                  placeholder="Ej. Atlas Filial Zapopan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha:</label>
                  <input
                    required
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hora de Inicio:</label>
                  <input
                    required
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sede / Cancha:</label>
                <input
                  type="text"
                  value={sede}
                  onChange={(e) => setSede(e.target.value)}
                  placeholder="Ej. Cancha Principal (Pasto Sintético)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Indicaciones para Padres / Uniforme:
                </label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ej. Presentarse con uniforme titular azul a las 09:15..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirmar Partido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Match Result */}
      {selectedMatchForScore && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Registrar Marcador Oficial</h3>
                <span className="text-xs text-slate-500">
                  {selectedMatchForScore.categoriaNombre} vs {selectedMatchForScore.equipoRival}
                </span>
              </div>
              <button
                onClick={() => setSelectedMatchForScore(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScoreSubmit} className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-around">
                <div className="text-center space-y-1">
                  <span className="font-bold text-slate-700 block">Charales de Chapala</span>
                  <input
                    type="number"
                    min={0}
                    value={golesFavor}
                    onChange={(e) => setGolesFavor(Number(e.target.value))}
                    className="w-16 p-2 text-center text-xl font-black bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <span className="text-lg font-bold text-slate-400">-</span>

                <div className="text-center space-y-1">
                  <span className="font-bold text-slate-700 block truncate max-w-[120px]">
                    {selectedMatchForScore.equipoRival}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={golesContra}
                    onChange={(e) => setGolesContra(Number(e.target.value))}
                    className="w-16 p-2 text-center text-xl font-black bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Anotadores de Charales de Chapala:
                </label>
                <input
                  type="text"
                  value={goleadores}
                  onChange={(e) => setGoleadores(e.target.value)}
                  placeholder="Ej. Alumno demo 94 (2), Alumno demo 97 (1)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Resumen o Notas del Encuentro:
                </label>
                <textarea
                  rows={2}
                  value={scoreNotes}
                  onChange={(e) => setScoreNotes(e.target.value)}
                  placeholder="Ej. Gran desempeño defensivo y juego asociativo..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMatchForScore(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Guardar Marcador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tournament Modal (For adding leagues and tournaments) */}
      {onAddTournament && (
        <TournamentModal
          categories={categories}
          isOpen={showTournamentModal}
          onClose={() => setShowTournamentModal(false)}
          onAddTournament={onAddTournament}
        />
      )}
    </div>
  );
};
