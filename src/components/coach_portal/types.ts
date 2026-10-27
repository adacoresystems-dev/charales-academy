export type PlayerPosition = 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';

export type AttendanceStatus = 'presente' | 'ausente' | 'retardo' | 'justificado';

export interface TechnicalSkills {
  control: number;     // 1 - 10
  pase: number;        // 1 - 10
  tiro: number;        // 1 - 10
  velocidad: number;   // 1 - 10
  tactica: number;     // 1 - 10
  disciplina: number;  // 1 - 10
}

export interface MonthlyRecord {
  month: string;
  year: number;
  attendancePercent: number;
  technicalAverage: number;
  matchesPlayed: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  coachFeedback: string;
}

export interface Player {
  id: string;
  name: string;
  dorsal: number;
  category: string; // e.g. "Sub-11 (2014-2015)"
  position: PlayerPosition;
  birthDate: string;
  avatarUrl?: string;
  tutorName: string;
  tutorPhone: string;
  tutorEmail: string;
  medicalNotes: string;
  status: 'Activo' | 'Lesionado' | 'En Observación';
  currentSkills: TechnicalSkills;
  categoryAverageSkills?: TechnicalSkills;
  monthlyHistory: MonthlyRecord[];
  overallAttendanceRate: number; // percentage
  coachObservations: string;
  strengths: string[];
  areasToImprove: string[];
}

export interface Coach {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
  assignedCategories: string[];
  experienceYears: number;
  licenseNumber: string;
}

export interface SessionAttendanceItem {
  playerId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface TrainingSession {
  id: string;
  date: string;
  time: string;
  category: string;
  field: string;
  title: string;
  objective: string;
  warmupDrill: string;
  mainDrill: string;
  cooldownDrill: string;
  materialsNeeded: string[];
  observations: string;
  completed: boolean;
  attendance: SessionAttendanceItem[];
}

export interface MatchFixture {
  id: string;
  date: string;
  time: string;
  category: string;
  tournament: string;
  opponent: string;
  isHome: boolean;
  location: string;
  field: string;
  status: 'Programado' | 'Finalizado' | 'En curso';
  scoreHome?: number;
  scoreAway?: number;
  convokedPlayerIds: string[];
  coachNotes?: string;
}

export interface TournamentStanding {
  id: string;
  team: string;
  pj: number; // Partidos jugados
  pg: number; // Ganados
  pe: number; // Empatados
  pp: number; // Perdidos
  gf: number; // Goles a favor
  gc: number; // Goles en contra
  dg: number; // Diferencia
  pts: number; // Puntos
  isCharales?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'convocatoria' | 'asistencia' | 'aviso' | 'medico' | 'torneo';
  title: string;
  message: string;
  date: string;
  category?: string;
  read: boolean;
  sender: string;
  targetRole: 'Entrenador' | 'Tutor/Jugador' | 'Todos';
}
