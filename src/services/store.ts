import { useState, useEffect } from 'react';
import {
  Role,
  User,
  Player,
  Guardian,
  GuardianPlayerRelation,
  Coach,
  Category,
  CategoryHistory,
  Venue,
  Season,
  TrainingSession,
  AttendanceRecord,
  Tournament,
  Match,
  ChargeConcept,
  Charge,
  Payment,
  UniformProduct,
  UniformOrder,
  SportsMaterial,
  PerformanceEvaluation,
  Notice,
  DirectMessage,
  AppNotification,
  AuditLog,
  AttendanceStatus,
  PlayerStatus,
  PaymentMethod,
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_SEASONS,
  INITIAL_VENUES,
  INITIAL_COACHES,
  INITIAL_CATEGORIES,
  INITIAL_PLAYERS,
  INITIAL_GUARDIANS,
  INITIAL_GUARDIAN_PLAYER_RELATIONS,
  INITIAL_CATEGORY_HISTORY,
  INITIAL_TOURNAMENTS,
  INITIAL_MATCHES,
  INITIAL_TRAINING_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_CHARGE_CONCEPTS,
  INITIAL_CHARGES,
  INITIAL_PAYMENTS,
  INITIAL_UNIFORM_PRODUCTS,
  INITIAL_UNIFORM_ORDERS,
  INITIAL_SPORTS_MATERIALS,
  INITIAL_PERFORMANCE_EVALUATIONS,
  INITIAL_NOTICES,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

const STORAGE_PREFIX = 'charales_chapala_v1_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export function useAcademyStore(currentUser: User) {
  // La identidad es la cuenta validada por el backend, nunca el usuario demo persistido.
  const [users, setUsers] = useState<User[]>(() => getStored('users', INITIAL_USERS));
  const [seasons, setSeasons] = useState<Season[]>(() => getStored('seasons', INITIAL_SEASONS));
  const [venues, setVenues] = useState<Venue[]>(() => getStored('venues', INITIAL_VENUES));
  const [categories, setCategories] = useState<Category[]>(() => getStored('categories', INITIAL_CATEGORIES));
  const [coaches, setCoaches] = useState<Coach[]>(() => {
    const stored = getStored<Coach[]>('coaches', INITIAL_COACHES);
    return stored.map((c) => {
      if (!c.fotoUrl) {
        const init = INITIAL_COACHES.find((ic) => ic.id === c.id);
        if (init?.fotoUrl) return { ...c, fotoUrl: init.fotoUrl };
      }
      return c;
    });
  });
  const [players, setPlayers] = useState<Player[]>(() => {
    const stored = getStored<Player[]>('players', INITIAL_PLAYERS);
    return stored.map((p) => {
      if (!p.fotoUrl) {
        const init = INITIAL_PLAYERS.find((ip) => ip.id === p.id);
        if (init?.fotoUrl) return { ...p, fotoUrl: init.fotoUrl };
      }
      return p;
    });
  });
  const [guardians, setGuardians] = useState<Guardian[]>(() => getStored('guardians', INITIAL_GUARDIANS));
  const [relations, setRelations] = useState<GuardianPlayerRelation[]>(() =>
    getStored('relations', INITIAL_GUARDIAN_PLAYER_RELATIONS)
  );
  const [categoryHistory, setCategoryHistory] = useState<CategoryHistory[]>(() =>
    getStored('category_history', INITIAL_CATEGORY_HISTORY)
  );
  const [tournaments, setTournaments] = useState<Tournament[]>(() => getStored('tournaments', INITIAL_TOURNAMENTS));
  const [matches, setMatches] = useState<Match[]>(() => getStored('matches', INITIAL_MATCHES));
  const [sessions, setSessions] = useState<TrainingSession[]>(() =>
    getStored('sessions', INITIAL_TRAINING_SESSIONS)
  );
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() =>
    getStored('attendance', INITIAL_ATTENDANCE_RECORDS)
  );
  const [chargeConcepts, setChargeConcepts] = useState<ChargeConcept[]>(() =>
    getStored('charge_concepts', INITIAL_CHARGE_CONCEPTS)
  );
  const [charges, setCharges] = useState<Charge[]>(() => getStored('charges', INITIAL_CHARGES));
  const [payments, setPayments] = useState<Payment[]>(() => getStored('payments', INITIAL_PAYMENTS));
  const [uniformProducts, setUniformProducts] = useState<UniformProduct[]>(() =>
    getStored('uniform_products', INITIAL_UNIFORM_PRODUCTS)
  );
  const [uniformOrders, setUniformOrders] = useState<UniformOrder[]>(() =>
    getStored('uniform_orders', INITIAL_UNIFORM_ORDERS)
  );
  const [materials, setMaterials] = useState<SportsMaterial[]>(() =>
    getStored('materials', INITIAL_SPORTS_MATERIALS)
  );
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>(() =>
    getStored('evaluations', INITIAL_PERFORMANCE_EVALUATIONS)
  );
  const [notices, setNotices] = useState<Notice[]>(() => getStored('notices', INITIAL_NOTICES));
  const [messages, setMessages] = useState<DirectMessage[]>(() =>
    getStored('messages', INITIAL_DIRECT_MESSAGES)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getStored('notifications', INITIAL_NOTIFICATIONS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored('audit_logs', INITIAL_AUDIT_LOGS));

  // Sync state to local storage
  useEffect(() => setStored('users', users), [users]);
  useEffect(() => setStored('seasons', seasons), [seasons]);
  useEffect(() => setStored('venues', venues), [venues]);
  useEffect(() => setStored('coaches', coaches), [coaches]);
  useEffect(() => setStored('categories', categories), [categories]);
  useEffect(() => setStored('players', players), [players]);
  useEffect(() => setStored('guardians', guardians), [guardians]);
  useEffect(() => setStored('relations', relations), [relations]);
  useEffect(() => setStored('category_history', categoryHistory), [categoryHistory]);
  useEffect(() => setStored('tournaments', tournaments), [tournaments]);
  useEffect(() => setStored('matches', matches), [matches]);
  useEffect(() => setStored('sessions', sessions), [sessions]);
  useEffect(() => setStored('attendance', attendance), [attendance]);
  useEffect(() => setStored('charge_concepts', chargeConcepts), [chargeConcepts]);
  useEffect(() => setStored('charges', charges), [charges]);
  useEffect(() => setStored('payments', payments), [payments]);
  useEffect(() => setStored('uniform_products', uniformProducts), [uniformProducts]);
  useEffect(() => setStored('uniform_orders', uniformOrders), [uniformOrders]);
  useEffect(() => setStored('materials', materials), [materials]);
  useEffect(() => setStored('evaluations', evaluations), [evaluations]);
  useEffect(() => setStored('notices', notices), [notices]);
  useEffect(() => setStored('messages', messages), [messages]);
  useEffect(() => setStored('notifications', notifications), [notifications]);
  useEffect(() => setStored('audit_logs', auditLogs), [auditLogs]);

  // Log audit helper
  const addAuditLog = (accion: string, entidad: string, detalles: string) => {
    const newLog: AuditLog = {
      id: Date.now(),
      usuarioNombre: currentUser.nombre,
      usuarioRol: currentUser.rol,
      accion,
      entidad,
      detalles,
      fechaHora: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Push notification trigger
  const triggerNotification = (notif: Omit<AppNotification, 'id' | 'fechaHora' | 'leida'>) => {
    const fullNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      fechaHora: new Date().toISOString().replace('T', ' ').slice(0, 16),
      leida: false,
    };
    setNotifications((prev) => [fullNotif, ...prev]);

    // Check if browser native push is permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.titulo, {
          body: notif.mensaje,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Native notification failed', e);
      }
    }
  };

  // --- PLAYERS ACTIONS ---
  const addPlayer = (
    playerData: Omit<Player, 'id' | 'identificador' | 'fechaIngreso'>,
    guardianData?: {
      nombre: string;
      apellidoPaterno: string;
      telefono: string;
      email: string;
      parentesco: string;
    }
  ) => {
    const newId = Math.max(0, ...players.map((p) => p.id)) + 1;
    const cat = categories.find((c) => c.id === playerData.categoriaActualId);
    const newPlayer: Player = {
      ...playerData,
      id: newId,
      identificador: `J-2026-${String(newId).padStart(3, '0')}`,
      categoriaActualNombre: cat ? cat.nombre : 'Sin Categoría',
      fechaIngreso: new Date().toISOString().slice(0, 10),
    };

    setPlayers((prev) => [...prev, newPlayer]);

    // If guardian information is supplied in the same registration form
    if (guardianData && guardianData.nombre) {
      const gId = Math.max(0, ...guardians.map((g) => g.id)) + 1;
      const newGuardian: Guardian = {
        id: gId,
        nombre: guardianData.nombre,
        apellidoPaterno: guardianData.apellidoPaterno,
        telefono: guardianData.telefono,
        email: guardianData.email,
      };
      setGuardians((prev) => [...prev, newGuardian]);
      setRelations((prev) => [
        ...prev,
        {
          tutorId: gId,
          jugadorId: newId,
          parentesco: guardianData.parentesco || 'Tutor',
          esContactoPrincipal: true,
        },
      ]);
    }

    addAuditLog(
      'ALTA_JUGADOR',
      'Jugadores',
      `Nuevo alumno registrado: ${newPlayer.nombre} ${newPlayer.apellidoPaterno} (${newPlayer.identificador}) en ${newPlayer.categoriaActualNombre}`
    );

    triggerNotification({
      titulo: '⚽ Nuevo Alumno Inscrito',
      mensaje: `${newPlayer.nombre} ${newPlayer.apellidoPaterno} ha sido incorporado a ${newPlayer.categoriaActualNombre}.`,
      tipo: 'AVISO',
      rolesDestino: ['ADMINISTRADOR', 'SECRETARIA', 'ENTRENADOR'],
      jugadorId: newId,
    });

    return newPlayer;
  };

  const updatePlayer = (id: number, data: Partial<Player>) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const cat = data.categoriaActualId
            ? categories.find((c) => c.id === data.categoriaActualId)
            : undefined;
          return {
            ...p,
            ...data,
            categoriaActualNombre: cat ? cat.nombre : p.categoriaActualNombre,
          };
        }
        return p;
      })
    );
    addAuditLog('EDICION_JUGADOR', 'Jugadores', `Actualización de expediente del jugador ID #${id}`);
  };

  const changePlayerStatus = (id: number, newStatus: PlayerStatus, motivo: string) => {
    const player = players.find((p) => p.id === id);
    if (!player) return;

    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estatus: newStatus } : p))
    );

    addAuditLog(
      'CAMBIO_ESTATUS_JUGADOR',
      'Jugadores',
      `Estado de ${player.nombre} ${player.apellidoPaterno} cambiado de ${player.estatus} a ${newStatus}. Motivo: ${motivo}`
    );

    triggerNotification({
      titulo: `Actualización de Estatus: ${player.nombre}`,
      mensaje: `El estatus del alumno ha cambiado a ${newStatus}. Motivo: ${motivo}`,
      tipo: 'AVISO',
      rolesDestino: ['ADMINISTRADOR', 'SECRETARIA', 'ENTRENADOR'],
      jugadorId: id,
    });
  };

  const changePlayerCategory = (id: number, newCatId: number, motivo: string) => {
    const player = players.find((p) => p.id === id);
    const newCat = categories.find((c) => c.id === newCatId);
    if (!player || !newCat) return;

    const oldCatName = player.categoriaActualNombre || 'Sin Categoría';
    const newHistory: CategoryHistory = {
      id: Date.now(),
      jugadorId: id,
      categoriaAnteriorNombre: oldCatName,
      categoriaNuevaNombre: newCat.nombre,
      fechaCambio: new Date().toISOString().slice(0, 10),
      motivo,
    };

    setCategoryHistory((prev) => [newHistory, ...prev]);
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              categoriaActualId: newCatId,
              categoriaActualNombre: newCat.nombre,
            }
          : p
      )
    );

    addAuditLog(
      'CAMBIO_CATEGORIA',
      'Categorías',
      `Cambio de grupo para ${player.nombre}: de ${oldCatName} a ${newCat.nombre}. Motivo: ${motivo}`
    );

    triggerNotification({
      titulo: `Promoción de Categoría: ${player.nombre}`,
      mensaje: `${player.nombre} ahora forma parte de la categoría ${newCat.nombre}.`,
      tipo: 'AVISO',
      rolesDestino: ['PADRE_TUTOR', 'ENTRENADOR', 'SECRETARIA'],
      jugadorId: id,
    });
  };

  // --- COACHES ACTIONS ---
  const addCoach = (coachData: Omit<Coach, 'id'>) => {
    const newId = Math.max(0, ...coaches.map((c) => c.id)) + 1;
    const newCoach: Coach = {
      ...coachData,
      id: newId,
    };
    setCoaches((prev) => [...prev, newCoach]);
    addAuditLog(
      'ALTA_ENTRENADOR',
      'Entrenadores',
      `Nuevo profesor registrado: Prof. ${newCoach.nombre} ${newCoach.apellidoPaterno} (${newCoach.licencia || 'Licencia Formativa'})`
    );
    triggerNotification({
      titulo: '📋 Nuevo Entrenador Incorporado',
      mensaje: `El Prof. ${newCoach.nombre} ${newCoach.apellidoPaterno} se ha unido al cuerpo técnico de Charales.`,
      tipo: 'AVISO',
      rolesDestino: ['ADMINISTRADOR', 'SECRETARIA', 'ENTRENADOR'],
    });
    return newCoach;
  };

  const updateCoach = (id: number, data: Partial<Coach>) => {
    setCoaches((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    addAuditLog('EDICION_ENTRENADOR', 'Entrenadores', `Actualización de expediente del entrenador ID #${id}`);
  };

  // --- ATTENDANCE & SESSIONS ---
  const registerSessionAttendance = (
    sesionId: number,
    records: { jugadorId: number; jugadorNombre: string; estado: AttendanceStatus; observacion?: string }[],
    sessionNotes?: { objetivo?: string; observaciones?: string }
  ) => {
    // Replace records for this session
    setAttendance((prev) => {
      const filtered = prev.filter((r) => r.sesionId !== sesionId);
      const newItems: AttendanceRecord[] = records.map((r, index) => ({
        id: Date.now() + index,
        sesionId,
        jugadorId: r.jugadorId,
        jugadorNombre: r.jugadorNombre,
        estado: r.estado,
        observacion: r.observacion,
      }));
      return [...filtered, ...newItems];
    });

    // Mark session as REALIZADA
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sesionId
          ? {
              ...s,
              estado: 'REALIZADA',
              objetivo: sessionNotes?.objetivo ?? s.objetivo,
              observaciones: sessionNotes?.observaciones ?? s.observaciones,
            }
          : s
      )
    );

    addAuditLog(
      'REGISTRO_ASISTENCIA',
      'Asistencias',
      `Toma de asistencia registrada para sesión #${sesionId} (${records.length} alumnos).`
    );
  };

  const addVenue = (venueData: Omit<Venue, 'id'>) => {
    const newId = Math.max(0, ...venues.map((v) => v.id)) + 1;
    const newVenue: Venue = {
      ...venueData,
      id: newId,
    };
    setVenues((prev) => [...prev, newVenue]);
    addAuditLog(
      'ALTA_CANCHA',
      'Instalaciones',
      `Nueva cancha/sede registrada: ${newVenue.nombre} (${newVenue.tipoCancha})`
    );
    return newVenue;
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newId = Math.max(0, ...categories.map((c) => c.id)) + 1;
    const newCategory: Category = {
      ...categoryData,
      id: newId,
    };
    setCategories((prev) => [...prev, newCategory]);

    if (newCategory.entrenadorIds && newCategory.entrenadorIds.length > 0) {
      setCoaches((prev) =>
        prev.map((coach) => {
          if (newCategory.entrenadorIds.includes(coach.id)) {
            const currentCats = coach.categoriasAsignadas || [];
            if (!currentCats.includes(newId)) {
              return { ...coach, categoriasAsignadas: [...currentCats, newId] };
            }
          }
          return coach;
        })
      );
    }

    addAuditLog(
      'ALTA_CATEGORIA',
      'Categorías',
      `Nueva categoría creada: ${newCategory.nombre} (Edades: ${newCategory.edadMinima}-${newCategory.edadMaxima} años, cupo: ${newCategory.cupoMaximo})`
    );

    triggerNotification({
      titulo: `⚽ Nueva Categoría: ${newCategory.nombre}`,
      mensaje: `Se ha dado de alta la categoría ${newCategory.nombre} en la academia oficial.`,
      tipo: 'AVISO',
      rolesDestino: ['ADMINISTRADOR', 'SECRETARIA', 'ENTRENADOR'],
    });

    return newCategory;
  };

  const updateCategoryTraining = (
    categoryId: number,
    data: {
      sedeId: number;
      sedeNombre: string;
      diasEntrenamiento: string[];
      horario: string;
      entrenadorIds: number[];
      entrenadoresNombres: string[];
    }
  ) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...data } : c))
    );

    // Update coach assigned categories
    setCoaches((prev) =>
      prev.map((coach) => {
        const isAssigned = data.entrenadorIds.includes(coach.id);
        const currentCats = coach.categoriasAsignadas || [];
        if (isAssigned && !currentCats.includes(categoryId)) {
          return { ...coach, categoriasAsignadas: [...currentCats, categoryId] };
        }
        return coach;
      })
    );

    addAuditLog(
      'ASIGNACION_CANCHA_HORARIO',
      'Entrenamientos',
      `Asignada categoría ID #${categoryId} a la cancha ${data.sedeNombre}, horario ${data.horario} y profesor ${data.entrenadoresNombres.join(', ')}`
    );

    triggerNotification({
      titulo: '⚽ Asignación de Cancha y Horario',
      mensaje: `Se actualizó la cancha (${data.sedeNombre}) y horario (${data.horario}) de entrenamientos.`,
      tipo: 'ASISTENCIA',
      rolesDestino: ['ADMINISTRADOR', 'SECRETARIA', 'ENTRENADOR', 'PADRE_TUTOR'],
    });
  };

  const addTrainingSession = (sessionData: Omit<TrainingSession, 'id' | 'estado'>) => {
    const newId = Math.max(0, ...sessions.map((s) => s.id)) + 1;
    const newSession: TrainingSession = {
      ...sessionData,
      id: newId,
      estado: 'PROGRAMADA',
    };
    setSessions((prev) => [newSession, ...prev]);
    addAuditLog(
      'ALTA_SESION_ENTRENAMIENTO',
      'Entrenamientos',
      `Nueva sesión programada para ${newSession.categoriaNombre} en ${newSession.sedeNombre} (${newSession.fecha} ${newSession.horaInicio}-${newSession.horaFin})`
    );
    return newSession;
  };

  // --- MATCHES & TOURNAMENTS ---
  const scheduleMatch = (matchData: Omit<Match, 'id' | 'estado'>) => {
    const newId = Math.max(0, ...matches.map((m) => m.id)) + 1;
    const newMatch: Match = {
      ...matchData,
      id: newId,
      estado: 'PROGRAMADO',
    };
    setMatches((prev) => [newMatch, ...prev]);

    addAuditLog(
      'PROGRAMACION_PARTIDO',
      'Partidos',
      `Partido programado: ${newMatch.categoriaNombre} vs ${newMatch.equipoRival} (${newMatch.fecha} ${newMatch.hora}).`
    );

    triggerNotification({
      titulo: `⚽ Nuevo Partido: ${newMatch.categoriaNombre}`,
      mensaje: `Vs ${newMatch.equipoRival} el ${newMatch.fecha} a las ${newMatch.hora} en ${newMatch.sede}.`,
      tipo: 'PARTIDO',
      rolesDestino: ['PADRE_TUTOR', 'ENTRENADOR', 'SECRETARIA', 'ADMINISTRADOR'],
      enlaceTab: 'partidos',
    });
  };

  const updateMatchResult = (
    id: number,
    result: {
      golesFavor: number;
      golesContra: number;
      goleadores?: string;
      observaciones?: string;
    }
  ) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              estado: 'JUGADO',
              golesFavor: result.golesFavor,
              golesContra: result.golesContra,
              goleadores: result.goleadores,
              observaciones: result.observaciones,
            }
          : m
      )
    );

    const match = matches.find((m) => m.id === id);
    addAuditLog(
      'RESULTADO_PARTIDO',
      'Partidos',
      `Marcador actualizado para partido #${id}: Charales de Chapala ${result.golesFavor} - ${result.golesContra} ${match?.equipoRival || 'Rival'}`
    );

    triggerNotification({
      titulo: `Final: Charales de Chapala ${result.golesFavor} - ${result.golesContra} ${match?.equipoRival}`,
      mensaje: `Resultado final registrado para ${match?.categoriaNombre}. Goleadores: ${result.goleadores || 'Equipo completo'}.`,
      tipo: 'PARTIDO',
      rolesDestino: ['PADRE_TUTOR', 'ENTRENADOR', 'SECRETARIA'],
      enlaceTab: 'partidos',
    });
  };

  const addTournament = (tournamentData: Omit<Tournament, 'id'>) => {
    const newId = Math.max(0, ...tournaments.map((t) => t.id)) + 1;
    const newTournament: Tournament = {
      ...tournamentData,
      id: newId,
    };
    setTournaments((prev) => [newTournament, ...prev]);

    addAuditLog(
      'ALTA_LIGA_TORNEO',
      'Torneos y Ligas',
      `Nueva competición registrada: ${newTournament.nombre} (${newTournament.tipo}) - Organizador: ${newTournament.organizador}, Temporada: ${newTournament.temporada}`
    );

    triggerNotification({
      titulo: `🏆 Nueva Competición: ${newTournament.nombre}`,
      mensaje: `Se ha registrado ${newTournament.nombre} (${newTournament.tipo}). Ya puedes consultar el calendario y programar partidos.`,
      tipo: 'PARTIDO',
      rolesDestino: ['ADMINISTRADOR', 'SECRETARIA', 'ENTRENADOR', 'PADRE_TUTOR'],
      enlaceTab: 'partidos',
    });

    return newTournament;
  };

  // --- FINANCES & PAYMENTS ---
  const generateMonthlyCharges = (periodo: string, vencimiento: string) => {
    // Generate monthly fee for all active players
    const concept = chargeConcepts.find((c) => c.esRecurrente) || chargeConcepts[0];
    const activePlayers = players.filter((p) => p.estatus === 'ACTIVO');

    let count = 0;
    const newCharges: Charge[] = [];

    activePlayers.forEach((player) => {
      // Check if already exists for this period
      const exists = charges.some(
        (c) => c.jugadorId === player.id && c.periodo === periodo && c.estado !== 'CANCELADO'
      );
      if (!exists) {
        count++;
        newCharges.push({
          id: Date.now() + count,
          jugadorId: player.id,
          jugadorNombre: `${player.nombre} ${player.apellidoPaterno}`,
          conceptoId: concept.id,
          conceptoNombre: `${concept.nombre} (${periodo})`,
          periodo,
          fechaCargo: new Date().toISOString().slice(0, 10),
          fechaVencimiento: vencimiento,
          montoOriginal: concept.importeSugerido,
          descuento: 0,
          montoFinal: concept.importeSugerido,
          montoPagado: 0,
          estado: 'PENDIENTE',
        });
      }
    });

    if (newCharges.length > 0) {
      setCharges((prev) => [...prev, ...newCharges]);
      addAuditLog(
        'GENERACION_MENSUALIDADES',
        'Finanzas',
        `Generación masiva de mensualidades ciclo ${periodo}: ${newCharges.length} cargos emitidos.`
      );

      triggerNotification({
        titulo: `💳 Mensualidades Emitidas: ${periodo}`,
        mensaje: `Se han generado los cargos del periodo ${periodo} con vencimiento el ${vencimiento}.`,
        tipo: 'PAGO',
        rolesDestino: ['PADRE_TUTOR', 'SECRETARIA'],
        enlaceTab: 'finanzas',
      });
    }

    return count;
  };

  const registerPayment = (
    chargeIds: number[],
    formaPago: PaymentMethod,
    tutorId?: number,
    tutorNombre?: string
  ) => {
    const targetCharges = charges.filter((c) => chargeIds.includes(c.id));
    if (targetCharges.length === 0) return null;

    const totalImporte = targetCharges.reduce((acc, c) => acc + (c.montoFinal - c.montoPagado), 0);
    const primaryPlayer = players.find((p) => p.id === targetCharges[0].jugadorId);
    const newPaymentId = Math.max(0, ...payments.map((p) => p.id)) + 1;
    const folio = `REC-2026-${String(newPaymentId).padStart(4, '0')}`;

    const newPayment: Payment = {
      id: newPaymentId,
      folio,
      jugadorId: targetCharges[0].jugadorId,
      jugadorNombre: primaryPlayer ? `${primaryPlayer.nombre} ${primaryPlayer.apellidoPaterno}` : targetCharges[0].jugadorNombre,
      tutorId,
      tutorNombre: tutorNombre || (primaryPlayer ? 'Familia Usuario' : 'Tutor'),
      fecha: new Date().toISOString().slice(0, 10),
      importe: totalImporte,
      formaPago,
      estado: 'APLICADO',
      cargosAplicados: targetCharges.map((c) => ({
        cargoId: c.id,
        conceptoNombre: c.conceptoNombre,
        importe: c.montoFinal - c.montoPagado,
      })),
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Mark charges as paid
    setCharges((prev) =>
      prev.map((c) => {
        if (chargeIds.includes(c.id)) {
          return {
            ...c,
            montoPagado: c.montoFinal,
            estado: 'PAGADO',
          };
        }
        return c;
      })
    );

    addAuditLog(
      'REGISTRO_PAGO',
      'Pagos',
      `Pago registrado exitosamente folio ${folio} por $${totalImporte} (${formaPago}) para ${newPayment.jugadorNombre}.`
    );

    triggerNotification({
      titulo: `✅ Pago Confirmado (${folio})`,
      mensaje: `Se ha acreditado el pago por $${totalImporte} mediante ${formaPago}. Recibo disponible para descarga.`,
      tipo: 'PAGO',
      rolesDestino: ['PADRE_TUTOR', 'SECRETARIA', 'ADMINISTRADOR'],
      tutorId,
      enlaceTab: 'finanzas',
    });

    return newPayment;
  };

  const cancelPayment = (paymentId: number, motivo: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              estado: 'CANCELADO',
              motivoCancelacion: motivo,
              canceladoPor: currentUser.nombre,
              fechaCancelacion: new Date().toISOString().slice(0, 16),
            }
          : p
      )
    );

    // Revert charges back to PENDIENTE
    const appliedIds = payment.cargosAplicados.map((c) => c.cargoId);
    setCharges((prev) =>
      prev.map((c) => {
        if (appliedIds.includes(c.id)) {
          return {
            ...c,
            montoPagado: 0,
            estado: 'PENDIENTE',
          };
        }
        return c;
      })
    );

    addAuditLog(
      'CANCELACION_PAGO',
      'Pagos',
      `Cancelación de pago ${payment.folio} ($${payment.importe}). Motivo: ${motivo}`
    );
  };

  // --- UNIFORMS & INVENTORY ---
  const orderUniform = (
    jugadorId: number,
    productoId: number,
    talla: string,
    cantidad: number
  ) => {
    const player = players.find((p) => p.id === jugadorId);
    const product = uniformProducts.find((p) => p.id === productoId);
    if (!player || !product) return;

    const total = product.precio * cantidad;
    const newOrderId = Math.max(0, ...uniformOrders.map((o) => o.id)) + 1;

    // Create uniform charge
    const newChargeId = Date.now();
    const newCharge: Charge = {
      id: newChargeId,
      jugadorId,
      jugadorNombre: `${player.nombre} ${player.apellidoPaterno}`,
      conceptoId: 3,
      conceptoNombre: `${product.nombre} (Talla: ${talla})`,
      fechaCargo: new Date().toISOString().slice(0, 10),
      fechaVencimiento: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      montoOriginal: total,
      descuento: 0,
      montoFinal: total,
      montoPagado: 0,
      estado: 'PENDIENTE',
    };
    setCharges((prev) => [...prev, newCharge]);

    const newOrder: UniformOrder = {
      id: newOrderId,
      jugadorId,
      jugadorNombre: `${player.nombre} ${player.apellidoPaterno}`,
      productoId,
      productoNombre: product.nombre,
      talla,
      cantidad,
      precioUnitario: product.precio,
      montoTotal: total,
      estado: 'SOLICITADO',
      fechaSolicitud: new Date().toISOString().slice(0, 10),
      cargoId: newChargeId,
    };

    setUniformOrders((prev) => [newOrder, ...prev]);

    // Deduct stock if available
    setUniformProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productoId) {
          const current = prod.stockPorTalla[talla] || 0;
          return {
            ...prod,
            stockPorTalla: {
              ...prod.stockPorTalla,
              [talla]: Math.max(0, current - cantidad),
            },
          };
        }
        return prod;
      })
    );

    addAuditLog(
      'PEDIDO_UNIFORME',
      'Uniformes',
      `Solicitud de uniforme para ${player.nombre}: ${product.nombre} talla ${talla} (Total $${total}).`
    );

    triggerNotification({
      titulo: '👕 Nuevo Pedido de Uniforme',
      mensaje: `Se ha registrado el pedido de uniforme para ${player.nombre}.`,
      tipo: 'UNIFORME',
      rolesDestino: ['SECRETARIA', 'ADMINISTRADOR', 'PADRE_TUTOR'],
      jugadorId,
    });
  };

  const deliverUniform = (orderId: number, recibidoPor: string) => {
    setUniformOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              estado: 'ENTREGADO',
              fechaEntrega: new Date().toISOString().slice(0, 10),
              recibidoPor,
            }
          : o
      )
    );

    const order = uniformOrders.find((o) => o.id === orderId);
    addAuditLog(
      'ENTREGA_UNIFORME',
      'Uniformes',
      `Entrega confirmada del pedido #${orderId} (${order?.productoNombre}) recibido por: ${recibidoPor}`
    );

    triggerNotification({
      titulo: '👟 Uniforme Entregado',
      mensaje: `El uniforme ${order?.productoNombre} ha sido entregado a ${recibidoPor}.`,
      tipo: 'UNIFORME',
      rolesDestino: ['PADRE_TUTOR', 'SECRETARIA'],
      jugadorId: order?.jugadorId,
    });
  };

  // --- PERFORMANCE EVALUATIONS ---
  const savePerformanceEvaluation = (evalData: Omit<PerformanceEvaluation, 'id' | 'evaluadorId' | 'evaluadorNombre' | 'fecha'>) => {
    const newId = Math.max(0, ...evaluations.map((e) => e.id)) + 1;
    const player = players.find((p) => p.id === evalData.jugadorId);

    const newEval: PerformanceEvaluation = {
      ...evalData,
      id: newId,
      evaluadorId: currentUser.id,
      evaluadorNombre: currentUser.nombre,
      fecha: new Date().toISOString().slice(0, 10),
    };

    setEvaluations((prev) => [newEval, ...prev]);

    addAuditLog(
      'EVALUACION_RENDIMIENTO',
      'Rendimiento',
      `Reporte de progreso individual guardado para ${player?.nombre} ${player?.apellidoPaterno} (${evalData.periodo})`
    );

    triggerNotification({
      titulo: `📈 Nuevo Reporte de Rendimiento: ${player?.nombre}`,
      mensaje: `El entrenador ${currentUser.nombre} ha subido la evaluación de progreso técnico de ${player?.nombre}.`,
      tipo: 'ASISTENCIA',
      rolesDestino: ['PADRE_TUTOR'],
      jugadorId: evalData.jugadorId,
      enlaceTab: 'rendimiento',
    });
  };

  // --- MESSAGES & NOTICES ---
  const sendDirectMessage = (destinatarioId: number, jugadorId: number, contenido: string) => {
    const destUser = users.find((u) => u.id === destinatarioId);
    const player = players.find((p) => p.id === jugadorId);

    const newMsg: DirectMessage = {
      id: Date.now(),
      remitenteId: currentUser.id,
      remitenteNombre: currentUser.nombre,
      remitenteRol: currentUser.rol,
      destinatarioId,
      destinatarioNombre: destUser ? destUser.nombre : 'Usuario',
      destinatarioRol: destUser ? destUser.rol : 'PADRE_TUTOR',
      jugadorId,
      jugadorNombre: player ? `${player.nombre} ${player.apellidoPaterno}` : 'Alumno',
      contenido,
      fechaHora: new Date().toISOString().replace('T', ' ').slice(0, 16),
      leido: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    triggerNotification({
      titulo: `💬 Mensaje de ${currentUser.nombre}`,
      mensaje: contenido.length > 70 ? contenido.slice(0, 67) + '...' : contenido,
      tipo: 'MENSAJE',
      rolesDestino: destUser ? [destUser.rol] : ['PADRE_TUTOR', 'ENTRENADOR'],
      enlaceTab: 'comunicacion',
    });
  };

  const publishNotice = (noticeData: Omit<Notice, 'id' | 'creadoPorNombre' | 'fechaPublicacion' | 'activo'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: Date.now(),
      creadoPorNombre: `${currentUser.nombre} (${currentUser.rol === 'ADMINISTRADOR' ? 'Dirección' : currentUser.rol})`,
      fechaPublicacion: new Date().toISOString().slice(0, 10),
      activo: true,
    };

    setNotices((prev) => [newNotice, ...prev]);

    addAuditLog('PUBLICACION_AVISO', 'Avisos', `Nuevo aviso publicado: "${noticeData.titulo}"`);

    triggerNotification({
      titulo: `📢 ${noticeData.titulo}`,
      mensaje: noticeData.mensaje.length > 80 ? noticeData.mensaje.slice(0, 77) + '...' : noticeData.mensaje,
      tipo: 'AVISO',
      rolesDestino: ['PADRE_TUTOR', 'ENTRENADOR', 'SECRETARIA', 'ADMINISTRADOR'],
      enlaceTab: 'comunicacion',
    });
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, leida: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  return {
    currentUser,
    users,
    seasons,
    venues,
    coaches,
    categories,
    players,
    guardians,
    relations,
    categoryHistory,
    tournaments,
    matches,
    sessions,
    attendance,
    chargeConcepts,
    charges,
    payments,
    uniformProducts,
    uniformOrders,
    materials,
    evaluations,
    notices,
    messages,
    notifications,
    auditLogs,

    // Actions
    addPlayer,
    updatePlayer,
    addCoach,
    updateCoach,
    changePlayerStatus,
    changePlayerCategory,
    addCategory,
    addVenue,
    updateCategoryTraining,
    addTrainingSession,
    registerSessionAttendance,
    scheduleMatch,
    updateMatchResult,
    addTournament,
    generateMonthlyCharges,
    registerPayment,
    cancelPayment,
    orderUniform,
    deliverUniform,
    savePerformanceEvaluation,
    sendDirectMessage,
    publishNotice,
    triggerNotification,
    markNotificationRead,
    markAllNotificationsRead,
    addAuditLog,
  };
}
