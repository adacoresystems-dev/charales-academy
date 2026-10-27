// Datos sintéticos anonimizados para demostración pública. No representan personas reales.
import { Coach, Player, TrainingSession, MatchFixture, TournamentStanding, NotificationItem } from './types';

export const mockCoaches: Coach[] = [
  {
    id: 'coach-1',
    name: "Entrenador demo 01",
    title: 'Director Técnico Categorías Formativas',
    email: 'demo@example.test',
    phone: "",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedCategories: ['Sub-11 Varonil (2014-2015)', 'Sub-13 Varonil (2012-2013)'],
    experienceYears: 8,
    licenseNumber: "DEMO-1"
  },
  {
    id: 'coach-2',
    name: "Entrenador demo 02",
    title: 'Entrenadora Formativa & Psicomotricidad',
    email: 'demo@example.test',
    phone: "",
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedCategories: ['Sub-9 Dientes de Leche (2016-2017)'],
    experienceYears: 5,
    licenseNumber: "DEMO-2"
  }
];

export const mockPlayers: Player[] = [
  {
    id: 'player-1',
    name: "Alumno demo 01",
    dorsal: 10,
    category: 'Sub-11 Varonil (2014-2015)',
    position: 'Mediocampista',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 01",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 8.8,
      pase: 9.1,
      tiro: 8.4,
      velocidad: 8.0,
      tactica: 8.7,
      disciplina: 9.5
    },
    categoryAverageSkills: {
      control: 7.3,
      pase: 7.1,
      tiro: 6.9,
      velocidad: 7.5,
      tactica: 7.0,
      disciplina: 8.2
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 92,
        technicalAverage: 8.1,
        matchesPlayed: 4,
        minutesPlayed: 180,
        goals: 2,
        assists: 3,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 96,
        technicalAverage: 8.4,
        matchesPlayed: 4,
        minutesPlayed: 195,
        goals: 3,
        assists: 4,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 100,
        technicalAverage: 8.6,
        matchesPlayed: 5,
        minutesPlayed: 240,
        goals: 4,
        assists: 5,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 95,
        technicalAverage: 8.75,
        matchesPlayed: 3,
        minutesPlayed: 150,
        goals: 2,
        assists: 3,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 96,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Visión de juego periférica', 'Pase filtrado preciso', 'Actitud deportiva intachable'],
    areasToImprove: ['Duelos físicos hombro a hombro', 'Potencia de remate con zurda']
  },
  {
    id: 'player-2',
    name: "Alumno demo 02",
    dorsal: 9,
    category: 'Sub-11 Varonil (2014-2015)',
    position: 'Delantero',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 02",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 7.9,
      pase: 7.2,
      tiro: 9.3,
      velocidad: 8.9,
      tactica: 7.5,
      disciplina: 8.6
    },
    categoryAverageSkills: {
      control: 7.3,
      pase: 7.1,
      tiro: 6.9,
      velocidad: 7.5,
      tactica: 7.0,
      disciplina: 8.2
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 88,
        technicalAverage: 7.9,
        matchesPlayed: 4,
        minutesPlayed: 170,
        goals: 5,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 90,
        technicalAverage: 8.1,
        matchesPlayed: 4,
        minutesPlayed: 185,
        goals: 6,
        assists: 2,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 94,
        technicalAverage: 8.3,
        matchesPlayed: 5,
        minutesPlayed: 230,
        goals: 7,
        assists: 3,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 91,
        technicalAverage: 8.23,
        matchesPlayed: 3,
        minutesPlayed: 140,
        goals: 3,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 91,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Instinto goleador', 'Velocidad en contragolpe', 'Definición con ambos perfiles'],
    areasToImprove: ['Juego aéreo defensivo en táctica fija', 'Descargas de espaldas a portería']
  },
  {
    id: 'player-3',
    name: "Alumno demo 03",
    dorsal: 1,
    category: 'Sub-11 Varonil (2014-2015)',
    position: 'Portero',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 03",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 7.0,
      pase: 7.5,
      tiro: 6.2,
      velocidad: 7.8,
      tactica: 8.3,
      disciplina: 9.0
    },
    categoryAverageSkills: {
      control: 7.3,
      pase: 7.1,
      tiro: 6.9,
      velocidad: 7.5,
      tactica: 7.0,
      disciplina: 8.2
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 100,
        technicalAverage: 7.3,
        matchesPlayed: 4,
        minutesPlayed: 200,
        goals: 0,
        assists: 0,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 95,
        technicalAverage: 7.5,
        matchesPlayed: 4,
        minutesPlayed: 200,
        goals: 0,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 96,
        technicalAverage: 7.7,
        matchesPlayed: 5,
        minutesPlayed: 250,
        goals: 0,
        assists: 0,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 100,
        technicalAverage: 7.63,
        matchesPlayed: 3,
        minutesPlayed: 150,
        goals: 0,
        assists: 0,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 98,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Reflejos felinos', 'Liderazgo en el área', 'Juego de pies para reiniciar'],
    areasToImprove: ['Bloqueo en achique bajo', 'Cálculo de trayectoria con viento']
  },
  {
    id: 'player-4',
    name: "Alumno demo 04",
    dorsal: 4,
    category: 'Sub-11 Varonil (2014-2015)',
    position: 'Defensa',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 04",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 7.4,
      pase: 7.8,
      tiro: 6.5,
      velocidad: 8.2,
      tactica: 8.5,
      disciplina: 9.1
    },
    categoryAverageSkills: {
      control: 7.3,
      pase: 7.1,
      tiro: 6.9,
      velocidad: 7.5,
      tactica: 7.0,
      disciplina: 8.2
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 90,
        technicalAverage: 7.5,
        matchesPlayed: 4,
        minutesPlayed: 180,
        goals: 1,
        assists: 0,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 92,
        technicalAverage: 7.7,
        matchesPlayed: 4,
        minutesPlayed: 190,
        goals: 1,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 96,
        technicalAverage: 7.9,
        matchesPlayed: 5,
        minutesPlayed: 235,
        goals: 0,
        assists: 2,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 95,
        technicalAverage: 7.92,
        matchesPlayed: 3,
        minutesPlayed: 145,
        goals: 0,
        assists: 0,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 93,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Anticipación defensiva', 'Salida con pase firme', 'Juego aéreo'],
    areasToImprove: ['Giro en velocidad con atacantes rápidos', 'Disparo de tiro libre']
  },
  {
    id: 'player-5',
    name: "Alumno demo 05",
    dorsal: 7,
    category: 'Sub-11 Varonil (2014-2015)',
    position: 'Mediocampista',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 05",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 8.1,
      pase: 8.3,
      tiro: 7.5,
      velocidad: 8.4,
      tactica: 7.9,
      disciplina: 8.5
    },
    categoryAverageSkills: {
      control: 7.3,
      pase: 7.1,
      tiro: 6.9,
      velocidad: 7.5,
      tactica: 7.0,
      disciplina: 8.2
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 88,
        technicalAverage: 7.6,
        matchesPlayed: 3,
        minutesPlayed: 130,
        goals: 1,
        assists: 2,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 90,
        technicalAverage: 7.8,
        matchesPlayed: 4,
        minutesPlayed: 175,
        goals: 2,
        assists: 3,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 92,
        technicalAverage: 8.0,
        matchesPlayed: 4,
        minutesPlayed: 180,
        goals: 1,
        assists: 4,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 94,
        technicalAverage: 8.03,
        matchesPlayed: 3,
        minutesPlayed: 140,
        goals: 1,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 91,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Cambio de ritmo', 'Centros precisos', 'Buen golpeo a balón parado'],
    areasToImprove: ['Recuperación tras pérdida', 'Resistencia aeróbica en el 2do tiempo']
  },
  {
    id: 'player-6',
    name: "Alumno demo 06",
    dorsal: 3,
    category: 'Sub-11 Varonil (2014-2015)',
    position: 'Defensa',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 06",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 7.1,
      pase: 7.3,
      tiro: 6.0,
      velocidad: 8.5,
      tactica: 7.6,
      disciplina: 8.8
    },
    categoryAverageSkills: {
      control: 7.3,
      pase: 7.1,
      tiro: 6.9,
      velocidad: 7.5,
      tactica: 7.0,
      disciplina: 8.2
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 85,
        technicalAverage: 7.1,
        matchesPlayed: 4,
        minutesPlayed: 170,
        goals: 0,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 88,
        technicalAverage: 7.3,
        matchesPlayed: 4,
        minutesPlayed: 180,
        goals: 0,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 91,
        technicalAverage: 7.5,
        matchesPlayed: 5,
        minutesPlayed: 220,
        goals: 0,
        assists: 2,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 90,
        technicalAverage: 7.55,
        matchesPlayed: 3,
        minutesPlayed: 135,
        goals: 0,
        assists: 0,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 88,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Recuperación en retroceso', 'Agilidad y despliegue físico', 'Disciplina táctica'],
    areasToImprove: ['Calidad del último pase al llegar a línea de fondo', 'Control de balón bajo presión']
  },
  {
    id: 'player-7',
    name: "Alumno demo 07",
    dorsal: 8,
    category: 'Sub-11 Varonil (2014-2015)',
    position: 'Mediocampista',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 07",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 7.7,
      pase: 8.0,
      tiro: 7.2,
      velocidad: 7.3,
      tactica: 8.2,
      disciplina: 9.2
    },
    categoryAverageSkills: {
      control: 7.3,
      pase: 7.1,
      tiro: 6.9,
      velocidad: 7.5,
      tactica: 7.0,
      disciplina: 8.2
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 92,
        technicalAverage: 7.6,
        matchesPlayed: 4,
        minutesPlayed: 160,
        goals: 1,
        assists: 2,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 94,
        technicalAverage: 7.8,
        matchesPlayed: 4,
        minutesPlayed: 180,
        goals: 0,
        assists: 2,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 96,
        technicalAverage: 8.0,
        matchesPlayed: 5,
        minutesPlayed: 210,
        goals: 1,
        assists: 3,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 95,
        technicalAverage: 8.1,
        matchesPlayed: 3,
        minutesPlayed: 140,
        goals: 0,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 94,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Ubicación en el campo', 'Corte limpio de balón', 'Espíritu de equipo'],
    areasToImprove: ['Animarse a probar tiro de larga distancia', 'Acelerar el giro con marca encima']
  },
  {
    id: 'player-8',
    name: "Alumno demo 08",
    dorsal: 11,
    category: 'Sub-11 Varonil (2014-2015)',
    position: 'Delantero',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 08",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 7.8,
      pase: 7.0,
      tiro: 8.6,
      velocidad: 8.7,
      tactica: 7.2,
      disciplina: 8.3
    },
    categoryAverageSkills: {
      control: 7.3,
      pase: 7.1,
      tiro: 6.9,
      velocidad: 7.5,
      tactica: 7.0,
      disciplina: 8.2
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 85,
        technicalAverage: 7.4,
        matchesPlayed: 3,
        minutesPlayed: 120,
        goals: 2,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 90,
        technicalAverage: 7.7,
        matchesPlayed: 4,
        minutesPlayed: 160,
        goals: 4,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 92,
        technicalAverage: 8.0,
        matchesPlayed: 5,
        minutesPlayed: 200,
        goals: 5,
        assists: 2,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 93,
        technicalAverage: 7.93,
        matchesPlayed: 3,
        minutesPlayed: 135,
        goals: 2,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 90,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Potencia en pierna izquierda', 'Desmarque en profundidad', 'Gran aceleración'],
    areasToImprove: ['Toma de decisiones al entrar al área', 'Asociación corta en espacios reducidos']
  },
  // Sub-13 players for multi-category view
  {
    id: 'player-9',
    name: "Alumno demo 09",
    dorsal: 5,
    category: 'Sub-13 Varonil (2012-2013)',
    position: 'Defensa',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 09",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 7.9,
      pase: 8.2,
      tiro: 6.8,
      velocidad: 8.3,
      tactica: 8.8,
      disciplina: 9.3
    },
    categoryAverageSkills: {
      control: 7.5,
      pase: 7.6,
      tiro: 7.1,
      velocidad: 7.8,
      tactica: 7.7,
      disciplina: 8.4
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 95,
        technicalAverage: 8.0,
        matchesPlayed: 4,
        minutesPlayed: 220,
        goals: 0,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 96,
        technicalAverage: 8.2,
        matchesPlayed: 4,
        minutesPlayed: 240,
        goals: 1,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 100,
        technicalAverage: 8.4,
        matchesPlayed: 5,
        minutesPlayed: 290,
        goals: 1,
        assists: 2,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 96,
        technicalAverage: 8.38,
        matchesPlayed: 3,
        minutesPlayed: 180,
        goals: 0,
        assists: 1,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 97,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Dominio aéreo', 'Voz de mando', 'Corte limpio'],
    areasToImprove: ['Velocidad de retroceso ante pelotazos frontales', 'Remate de cabeza ofensivo']
  },
  {
    id: 'player-10',
    name: "Alumno demo 10",
    dorsal: 10,
    category: 'Sub-13 Varonil (2012-2013)',
    position: 'Mediocampista',
    birthDate: "2015-01-01",
    tutorName: "Tutor demo 10",
    tutorPhone: "",
    tutorEmail: 'demo@example.test',
    medicalNotes: "",
    status: "Activo",
    currentSkills: {
      control: 9.0,
      pase: 8.9,
      tiro: 8.5,
      velocidad: 8.2,
      tactica: 8.7,
      disciplina: 9.0
    },
    categoryAverageSkills: {
      control: 7.5,
      pase: 7.6,
      tiro: 7.1,
      velocidad: 7.8,
      tactica: 7.7,
      disciplina: 8.4
    },
    monthlyHistory: [
      {
        month: 'Enero',
        year: 2026,
        attendancePercent: 92,
        technicalAverage: 8.3,
        matchesPlayed: 4,
        minutesPlayed: 210,
        goals: 3,
        assists: 4,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Febrero',
        year: 2026,
        attendancePercent: 95,
        technicalAverage: 8.6,
        matchesPlayed: 4,
        minutesPlayed: 230,
        goals: 4,
        assists: 5,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Marzo',
        year: 2026,
        attendancePercent: 98,
        technicalAverage: 8.8,
        matchesPlayed: 5,
        minutesPlayed: 280,
        goals: 6,
        assists: 6,
        coachFeedback: "Texto de demostración sin información personal."
      },
      {
        month: 'Abril',
        year: 2026,
        attendancePercent: 94,
        technicalAverage: 8.72,
        matchesPlayed: 3,
        minutesPlayed: 170,
        goals: 2,
        assists: 3,
        coachFeedback: "Texto de demostración sin información personal."
      }
    ],
    overallAttendanceRate: 95,
    coachObservations: "Texto de demostración sin información personal.",
    strengths: ['Pase entre líneas', 'Regate en espacio reducido', 'Tiro libre directo'],
    areasToImprove: ['Intensidad en la recuperación post-pérdida', 'Comunicación no verbal']
  }
];

export const mockTrainingSessions: TrainingSession[] = [
  {
    id: 'session-today',
    date: '2026-10-21',
    time: '16:30 - 18:00',
    category: 'Sub-11 Varonil (2014-2015)',
    field: 'Cancha Principal Usuario Rayo (Pasto Natural)',
    title: 'Transición Ofensiva y Definición en 3 vs 2',
    objective: 'Mejorar la toma de decisiones en ventaja numérica ofensiva y la finalización en menos de 3 toques.',
    warmupDrill: '15 min: Movilidad articular activa, rondos de activación técnica 4 vs 1 con cambio de rol.',
    mainDrill: '45 min: Ejercicio en oleadas 3 vs 2 con repliegue retrasado de un pivote defensivo. Remate a portería.',
    cooldownDrill: '15 min: Trabajo de estiramiento estático guiado y retroalimentación grupal de la sesión.',
    materialsNeeded: ['20 Balones No. 4', '15 Conos Chinos', '10 Casacas Rojas / Azules', '2 Porterías Móviles'],
    observations: 'La cancha se encuentra en excelentes condiciones. Buen ritmo e intensidad en la primera fase.',
    completed: false,
    attendance: [
      { playerId: 'player-1', status: 'presente', note: 'Llegó puntual, excelente disposición' },
      { playerId: 'player-2', status: 'presente' },
      { playerId: 'player-3', status: 'presente' },
      { playerId: 'player-4', status: 'presente' },
      { playerId: 'player-5', status: 'retardo', note: 'Demora de 10 min por tránsito escolar' },
      { playerId: 'player-6', status: 'presente' },
      { playerId: 'player-7', status: 'justificado', note: 'Ejemplo de demostración' },
      { playerId: 'player-8', status: 'presente' }
    ]
  },
  {
    id: 'session-prev-1',
    date: '2026-10-19',
    time: '16:30 - 18:00',
    category: 'Sub-11 Varonil (2014-2015)',
    field: 'Cancha 2 Anexa (Pasto Sintético)',
    title: 'Control Orientado y Pase Entre Líneas',
    objective: 'Fomentar la perfilación corporal antes de recibir y la búsqueda del pase hacia adelante.',
    warmupDrill: 'Activación con circuitos de coordinación motriz con escaleras y mini vallas.',
    mainDrill: 'Posesión 5 vs 5 con dos comodines en zonas delimitadas.',
    cooldownDrill: 'Vuelta a la calma con trote suave y estiramiento miofascial.',
    materialsNeeded: ['18 Balones No. 4', 'Estacas', 'Escaleras de agilidad'],
    observations: 'Se observó gran mejoría en Alumno demo 03 al descargar de espaldas. Alumno demo 04 y Alumno mostraron gran química.',
    completed: true,
    attendance: [
      { playerId: 'player-1', status: 'presente' },
      { playerId: 'player-2', status: 'presente' },
      { playerId: 'player-3', status: 'presente' },
      { playerId: 'player-4', status: 'presente' },
      { playerId: 'player-5', status: 'presente' },
      { playerId: 'player-6', status: 'presente' },
      { playerId: 'player-7', status: 'presente' },
      { playerId: 'player-8', status: 'presente' }
    ]
  },
  {
    id: 'session-sub13-today',
    date: '2026-10-21',
    time: '18:15 - 19:45',
    category: 'Sub-13 Varonil (2012-2013)',
    field: 'Cancha Principal Usuario Rayo',
    title: 'Basculación Defensiva y Presión en Bloque Medio',
    objective: 'Coordinar la línea de 4 defensores con los contenciones para cerrar líneas de pase interiores.',
    warmupDrill: 'Rondos dinámicos 6 vs 2 con límite de dos toques.',
    mainDrill: 'Fútbol condicionado 8 vs 8 en 3/4 de cancha con presión coordinada tras pérdida.',
    cooldownDrill: 'Ejercicios de respiración diafragmática y flexibilidad de tren inferior.',
    materialsNeeded: ['Balones No. 5', 'Platos delimitadores', 'Cintas de demarcación'],
    observations: 'Preparación especial para el partido del sábado contra Tuzos Ocotlán.',
    completed: false,
    attendance: [
      { playerId: 'player-9', status: 'presente' },
      { playerId: 'player-10', status: 'presente' }
    ]
  }
];

export const mockMatches: MatchFixture[] = [
  {
    id: 'match-1',
    date: '2026-10-24',
    time: '10:00 AM',
    category: 'Sub-11 Varonil (2014-2015)',
    tournament: 'Liga Regional Infantil Ribera de Chapala - Jornada 8',
    opponent: 'Academia Tuzos Ocotlán',
    isHome: true,
    location: 'Unidad Deportiva Charales de Chapala',
    field: 'Cancha 1 (Pasto Natural)',
    status: 'Programado',
    convokedPlayerIds: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5', 'player-6', 'player-7', 'player-8'],
    coachNotes: 'Citar a los muchachos 9:00 AM con uniforme rojo titular completo y credenciales vigentes.'
  },
  {
    id: 'match-2',
    date: '2026-10-17',
    time: '11:30 AM',
    category: 'Sub-11 Varonil (2014-2015)',
    tournament: 'Liga Regional Infantil Ribera de Chapala - Jornada 7',
    opponent: 'Leones Negros Jocotepec',
    isHome: false,
    location: 'Campo Deportivo Municipal de Jocotepec',
    field: 'Cancha Principal',
    status: 'Finalizado',
    scoreHome: 1,
    scoreAway: 4,
    convokedPlayerIds: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5', 'player-6', 'player-7', 'player-8'],
    coachNotes: 'Excelente partido. Gran actuación de Alumno demo 03 con triplete y Alumno demo 04 comandando la media cancha.'
  },
  {
    id: 'match-3',
    date: '2026-10-24',
    time: '12:00 PM',
    category: 'Sub-13 Varonil (2012-2013)',
    tournament: 'Copa Estatal Jalisco Juvenil - Cuartos de Final',
    opponent: 'Atlas Chapala Filial',
    isHome: true,
    location: 'Estadio Municipal Usuario Rayo, Chapala',
    field: 'Cancha Principal',
    status: 'Programado',
    convokedPlayerIds: ['player-9', 'player-10'],
    coachNotes: 'Clásico ribereño de eliminación directa. Máxima concentración y apoyo de los padres.'
  }
];

export const mockStandingsSub11: TournamentStanding[] = [
  { id: '1', team: 'Charales de Chapala Sub-11', pj: 7, pg: 6, pe: 1, pp: 0, gf: 24, gc: 5, dg: 19, pts: 19, isCharales: true },
  { id: '2', team: 'Tuzos Ocotlán', pj: 7, pg: 5, pe: 1, pp: 1, gf: 18, gc: 8, dg: 10, pts: 16 },
  { id: '3', team: 'Leones Negros Jocotepec', pj: 7, pg: 4, pe: 1, pp: 2, gf: 15, gc: 12, dg: 3, pts: 13 },
  { id: '4', team: 'Halcones de Poncitlán', pj: 7, pg: 3, pe: 2, pp: 2, gf: 12, gc: 11, dg: 1, pts: 11 },
  { id: '5', team: 'Deportivo Ixtlahuacán', pj: 7, pg: 2, pe: 1, pp: 4, gf: 9, gc: 16, dg: -7, pts: 7 },
  { id: '6', team: 'Guerreros Ajijic', pj: 7, pg: 0, pe: 1, pp: 6, gf: 4, gc: 22, dg: -18, pts: 1 }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'convocatoria',
    title: 'Convocatoria Oficial: Jornada 8 vs Tuzos Ocotlán',
    message: "Texto de demostración sin información personal.",
    date: '2026-10-21 08:30',
    category: 'Sub-11 Varonil (2014-2015)',
    read: false,
    sender: 'Entrenador demo 01',
    targetRole: 'Tutor/Jugador'
  },
  {
    id: 'notif-2',
    type: 'aviso',
    title: 'Mantenimiento preventivo en Cancha Anexa 2',
    message: "Texto de demostración sin información personal.",
    date: '2026-10-20 14:15',
    category: 'Todas las Categorías',
    read: false,
    sender: 'Coordinación Deportiva',
    targetRole: 'Entrenador'
  },
  {
    id: 'notif-3',
    type: 'asistencia',
    title: 'Ejemplo de demostración',
    message: "Texto de demostración sin información personal.",
    date: '2026-10-20 19:40',
    category: 'Sub-11 Varonil (2014-2015)',
    read: true,
    sender: 'Tutor Tutor demo 07',
    targetRole: 'Entrenador'
  },
  {
    id: 'notif-4',
    type: 'torneo',
    title: 'Clasificación a Liguilla Estatal Asegurada',
    message: "Texto de demostración sin información personal.",
    date: '2026-10-18 20:00',
    category: 'Sub-13 Varonil (2012-2013)',
    read: true,
    sender: 'Dirección Deportiva Charales',
    targetRole: 'Todos'
  }
];
