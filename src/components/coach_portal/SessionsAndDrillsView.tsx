import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Activity, 
  CheckCircle, 
  Plus, 
  FileText,
  Dumbbell,
  Compass,
  AlertCircle
} from 'lucide-react';
import { TrainingSession } from './types';

interface SessionsAndDrillsViewProps {
  category: string;
  sessions: TrainingSession[];
  onAddNewSession: (newSession: TrainingSession) => void;
  onNavigateToAttendance: () => void;
}

export const SessionsAndDrillsView: React.FC<SessionsAndDrillsViewProps> = ({
  category,
  sessions,
  onAddNewSession,
  onNavigateToAttendance
}) => {
  const categorySessions = sessions.filter(s => s.category === category);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    categorySessions[0]?.id || ''
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form for new session planning
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-10-23');
  const [newTime, setNewTime] = useState('16:30 - 18:00');
  const [newField, setNewField] = useState('Cancha Principal Usuario Rayo');
  const [newObjective, setNewObjective] = useState('');
  const [newWarmup, setNewWarmup] = useState('');
  const [newMain, setNewMain] = useState('');
  const [newCooldown, setNewCooldown] = useState('');
  const [newMaterials, setNewMaterials] = useState('18 Balones No. 4, 15 Conos, 10 Casacas');

  const activeSession = categorySessions.find(s => s.id === selectedSessionId) || categorySessions[0];

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newObjective) return;

    const session: TrainingSession = {
      id: `session-${Date.now()}`,
      date: newDate,
      time: newTime,
      category,
      field: newField,
      title: newTitle,
      objective: newObjective,
      warmupDrill: newWarmup || '15 min: Calentamiento dinámico y movilidad articular activa.',
      mainDrill: newMain || '45 min: Ejercicios técnico-tácticos con finalización a portería.',
      cooldownDrill: newCooldown || '15 min: Estiramientos guiados y charla técnica de cierre.',
      materialsNeeded: newMaterials.split(',').map(m => m.trim()),
      observations: 'Sesión programada por el cuerpo técnico.',
      completed: false,
      attendance: []
    };

    onAddNewSession(session);
    setSelectedSessionId(session.id);
    setShowCreateModal(false);
    // Reset
    setNewTitle('');
    setNewObjective('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-[#3B59A8] rounded-lg">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-[#111111]">
                Actividades, Horarios y Sesiones de Entrenamiento
              </h1>
              <p className="text-xs text-neutral-500">
                HU-025 y HU-029 · Consulta cronograma semanal y prepara la planificación de ejercicios de cada sesión.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Planificar Nueva Sesión</span>
        </button>
      </div>

      {/* Weekly Schedule Matrix (HU-025 Horarios) */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Horarios Habituales de Cancha Asignados ({category})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 flex items-start gap-3">
            <div className="p-2 bg-blue-100 text-[#3B59A8] rounded-lg font-bold text-xs shrink-0">
              LUN
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 block">16:30 - 18:00 hrs</span>
              <span className="text-[11px] text-neutral-600 block">Cancha 2 Anexa (Pasto Sintético)</span>
              <span className="text-[10px] text-neutral-400">Enfoque: Técnica individual y rondos</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-[#3B59A8]/40 flex items-start gap-3">
            <div className="p-2 bg-[#3B59A8] text-white rounded-lg font-bold text-xs shrink-0">
              MIÉ
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 block">16:30 - 18:00 hrs (Hoy)</span>
              <span className="text-[11px] text-neutral-600 block">Cancha Principal Usuario Rayo</span>
              <span className="text-[10px] text-[#3B59A8] font-semibold">Enfoque: Táctica colectiva y definición</span>
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 flex items-start gap-3">
            <div className="p-2 bg-red-100 text-[#E31B23] rounded-lg font-bold text-xs shrink-0">
              VIE
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 block">16:30 - 18:00 hrs</span>
              <span className="text-[11px] text-neutral-600 block">Cancha Principal Usuario Rayo</span>
              <span className="text-[10px] text-neutral-400">Enfoque: Balón parado y fútbol recreativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Sessions List & Detailed Workout Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sessions list (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider px-1">
            Sesiones Programadas
          </h3>
          <div className="space-y-2">
            {categorySessions.map((session) => {
              const isSelected = session.id === activeSession?.id;

              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/80 border-[#3B59A8] shadow-xs' 
                      : 'hover:bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                    <span className="text-[#3B59A8] font-mono">{session.date}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      session.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {session.completed ? 'Realizado' : 'Próximo'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    {session.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    {session.time} · {session.field.split('(')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Session Plan (8 cols) */}
        {activeSession ? (
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider text-[#3B59A8] uppercase">
                  Ficha Metodológica de Entrenamiento
                </span>
                <h2 className="text-lg font-black text-[#111111] mt-0.5">
                  {activeSession.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-neutral-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    {activeSession.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    {activeSession.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {activeSession.field}
                  </span>
                </div>
              </div>

              <button
                onClick={onNavigateToAttendance}
                className="px-4 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Pasar Asistencia a Esta Sesión</span>
              </button>
            </div>

            {/* Tactical Objective */}
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-neutral-200">
              <strong className="text-xs font-bold text-neutral-900 uppercase tracking-wider block mb-1">
                Objetivo Principal de Aprendizaje:
              </strong>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {activeSession.objective}
              </p>
            </div>

            {/* 3 Workout Phases */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Desarrollo Cronológico de la Sesión
              </h3>

              {/* Phase 1: Calentamiento */}
              <div className="p-4 bg-white rounded-xl border border-neutral-200 border-l-4 border-l-[#3B59A8] space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#3B59A8]">
                    Fase 1: Activación y Movilidad (15 min)
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-mono">16:30 - 16:45</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {activeSession.warmupDrill}
                </p>
              </div>

              {/* Phase 2: Parte Principal */}
              <div className="p-4 bg-white rounded-xl border border-neutral-200 border-l-4 border-l-[#E31B23] space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#E31B23]">
                    Fase 2: Parte Principal Técnico-Táctica (45 min)
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-mono">16:45 - 17:30</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {activeSession.mainDrill}
                </p>
              </div>

              {/* Phase 3: Vuelta a la calma */}
              <div className="p-4 bg-white rounded-xl border border-neutral-200 border-l-4 border-l-emerald-600 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-700">
                    Fase 3: Vuelta a la Calma y Charla Pedagógica (15 min)
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-mono">17:30 - 17:45</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {activeSession.cooldownDrill}
                </p>
              </div>
            </div>

            {/* Material & Observations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-xs">
                <strong className="text-neutral-900 block mb-1">Material Requerido:</strong>
                <ul className="list-disc list-inside text-neutral-600 space-y-0.5">
                  {activeSession.materialsNeeded.map((mat, i) => (
                    <li key={i}>{mat}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-xs">
                <strong className="text-neutral-900 block mb-1">Observaciones Previas:</strong>
                <p className="text-neutral-600 italic">
                  "{activeSession.observations}"
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Plan New Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-[#111111] mb-1">
              Planificar Nueva Sesión de Entrenamiento
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Completa el formato de sesión para la categoría {category}.
            </p>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-800 block mb-1">Título de la Sesión *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej. Presión tras pérdida y desmarque de apoyo"
                  className="w-full p-2.5 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Horario</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="16:30 - 18:00"
                    className="w-full p-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">Cancha</label>
                <select
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  className="w-full p-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none"
                >
                  <option value="Cancha Principal Usuario Rayo">Cancha Principal Usuario Rayo (Pasto Natural)</option>
                  <option value="Cancha 2 Anexa">Cancha 2 Anexa (Pasto Sintético)</option>
                  <option value="Cancha 3 Fútbol 7">Cancha 3 Fútbol 7 Infantil</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">Objetivo Táctico Principal *</label>
                <textarea
                  rows={2}
                  required
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="ej. Trabajar el repliegue defensivo del bloque medio ante contragolpes directos."
                  className="w-full p-2.5 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">Ejercicio Fase Principal (45 min)</label>
                <textarea
                  rows={2}
                  value={newMain}
                  onChange={(e) => setNewMain(e.target.value)}
                  placeholder="ej. Circuito de posesión en espacio reducido 6 vs 6 con 2 comodines."
                  className="w-full p-2.5 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B59A8] hover:bg-[#2d4480] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Guardar Plan de Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
