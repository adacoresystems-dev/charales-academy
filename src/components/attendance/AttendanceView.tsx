import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle,
  XCircle,
  HelpCircle,
  Users,
  MapPin,
  Clock,
  Sparkles,
  Save,
  CheckCircle2,
  Plus,
  Edit2,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Shield,
  UserCheck,
  Building,
} from 'lucide-react';
import {
  Category,
  TrainingSession,
  Player,
  AttendanceRecord,
  AttendanceStatus,
  Role,
  Venue,
  Coach,
} from '../../types';

interface AttendanceViewProps {
  categories: Category[];
  sessions: TrainingSession[];
  players: Player[];
  attendance: AttendanceRecord[];
  venues?: Venue[];
  coaches?: Coach[];
  currentRole: Role;
  onRegisterAttendance: (
    sesionId: number,
    records: {
      jugadorId: number;
      jugadorNombre: string;
      estado: AttendanceStatus;
      observacion?: string;
    }[],
    sessionNotes?: { objetivo?: string; observaciones?: string }
  ) => void;
  onAddVenue?: (venue: Omit<Venue, 'id'>) => void;
  onUpdateCategoryTraining?: (
    categoryId: number,
    data: {
      sedeId: number;
      sedeNombre: string;
      diasEntrenamiento: string[];
      horario: string;
      entrenadorIds: number[];
      entrenadoresNombres: string[];
    }
  ) => void;
  onAddTrainingSession?: (session: Omit<TrainingSession, 'id' | 'estado'>) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  categories,
  sessions,
  players,
  attendance,
  venues = [],
  coaches = [],
  currentRole,
  onRegisterAttendance,
  onAddVenue,
  onUpdateCategoryTraining,
  onAddTrainingSession,
}) => {
  // Check role: attendance is ONLY for coach; pitch & schedule administration is for admin
  const isCoach = currentRole === 'ENTRENADOR';
  const isAdmin = currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA';

  // ----------------------------------------------------------------------
  // ADMIN STATE: CANCHAS, HORARIOS Y ASIGNACIÓN
  // ----------------------------------------------------------------------
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddVenueModal, setShowAddVenueModal] = useState(false);
  const [showScheduleSessionModal, setShowScheduleSessionModal] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);

  // Assignment Modal Form
  const [selectedCatId, setSelectedCatId] = useState<number>(categories[0]?.id || 1);
  const [selectedVenueId, setSelectedVenueId] = useState<number>(venues[0]?.id || 1);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lunes', 'Miércoles', 'Viernes']);
  const [scheduleTime, setScheduleTime] = useState<string>('16:30 - 18:00');
  const [selectedCoachIds, setSelectedCoachIds] = useState<number[]>([]);

  // Add Venue Modal Form
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueType, setVenueType] = useState<'Sintética' | 'Pasto Natural' | 'Pabellón Cubierto'>('Sintética');

  // Schedule Session Modal Form
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [sessionStartTime, setSessionStartTime] = useState('16:30');
  const [sessionEndTime, setSessionEndTime] = useState('18:00');
  const [sessionObjective, setSessionObjective] = useState('Técnica individual y pase progresivo');

  // ----------------------------------------------------------------------
  // COACH STATE: ATTENDANCE TRACKER
  // ----------------------------------------------------------------------
  const [selectedSessionId, setSelectedSessionId] = useState<number>(sessions[0]?.id || 1);
  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];
  const sessionCategory = categories.find((c) => c.id === currentSession?.categoriaId);

  const categoryPlayers = players.filter(
    (p) => p.categoriaActualId === currentSession?.categoriaId && p.estatus === 'ACTIVO'
  );

  const existingRecords = attendance.filter((a) => a.sesionId === selectedSessionId);

  const [studentStatusMap, setStudentStatusMap] = useState<Record<number, AttendanceStatus>>(() => {
    const map: Record<number, AttendanceStatus> = {};
    categoryPlayers.forEach((p) => {
      const rec = existingRecords.find((r) => r.jugadorId === p.id);
      map[p.id] = rec ? rec.estado : 'PRESENTE';
    });
    return map;
  });

  const [objetivo, setObjetivo] = useState(currentSession?.objetivo || '');
  const [observaciones, setObservaciones] = useState(currentSession?.observaciones || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Day list for selection
  const ALL_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // ----------------------------------------------------------------------
  // ADMIN HANDLERS
  // ----------------------------------------------------------------------
  const handleOpenAssignForCategory = (cat: Category) => {
    setSelectedCatId(cat.id);
    setSelectedVenueId(cat.sedeId || venues[0]?.id || 1);
    setSelectedDays(cat.diasEntrenamiento || ['Lunes', 'Miércoles']);
    setScheduleTime(cat.horario || '16:30 - 18:00');
    setSelectedCoachIds(cat.entrenadorIds || []);
    setShowAssignModal(true);
  };

  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleToggleCoach = (coachId: number) => {
    setSelectedCoachIds((prev) =>
      prev.includes(coachId) ? prev.filter((id) => id !== coachId) : [...prev, coachId]
    );
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateCategoryTraining) return;

    const targetVenue = venues.find((v) => v.id === selectedVenueId);
    const assignedCoaches = coaches.filter((c) => selectedCoachIds.includes(c.id));

    onUpdateCategoryTraining(selectedCatId, {
      sedeId: selectedVenueId,
      sedeNombre: targetVenue?.nombre || 'Cancha Asignada',
      diasEntrenamiento: selectedDays,
      horario: scheduleTime.trim(),
      entrenadorIds: selectedCoachIds,
      entrenadoresNombres: assignedCoaches.map((c) => `${c.nombre} ${c.apellidoPaterno}`),
    });

    setAdminSuccessMsg('¡Asignación de cancha, horario y entrenador actualizada con éxito!');
    setTimeout(() => setAdminSuccessMsg(null), 4000);
    setShowAssignModal(false);
  };

  const handleCreateVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueName.trim() || !onAddVenue) return;

    onAddVenue({
      nombre: venueName.trim(),
      direccion: venueAddress.trim() || 'Instalaciones Club Charales, Chapala',
      tipoCancha: venueType,
    });

    setVenueName('');
    setVenueAddress('');
    setAdminSuccessMsg('¡Nueva cancha agregada exitosamente!');
    setTimeout(() => setAdminSuccessMsg(null), 4000);
    setShowAddVenueModal(false);
  };

  const handleScheduleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddTrainingSession) return;

    const targetCat = categories.find((c) => c.id === selectedCatId);
    const targetVenue = venues.find((v) => v.id === selectedVenueId);
    const targetCoach = coaches.find((c) => selectedCoachIds[0] === c.id) || coaches[0];

    onAddTrainingSession({
      categoriaId: selectedCatId,
      categoriaNombre: targetCat?.nombre || 'Categoría',
      sedeId: selectedVenueId,
      sedeNombre: targetVenue?.nombre || 'Cancha Oficial',
      fecha: sessionDate,
      horaInicio: sessionStartTime,
      horaFin: sessionEndTime,
      entrenadorNombre: targetCoach ? `${targetCoach.nombre} ${targetCoach.apellidoPaterno}` : 'Director Técnico',
      objetivo: sessionObjective.trim(),
    });

    setAdminSuccessMsg('¡Sesión de entrenamiento programada correctamente en el calendario oficial!');
    setTimeout(() => setAdminSuccessMsg(null), 4000);
    setShowScheduleSessionModal(false);
  };

  // ----------------------------------------------------------------------
  // COACH HANDLERS
  // ----------------------------------------------------------------------
  const handleSessionChange = (sId: number) => {
    setSelectedSessionId(sId);
    const targetSession = sessions.find((s) => s.id === sId);
    const targetPlayers = players.filter(
      (p) => p.categoriaActualId === targetSession?.categoriaId && p.estatus === 'ACTIVO'
    );
    const recs = attendance.filter((a) => a.sesionId === sId);

    const map: Record<number, AttendanceStatus> = {};
    targetPlayers.forEach((p) => {
      const rec = recs.find((r) => r.jugadorId === p.id);
      map[p.id] = rec ? rec.estado : 'PRESENTE';
    });
    setStudentStatusMap(map);
    setObjetivo(targetSession?.objetivo || '');
    setObservaciones(targetSession?.observaciones || '');
    setSavedSuccess(false);
  };

  const handleSetStatus = (playerId: number, status: AttendanceStatus) => {
    setStudentStatusMap((prev) => ({
      ...prev,
      [playerId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<number, AttendanceStatus> = {};
    categoryPlayers.forEach((p) => {
      updated[p.id] = 'PRESENTE';
    });
    setStudentStatusMap(updated);
  };

  const handleSaveAttendance = () => {
    const payload = categoryPlayers.map((p) => ({
      jugadorId: p.id,
      jugadorNombre: `${p.nombre} ${p.apellidoPaterno}`,
      estado: studentStatusMap[p.id] || 'PRESENTE',
    }));

    onRegisterAttendance(selectedSessionId, payload, {
      objetivo,
      observaciones,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // ======================================================================
  // 1. VISTA DE ADMINISTRADOR: CANCHAS, HORARIOS Y ASIGNACIÓN DE ENTRENADOR
  // ======================================================================
  if (!isCoach) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Entrenamientos, Canchas y Horarios
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3B59A8]/10 text-[#3B59A8]">
                Administración
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Programación oficial de canchas, franjas horarias y asignación del cuerpo técnico por categoría
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setSelectedCatId(categories[0]?.id || 1);
                setShowAssignModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Asignar Cancha y Horario</span>
            </button>

            <button
              onClick={() => setShowAddVenueModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Building className="w-4 h-4 text-[#3B59A8]" />
              <span>+ Nueva Cancha</span>
            </button>

            <button
              onClick={() => setShowScheduleSessionModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>+ Programar Sesión</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {adminSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{adminSuccessMsg}</span>
          </div>
        )}

        {/* Stats KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Canchas Habilitadas</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3B59A8] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{venues.length}</p>
            <span className="text-[11px] text-emerald-600 font-bold">100% Operativas</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Categorías Programadas</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{categories.length}</p>
            <span className="text-[11px] text-slate-500">Sub-6 a Sub-14</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Entrenadores Asignados</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{coaches.length}</p>
            <span className="text-[11px] text-slate-500">Cuerpo Técnico Activo</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Sesiones en Calendario</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{sessions.length}</p>
            <span className="text-[11px] text-slate-500">Ciclo Apertura 2026</span>
          </div>
        </div>

        {/* SECCIÓN 1: CANCHAS Y CAMPOS DEL CLUB */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#3B59A8]" />
              <span>Instalaciones y Canchas Oficiales</span>
            </h2>
            <button
              onClick={() => setShowAddVenueModal(true)}
              className="text-xs text-[#3B59A8] hover:underline font-bold"
            >
              + Agregar otra cancha
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {venues.map((venue) => {
              const categoriesInVenue = categories.filter((c) => c.sedeId === venue.id);

              return (
                <div
                  key={venue.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">{venue.nombre}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#3B59A8] shrink-0 border border-blue-100">
                        {venue.tipoCancha}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{venue.direccion}</span>
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10.5px] font-bold text-slate-400 uppercase block">
                        Categorías que entrenan aquí:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {categoriesInVenue.length > 0 ? (
                          categoriesInVenue.map((cat) => (
                            <span
                              key={cat.id}
                              className="px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-slate-100 text-slate-700"
                            >
                              ⚽ {cat.nombre}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Sin categorías asignadas actualmente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 2: MATRIZ DE ASIGNACIÓN (CATEGORÍA ↔ CANCHA ↔ HORARIO ↔ ENTRENADOR) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-[#3B59A8]" />
              <span>Asignación de Canchas, Horarios y Entrenadores por Categoría</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.map((cat) => {
              const coachList = coaches.filter((c) =>
                cat.entrenadorIds?.includes(c.id)
              );

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4 hover:border-[#3B59A8]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Categoría */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">{cat.nombre}</h3>
                        <span className="text-xs text-slate-500 font-medium">
                          Edades: {cat.edadMinima} a {cat.edadMaxima} años · Cupo: {cat.cupoMaximo} alumnos
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenAssignForCategory(cat)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-[#3B59A8] hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                        title="Modificar asignación de cancha, horario y entrenador"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                    </div>

                    {/* Cancha y Días */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-[#3B59A8] shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">Cancha / Sede:</span>
                          <span className="text-slate-600">{cat.sedeNombre || 'Sin cancha asignada'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">Horario y Días:</span>
                          <span className="text-slate-600 font-semibold">
                            {cat.diasEntrenamiento?.join(', ') || 'Días por definir'} · {cat.horario}
                          </span>
                        </div>
                      </div>

                      {/* Entrenador Asignado */}
                      <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-1.5">
                        <span className="text-[10.5px] uppercase font-bold text-slate-500 block">
                          Profesor / Cuerpo Técnico Asignado:
                        </span>
                        {coachList.length > 0 ? (
                          coachList.map((coach) => (
                            <div key={coach.id} className="flex items-center gap-2.5">
                              {coach.fotoUrl ? (
                                <img
                                  src={coach.fotoUrl}
                                  alt={coach.nombre}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-900 shadow-2xs shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#3B59A8] text-white font-bold text-xs flex items-center justify-center shrink-0">
                                  {coach.nombre[0]}
                                </div>
                              )}
                              <div>
                                <p className="font-extrabold text-slate-900 text-xs">
                                  Prof. {coach.nombre} {coach.apellidoPaterno}
                                </p>
                                <span className="text-[10px] text-slate-500">
                                  {coach.licencia || 'Licencia Formativa FMF'} · Tel: {coach.telefono}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-amber-700 italic">
                            ⚠️ Sin entrenador asignado actualmente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Estado: Activa y en calendario</span>
                    <button
                      onClick={() => handleOpenAssignForCategory(cat)}
                      className="text-[#3B59A8] hover:underline font-bold"
                    >
                      Reasignar →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 3: PRÓXIMAS SESIONES PROGRAMADAS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3B59A8]" />
              <span>Sesiones de Entrenamiento en Cancha</span>
            </h2>
            <button
              onClick={() => setShowScheduleSessionModal(true)}
              className="text-xs text-[#3B59A8] hover:underline font-bold"
            >
              + Nueva Sesión
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3B59A8] font-black flex items-center justify-center shrink-0">
                    ⚽
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{s.categoriaNombre}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {s.sedeNombre}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px]">
                      {s.fecha} ({s.horaInicio} - {s.horaFin}) · Dirige: Prof. {s.entrenadorNombre}
                    </span>
                    {s.objetivo && (
                      <p className="text-slate-600 text-[11px] mt-0.5 italic">
                        Objetivo: {s.objetivo}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase self-start sm:self-center ${
                    s.estado === 'REALIZADA'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.estado === 'PROGRAMADA'
                      ? 'bg-blue-100 text-[#3B59A8]'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {s.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL 1: ASIGNAR CANCHA, HORARIO Y ENTRENADOR */}
        {showAssignModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scaleUp my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3B59A8] flex items-center justify-center">
                    <CalendarCheck2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Asignar Cancha, Horario y Entrenador
                  </h3>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs">
                {/* Categoría */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    1. Categoría a Programar *
                  </label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} (Edades: {c.edadMinima} a {c.edadMaxima} años)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cancha */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase">
                      2. Cancha / Campo de Entrenamiento *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddVenueModal(true)}
                      className="text-[10px] text-[#3B59A8] hover:underline font-bold"
                    >
                      + Nueva Cancha
                    </button>
                  </div>
                  <select
                    value={selectedVenueId}
                    onChange={(e) => setSelectedVenueId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nombre} ({v.tipoCancha})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Días de Entrenamiento */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                    3. Días de Entrenamiento Semanales *
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_DAYS.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => handleToggleDay(day)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-[#3B59A8] text-white border-[#3B59A8] shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Horario */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    4. Franja Horaria (Hora Inicio - Hora Fin) *
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    placeholder="Ej. 16:30 - 18:00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>

                {/* Asignar Entrenador */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                    5. Entrenador(es) Asignado(s) a la Cancha y Horario *
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {coaches.map((c) => {
                      const isSelected = selectedCoachIds.includes(c.id);
                      return (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => handleToggleCoach(c.id)}
                          className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all border ${
                            isSelected
                              ? 'bg-blue-50 border-[#3B59A8] text-[#3B59A8]'
                              : 'bg-white hover:bg-slate-100/70 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {c.fotoUrl ? (
                              <img
                                src={c.fotoUrl}
                                alt={c.nombre}
                                className="w-7 h-7 rounded-full object-cover border border-slate-900"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[#3B59A8] text-white font-bold text-xs flex items-center justify-center">
                                {c.nombre[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-xs text-slate-900">
                                Prof. {c.nombre} {c.apellidoPaterno}
                              </p>
                              <span className="text-[10px] text-slate-500">
                                {c.licencia || 'Licencia Formativa'}
                              </span>
                            </div>
                          </div>

                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#3B59A8] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-[#3B59A8] hover:bg-[#162963] text-white shadow-md"
                  >
                    Guardar Asignación
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: REGISTRAR NUEVA CANCHA */}
        {showAddVenueModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3B59A8] flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Registrar Nueva Cancha / Campo
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddVenueModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateVenue} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nombre de la Cancha *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="Ej. Cancha 2 Sintética (Usuario Rayo)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Dirección o Zona *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="Ej. Unidad Deportiva Municipal, Chapala"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tipo de Superficie *
                  </label>
                  <select
                    value={venueType}
                    onChange={(e) =>
                      setVenueType(e.target.value as 'Sintética' | 'Pasto Natural' | 'Pabellón Cubierto')
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  >
                    <option value="Sintética">Pasto Sintético</option>
                    <option value="Pasto Natural">Pasto Natural</option>
                    <option value="Pabellón Cubierto">Pabellón Techado / Duela</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowAddVenueModal(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-[#3B59A8] hover:bg-[#162963] text-white shadow-md"
                  >
                    Agregar Cancha
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: PROGRAMAR SESIÓN ESPECÍFICA */}
        {showScheduleSessionModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Programar Sesión de Entrenamiento en Cancha
                  </h3>
                </div>
                <button
                  onClick={() => setShowScheduleSessionModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleScheduleSessionSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Categoría *
                    </label>
                    <select
                      value={selectedCatId}
                      onChange={(e) => setSelectedCatId(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Cancha *
                    </label>
                    <select
                      value={selectedVenueId}
                      onChange={(e) => setSelectedVenueId(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                    >
                      {venues.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      required
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Hora Inicio *
                    </label>
                    <input
                      type="time"
                      required
                      value={sessionStartTime}
                      onChange={(e) => setSessionStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Hora Fin *
                    </label>
                    <input
                      type="time"
                      required
                      value={sessionEndTime}
                      onChange={(e) => setSessionEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Objetivo Técnico de la Práctica
                  </label>
                  <input
                    type="text"
                    value={sessionObjective}
                    onChange={(e) => setSessionObjective(e.target.value)}
                    placeholder="Ej. Rondos de posesión y salida jugada desde la defensa"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowScheduleSessionModal(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  >
                    Programar Sesión
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ======================================================================
  // 2. VISTA EXCLUSIVA DE ENTRENADOR: PASE DE ASISTENCIA Y BITÁCORA TÉCNICA
  // ======================================================================
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Control de Asistencia en Cancha
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Profesor / Entrenador
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pase de lista interactivo en 1 toque y bitácora técnica de entrenamiento para alumnos
          </p>
        </div>

        {/* 1-Click Fast Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Todos Presentes (1 Toque)</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 text-xs font-bold bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Asistencia</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Asistencia y observaciones guardadas correctamente con registro de trazabilidad!</span>
        </div>
      )}

      {/* Session Selection & Details */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Seleccionar Sesión de Entrenamiento:
            </label>
            <select
              value={selectedSessionId}
              onChange={(e) => handleSessionChange(Number(e.target.value))}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] font-semibold text-slate-800"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fecha} ({s.horaInicio}-{s.horaFin}) · {s.categoriaNombre} [{s.estado}]
                </option>
              ))}
            </select>
          </div>

          {currentSession && (
            <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 sm:pt-0">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">{currentSession.sedeNombre}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Prof. {currentSession.entrenadorNombre}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Students Attendance List (Touch Buttons Grid) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Lista de Jugadores ({categoryPlayers.length} alumnos en {sessionCategory?.nombre})
          </span>
          <span className="text-xs text-slate-500">
            Presentes:{' '}
            <strong className="text-emerald-700 font-mono">
              {Object.values(studentStatusMap).filter((s) => s === 'PRESENTE').length}
            </strong>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {categoryPlayers.map((player) => {
            const currentStatus = studentStatusMap[player.id] || 'PRESENTE';

            return (
              <div
                key={player.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {player.fotoUrl ? (
                    <img
                      src={player.fotoUrl}
                      alt={player.nombre}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-900 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                      {player.numeroCamiseta ? `#${player.numeroCamiseta}` : player.nombre[0]}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      {player.nombre} {player.apellidoPaterno} {player.apellidoMaterno || ''}
                    </span>
                    <span className="text-xs text-slate-400">
                      {player.identificador} · {player.posicionHabitual}
                    </span>
                  </div>
                </div>

                {/* Big Touch-Friendly Buttons for Phone/Tablet */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleSetStatus(player.id, 'PRESENTE')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      currentStatus === 'PRESENTE'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Presente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetStatus(player.id, 'JUSTIFICADO')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      currentStatus === 'JUSTIFICADO'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Justificado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetStatus(player.id, 'AUSENTE')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      currentStatus === 'AUSENTE'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Falta</span>
                  </button>
                </div>
              </div>
            );
          })}

          {categoryPlayers.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No hay alumnos registrados con estatus activo en esta categoría.
            </div>
          )}
        </div>
      </div>

      {/* Session Notes */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Bitácora Técnica de Entrenamiento</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Objetivo Técnico de la Sesión:
            </label>
            <input
              type="text"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              placeholder="Ej. Transición defensiva y repliegue rápido..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Observaciones & Desempeño General:
            </label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej. Excelente intensidad en rondos, trabajar más en la definición..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveAttendance}
            className="px-5 py-2 text-xs font-bold bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Sesión Completa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;
