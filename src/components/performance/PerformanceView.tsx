import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Star,
  Plus,
  Printer,
  User,
  CheckCircle2,
  Calendar,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { PerformanceEvaluation, Player, Role } from '../../types';

interface PerformanceViewProps {
  evaluations: PerformanceEvaluation[];
  players: Player[];
  currentRole: Role;
  onSaveEvaluation: (
    evalData: Omit<
      PerformanceEvaluation,
      'id' | 'evaluadorId' | 'evaluadorNombre' | 'fecha'
    >
  ) => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  evaluations,
  players,
  currentRole,
  onSaveEvaluation,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(players[0]?.id || 1);
  const [showNewEvalModal, setShowNewEvalModal] = useState(false);

  // New Eval Form State
  const [periodo, setPeriodo] = useState('Ciclo Evaluativo Octubre 2026');
  const [controlBalon, setControlBalon] = useState(8);
  const [pase, setPase] = useState(8);
  const [tiroDefinicion, setTiroDefinicion] = useState(8);
  const [velocidadAgilidad, setVelocidadAgilidad] = useState(8);
  const [resistencia, setResistencia] = useState(8);
  const [posicionamientoTactico, setPosicionamientoTactico] = useState(8);
  const [disciplinaCompromiso, setDisciplinaCompromiso] = useState(9);
  const [trabajoEnEquipo, setTrabajoEnEquipo] = useState(9);
  const [fortalezas, setFortalezas] = useState('');
  const [areasMejora, setAreasMejora] = useState('');
  const [destacado, setDestacado] = useState(false);

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId) || players[0];
  const playerEvals = evaluations.filter((e) => e.jugadorId === selectedPlayerId);
  const latestEval = playerEvals[0] || evaluations[0];

  const canCreateEvaluation =
    currentRole === 'ADMINISTRADOR' || currentRole === 'ENTRENADOR';

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEvaluation({
      jugadorId: selectedPlayerId,
      periodo,
      controlBalon,
      pase,
      tiroDefinicion,
      velocidadAgilidad,
      resistencia,
      posicionamientoTactico,
      disciplinaCompromiso,
      trabajoEnEquipo,
      comentariosFortalezas: fortalezas.trim() || 'Constancia y dedicación constante en los entrenamientos.',
      areasDeMejora: areasMejora.trim() || 'Continuar practicando los fundamentos técnicos con ambos perfiles.',
      destacadoSemana: destacado,
    });

    setShowNewEvalModal(false);
  };

  const skillsList = latestEval
    ? [
        { label: 'Control de Balón', score: latestEval.controlBalon },
        { label: 'Pase y Precisión', score: latestEval.pase },
        { label: 'Tiro y Definición', score: latestEval.tiroDefinicion },
        { label: 'Velocidad & Agilidad', score: latestEval.velocidadAgilidad },
        { label: 'Resistencia Física', score: latestEval.resistencia },
        { label: 'Táctica & Ubicación', score: latestEval.posicionamientoTactico },
        { label: 'Disciplina y Puntualidad', score: latestEval.disciplinaCompromiso },
        { label: 'Trabajo en Equipo', score: latestEval.trabajoEnEquipo },
      ]
    : [];

  const overallAverage = latestEval
    ? (
        skillsList.reduce((acc, s) => acc + s.score, 0) / skillsList.length
      ).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Progreso Individual y Reportes de Rendimiento
          </h1>
          <p className="text-xs text-slate-500">
            Evaluación técnica, fundamentos motores, actitud deportiva y radar de habilidades
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canCreateEvaluation && (
            <button
              onClick={() => setShowNewEvalModal(true)}
              className="px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Evaluación</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ficha</span>
          </button>
        </div>
      </div>

      {/* Select Player Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <User className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-700">Seleccionar Alumno a Consultar:</span>
        <select
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellidoPaterno} ({p.categoriaActualNombre})
            </option>
          ))}
        </select>
      </div>

      {/* Main Performance Sheet */}
      {latestEval ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Header of Report Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-2xl flex items-center justify-center">
                {selectedPlayer?.numeroCamiseta
                  ? `#${selectedPlayer.numeroCamiseta}`
                  : selectedPlayer?.nombre[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {selectedPlayer?.nombre} {selectedPlayer?.apellidoPaterno}
                  </h2>
                  {latestEval.destacadoSemana && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-600" />
                      <span>Destacado de la Semana</span>
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-emerald-700">
                    {selectedPlayer?.categoriaActualNombre}
                  </span>
                  <span>·</span>
                  <span>{selectedPlayer?.posicionHabitual}</span>
                  <span>·</span>
                  <span>{latestEval.periodo}</span>
                </div>
              </div>
            </div>

            {/* Overall Score Circle */}
            <div className="text-right sm:text-center p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Promedio Global
              </span>
              <span className="text-3xl font-black text-emerald-600 tabular-nums font-mono">
                {overallAverage}
                <span className="text-sm font-normal text-slate-400">/10</span>
              </span>
            </div>
          </div>

          {/* 8 Technical Fundamentals Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Evaluación por Fundamentos y Cualidades
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {skillsList.map((skill, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{skill.label}</span>
                    <span className="font-black text-emerald-600 tabular-nums font-mono text-sm">
                      {skill.score}/10
                    </span>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        skill.score >= 9
                          ? 'bg-emerald-500'
                          : skill.score >= 7
                          ? 'bg-teal-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${skill.score * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coach's Qualitative Feedback (HU-031) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
              <span className="font-bold text-emerald-900 block text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fortalezas Observadas en Juego:</span>
              </span>
              <p className="text-slate-700 leading-relaxed">
                {latestEval.comentariosFortalezas}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-2">
              <span className="font-bold text-blue-900 block text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Recomendaciones y Áreas de Trabajo:</span>
              </span>
              <p className="text-slate-700 leading-relaxed">
                {latestEval.areasDeMejora}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Evaluado por: Prof. {latestEval.evaluadorNombre}</span>
            <span>Fecha de emisión: {latestEval.fecha}</span>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
          No existen evaluaciones registradas para este alumno.
        </div>
      )}

      {/* Modal: New Evaluation Form */}
      {showNewEvalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Registrar Nueva Evaluación Técnica
              </h3>
              <span className="text-xs text-slate-500">{selectedPlayer?.nombre}</span>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Periodo de la Evaluación:
                </label>
                <input
                  type="text"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Sliders for Skills 1-10 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {[
                  { label: 'Control de Balón', val: controlBalon, set: setControlBalon },
                  { label: 'Pase y Precisión', val: pase, set: setPase },
                  { label: 'Tiro y Definición', val: tiroDefinicion, set: setTiroDefinicion },
                  { label: 'Velocidad & Agilidad', val: velocidadAgilidad, set: setVelocidadAgilidad },
                  { label: 'Resistencia Física', val: resistencia, set: setResistencia },
                  { label: 'Táctica & Posición', val: posicionamientoTactico, set: setPosicionamientoTactico },
                  { label: 'Disciplina y Puntualidad', val: disciplinaCompromiso, set: setDisciplinaCompromiso },
                  { label: 'Trabajo en Equipo', val: trabajoEnEquipo, set: setTrabajoEnEquipo },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{item.label}:</span>
                      <span className="font-bold text-emerald-700">{item.val}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={item.val}
                      onChange={(e) => item.set(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Fortalezas y Aspectos Positivos:
                </label>
                <textarea
                  rows={2}
                  value={fortalezas}
                  onChange={(e) => setFortalezas(e.target.value)}
                  placeholder="Ej. Excelente visión de campo y cambio de ritmo..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Áreas de Mejora para las Próximas Semanas:
                </label>
                <textarea
                  rows={2}
                  value={areasMejora}
                  onChange={(e) => setAreasMejora(e.target.value)}
                  placeholder="Ej. Trabajar la pegada de zurda y respiración continua..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-destacado"
                  checked={destacado}
                  onChange={(e) => setDestacado(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="chk-destacado" className="font-semibold text-slate-700 cursor-pointer">
                  Marcar como alumno destacado de la semana
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewEvalModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Guardar Evaluación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
