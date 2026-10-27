import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Check, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Save, 
  RotateCcw, 
  Calendar, 
  CheckCheck,
  FileEdit,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Player, TrainingSession, AttendanceStatus } from './types';

interface AttendanceViewProps {
  category: string;
  players: Player[];
  sessions: TrainingSession[];
  onUpdateSessionAttendance: (sessionId: string, attendance: { playerId: string; status: AttendanceStatus; note?: string }[], observations?: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  category,
  players,
  sessions,
  onUpdateSessionAttendance
}) => {
  const categoryPlayers = players.filter(p => p.category === category);
  const categorySessions = sessions.filter(s => s.category === category);

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    categorySessions[0]?.id || ''
  );

  const currentSession = categorySessions.find(s => s.id === selectedSessionId) || categorySessions[0];

  // Local state for interactive editing before save
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; note: string }> = {};
    if (currentSession) {
      categoryPlayers.forEach(player => {
        const recorded = currentSession.attendance.find(a => a.playerId === player.id);
        initial[player.id] = {
          status: recorded ? recorded.status : 'presente',
          note: recorded?.note || ''
        };
      });
    }
    return initial;
  });

  const [sessionObservations, setSessionObservations] = useState<string>(
    currentSession?.observations || ''
  );
  const [showSaveNotice, setShowSaveNotice] = useState(false);

  // Update map when session changes
  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
    const sess = categorySessions.find(s => s.id === id);
    if (sess) {
      const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
      categoryPlayers.forEach(player => {
        const recorded = sess.attendance.find(a => a.playerId === player.id);
        updated[player.id] = {
          status: recorded ? recorded.status : 'presente',
          note: recorded?.note || ''
        };
      });
      setAttendanceMap(updated);
      setSessionObservations(sess.observations || '');
    }
  };

  const handleStatusChange = (playerId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        status
      }
    }));
  };

  const handleNoteChange = (playerId: string, note: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        note
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    categoryPlayers.forEach(player => {
      updated[player.id] = {
        status: 'presente',
        note: attendanceMap[player.id]?.note || ''
      };
    });
    setAttendanceMap(updated);
  };

  const handleSave = () => {
    if (!currentSession) return;
    const formattedAttendance = categoryPlayers.map(p => ({
      playerId: p.id,
      status: attendanceMap[p.id]?.status || 'presente',
      note: attendanceMap[p.id]?.note
    }));

    onUpdateSessionAttendance(currentSession.id, formattedAttendance, sessionObservations);
    setShowSaveNotice(true);
    setTimeout(() => setShowSaveNotice(false), 3000);
  };

  // Calculate live stats
  const totalCount = categoryPlayers.length;
  const counts = Object.values(attendanceMap).reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    },
    { presente: 0, retardo: 0, justificado: 0, ausente: 0 } as Record<AttendanceStatus, number>
  );

  const attendanceRate = totalCount > 0 
    ? Math.round(((counts.presente + counts.retardo) / totalCount) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-50 text-[#E31B23] rounded-lg">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-[#111111]">
                Registro y Control de Asistencia
              </h1>
              <p className="text-xs text-neutral-500">
                HU-030 · Registra la asistencia diaria por entrenamiento y bitácora técnica de la sesión.
              </p>
            </div>
          </div>
        </div>

        {/* Session Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-neutral-600">Sesión:</label>
          <select
            value={selectedSessionId}
            onChange={(e) => handleSelectSession(e.target.value)}
            className="bg-[#F8F9FA] border border-neutral-300 text-xs font-semibold text-neutral-900 py-2 px-3 rounded-xl focus:ring-2 focus:ring-[#3B59A8] outline-none"
          >
            {categorySessions.map(sess => (
              <option key={sess.id} value={sess.id}>
                {sess.date} - {sess.title.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center">
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Asistencia Global</span>
          <span className="text-2xl font-black text-[#3B59A8] font-mono tabular-nums">
            {attendanceRate}%
          </span>
          <span className="text-[10px] text-neutral-400 block">{counts.presente + counts.retardo} de {totalCount}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center">
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Presentes</span>
          <span className="text-2xl font-black text-emerald-600 font-mono tabular-nums">
            {counts.presente}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block">Puntuales</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center">
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Retardos</span>
          <span className="text-2xl font-black text-amber-500 font-mono tabular-nums">
            {counts.retardo}
          </span>
          <span className="text-[10px] text-amber-700 block">Con tolerancia</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center">
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Justificados</span>
          <span className="text-2xl font-black text-[#3B59A8] font-mono tabular-nums">
            {counts.justificado}
          </span>
          <span className="text-[10px] text-neutral-400 block">Aviso del tutor</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-neutral-500 uppercase block">Inasistencias</span>
          <span className="text-2xl font-black text-[#E31B23] font-mono tabular-nums">
            {counts.ausente}
          </span>
          <span className="text-[10px] text-red-600 block">Falta sin aviso</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Marcar Todos Presentes</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {showSaveNotice && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              ¡Asistencia guardada correctamente!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Lista de Asistencia</span>
          </button>
        </div>
      </div>

      {/* Players Attendance List */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Dorsal</th>
                <th className="py-3.5 px-4">Jugador</th>
                <th className="py-3.5 px-4">Posición</th>
                <th className="py-3.5 px-4 text-center">Estado de Asistencia</th>
                <th className="py-3.5 px-4">Observación / Justificante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categoryPlayers.map((player) => {
                const currentStatus = attendanceMap[player.id]?.status || 'presente';
                const currentNote = attendanceMap[player.id]?.note || '';

                return (
                  <tr key={player.id} className="hover:bg-neutral-50/80 transition-colors">
                    {/* Dorsal */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="w-7 h-7 rounded-full bg-neutral-100 font-mono font-bold text-neutral-800 flex items-center justify-center mx-auto text-xs">
                        {player.dorsal}
                      </span>
                    </td>

                    {/* Player Info */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-neutral-900 block text-sm">
                          {player.name}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Tutor: {player.tutorName} ({player.tutorPhone})
                        </span>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-neutral-700">
                        {player.position}
                      </span>
                    </td>

                    {/* 4-State Quick Action Buttons */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5 p-1 bg-[#F8F9FA] rounded-xl border border-neutral-200 max-w-xs mx-auto">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(player.id, 'presente')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === 'presente'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-neutral-600 hover:text-emerald-700'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>Presente</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(player.id, 'retardo')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === 'retardo'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-neutral-600 hover:text-amber-700'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>Retardo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(player.id, 'justificado')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === 'justificado'
                              ? 'bg-[#3B59A8] text-white shadow-xs'
                              : 'text-neutral-600 hover:text-[#3B59A8]'
                          }`}
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Justif.</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(player.id, 'ausente')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === 'ausente'
                              ? 'bg-[#E31B23] text-white shadow-xs'
                              : 'text-neutral-600 hover:text-[#E31B23]'
                          }`}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Ausente</span>
                        </button>
                      </div>
                    </td>

                    {/* Note input */}
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        value={currentNote}
                        onChange={(e) => handleNoteChange(player.id, e.target.value)}
                        placeholder="Nota o motivo (ej. tráfico, molestia muscular)..."
                        className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:border-[#3B59A8] focus:ring-1 focus:ring-[#3B59A8] outline-none text-neutral-800"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* HU-031: Bitácora & Observaciones Generales de la Sesión */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-[#3B59A8]" />
          <div>
            <h3 className="text-sm font-bold text-[#111111]">
              Bitácora y Observaciones Generales de la Sesión (HU-031)
            </h3>
            <p className="text-xs text-neutral-500">
              Documenta lo trabajado, clima, incidentes y aspectos tácticos a reforzar en el siguiente entrenamiento.
            </p>
          </div>
        </div>

        <textarea
          rows={3}
          value={sessionObservations}
          onChange={(e) => setSessionObservations(e.target.value)}
          placeholder="Escribe aquí las observaciones generales del entrenamiento (ej. 'Excelente intensidad en el trabajo de 3 vs 2. Se reforzó la presión tras pérdida y la definición de primera intención')..."
          className="w-full p-3 text-xs bg-[#F8F9FA] border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#3B59A8] outline-none text-neutral-900 leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#3B59A8] hover:bg-[#2d4480] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Actualizar Bitácora de la Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
