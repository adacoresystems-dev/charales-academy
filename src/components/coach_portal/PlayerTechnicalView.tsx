import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Award, 
  FileText, 
  Save, 
  TrendingUp, 
  CheckCircle2, 
  Plus, 
  Minus,
  Sparkles,
  Phone,
  Mail,
  HeartPulse
} from 'lucide-react';
import { Player, PlayerPosition, TechnicalSkills } from './types';
import { RadarChart } from './RadarChart';

interface PlayerTechnicalViewProps {
  category: string;
  players: Player[];
  onUpdatePlayerSkills: (playerId: string, updatedSkills: TechnicalSkills, observations: string) => void;
  onOpenPdfModal: (player: Player) => void;
}

export const PlayerTechnicalView: React.FC<PlayerTechnicalViewProps> = ({
  category,
  players,
  onUpdatePlayerSkills,
  onOpenPdfModal
}) => {
  const categoryPlayers = players.filter(p => p.category === category);
  
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    categoryPlayers[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('Todos');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activePlayer = categoryPlayers.find(p => p.id === selectedPlayerId) || categoryPlayers[0];

  // Local draft state for skills being edited
  const [draftSkills, setDraftSkills] = useState<TechnicalSkills>(
    activePlayer ? { ...activePlayer.currentSkills } : {
      control: 7, pase: 7, tiro: 7, velocidad: 7, tactica: 7, disciplina: 7
    }
  );
  const [draftObservations, setDraftObservations] = useState<string>(
    activePlayer?.coachObservations || ''
  );

  // Sync when active player changes
  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayerId(player.id);
    setDraftSkills({ ...player.currentSkills });
    setDraftObservations(player.coachObservations);
    setSaveSuccess(false);
  };

  const handleSkillChange = (key: keyof TechnicalSkills, val: number) => {
    const clamped = Math.min(10, Math.max(1, Number(val.toFixed(1))));
    setDraftSkills(prev => ({
      ...prev,
      [key]: clamped
    }));
  };

  const handleSaveEvaluation = () => {
    if (!activePlayer) return;
    onUpdatePlayerSkills(activePlayer.id, draftSkills, draftObservations);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Filtered players
  const filteredPlayers = categoryPlayers.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.dorsal.toString().includes(searchQuery);
    const matchPos = selectedPosition === 'Todos' || p.position === selectedPosition;
    return matchSearch && matchPos;
  });

  const getOverallAvg = (s: TechnicalSkills) => {
    const sum = s.control + s.pase + s.tiro + s.velocidad + s.tactica + s.disciplina;
    return (sum / 6).toFixed(1);
  };

  const skillFields = [
    { key: 'control' as keyof TechnicalSkills, label: 'Control y Dominio de Balón', desc: 'Recepción orientada, primer toque y amortiguación' },
    { key: 'pase' as keyof TechnicalSkills, label: 'Pase y Distribución', desc: 'Precisión corta y larga, timing y velocidad de balón' },
    { key: 'tiro' as keyof TechnicalSkills, label: 'Tiro y Definición', desc: 'Potencia, colocación y remate con ambos perfiles' },
    { key: 'velocidad' as keyof TechnicalSkills, label: 'Velocidad y Despliegue Físico', desc: 'Aceleración, cambio de ritmo, resistencia y agilidad' },
    { key: 'tactica' as keyof TechnicalSkills, label: 'Inteligencia Táctica', desc: 'Posicionamiento, coberturas, desmarques y visión' },
    { key: 'disciplina' as keyof TechnicalSkills, label: 'Disciplina y Actitud Deportiva', desc: 'Puntualidad, trabajo en equipo y respeto a compañeros y rivales' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-[#3B59A8] rounded-lg">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-[#111111]">
                Rendimiento Técnico y Evaluación Deportiva
              </h1>
              <p className="text-xs text-neutral-500">
                HU-024 · Registro cuantitativo y cualitativo de las 6 dimensiones formativas del jugador.
              </p>
            </div>
          </div>
        </div>

        {activePlayer && (
          <button
            onClick={() => onOpenPdfModal(activePlayer)}
            className="px-4 py-2.5 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generar Reporte PDF Oficial</span>
          </button>
        )}
      </div>

      {/* Main Grid: Player Roster (Left) & Evaluation Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player Selector & Search (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o dorsal..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8F9FA] border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#3B59A8] outline-none text-neutral-800"
              />
            </div>

            {/* Position Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {['Todos', 'Portero', 'Defensa', 'Mediocampista', 'Delantero'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedPosition === pos
                      ? 'bg-[#3B59A8] text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            {/* Players List */}
            <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-100">
              {filteredPlayers.length === 0 ? (
                <div className="p-4 text-center text-xs text-neutral-500">
                  No se encontraron jugadores.
                </div>
              ) : (
                filteredPlayers.map((player) => {
                  const isSelected = player.id === activePlayer?.id;
                  const currentAvg = getOverallAvg(player.currentSkills);

                  return (
                    <div
                      key={player.id}
                      onClick={() => handleSelectPlayer(player)}
                      className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-blue-50/80 border border-[#3B59A8] shadow-xs' 
                          : 'hover:bg-neutral-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-[#3B59A8] text-white' : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          #{player.dorsal}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">
                            {player.name}
                          </h4>
                          <span className="text-[11px] text-neutral-500">
                            {player.position} · Asist: {player.overallAttendanceRate}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-[#E31B23] font-mono tabular-nums">
                          {currentAvg}
                        </span>
                        <span className="text-[9px] text-neutral-400 block">/ 10</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Player Technical Evaluation Dossier (8 Cols) */}
        {activePlayer ? (
          <div className="lg:col-span-8 space-y-5">
            {/* Player Bio Strip */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#3B59A8] text-white font-mono font-black text-2xl flex items-center justify-center shadow-xs shrink-0">
                  #{activePlayer.dorsal}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-[#111111]">
                      {activePlayer.name}
                    </h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {activePlayer.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {activePlayer.position} · {activePlayer.category} · Nac: {activePlayer.birthDate}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-neutral-400" />
                      {activePlayer.tutorPhone} ({activePlayer.tutorName})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                <span className="text-[10px] font-bold text-neutral-500 uppercase">
                  Puntaje Técnico Global
                </span>
                <span className="text-3xl font-black text-[#3B59A8] font-mono tabular-nums">
                  {getOverallAvg(draftSkills)} <span className="text-sm font-normal text-neutral-400">/ 10</span>
                </span>
              </div>
            </div>

            {/* Interactive Technical Skills Form */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E31B23]" />
                  Evaluación de Dimensiones Técnicas
                </h3>
                <span className="text-xs text-neutral-500">
                  Escala de 1.0 a 10.0
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {skillFields.map(({ key, label, desc }) => {
                  const currentVal = draftSkills[key];

                  return (
                    <div key={key} className="p-3.5 bg-[#F8F9FA] rounded-xl border border-neutral-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-neutral-900">
                          {label}
                        </label>
                        <span className="text-base font-black text-[#3B59A8] font-mono tabular-nums">
                          {currentVal.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-tight">
                        {desc}
                      </p>

                      {/* Slider and quick buttons */}
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSkillChange(key, currentVal - 0.5)}
                          className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="0.1"
                          value={currentVal}
                          onChange={(e) => handleSkillChange(key, parseFloat(e.target.value))}
                          className="flex-1 accent-[#3B59A8] cursor-pointer"
                        />

                        <button
                          type="button"
                          onClick={() => handleSkillChange(key, currentVal + 0.5)}
                          className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Qualitative Coach Observations */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="text-xs font-bold text-neutral-900 block">
                  Notas Cualitativas de Desarrollo Deportivo y Observaciones:
                </label>
                <textarea
                  rows={3}
                  value={draftObservations}
                  onChange={(e) => setDraftObservations(e.target.value)}
                  placeholder="Documenta fortalezas observadas en entrenamientos, actitud, puntualidad y recomendaciones..."
                  className="w-full p-3 text-xs bg-[#F8F9FA] border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#3B59A8] outline-none text-neutral-900 leading-relaxed"
                />
              </div>

              {/* Save Button & Feedback */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                {saveSuccess ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Evaluación guardada exitosamente!
                  </span>
                ) : (
                  <span className="text-xs text-neutral-400">
                    Cambios listos para guardar en el expediente del jugador.
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleSaveEvaluation}
                  className="px-6 py-2.5 bg-[#3B59A8] hover:bg-[#2d4480] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Evaluación del Jugador</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 bg-white rounded-2xl border border-neutral-200 text-center text-xs text-neutral-500">
            Selecciona un jugador para ver y calificar su expediente técnico.
          </div>
        )}
      </div>
    </div>
  );
};
