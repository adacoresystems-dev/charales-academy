export type Role = 'ADMINISTRADOR' | 'SECRETARIA' | 'ENTRENADOR' | 'PADRE_TUTOR';

export type PlayerStatus = 'ACTIVO' | 'BAJA_TEMPORAL' | 'BAJA_DEFINITIVA';

export type SexType = 'MASCULINO' | 'FEMENINO' | 'NO_ESPECIFICADO';

export type AttendanceStatus = 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';

export type MatchStatus = 'PROGRAMADO' | 'JUGADO' | 'REPROGRAMADO' | 'CANCELADO';

export type ChargeStatus = 'PENDIENTE' | 'PAGADO' | 'PARCIAL' | 'VENCIDO' | 'CANCELADO';

export type PaymentMethod = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'EN_LINEA';

export type UniformOrderStatus = 'SOLICITADO' | 'PAGADO' | 'ENTREGADO' | 'CANCELADO';

export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: Role;
  avatarUrl?: string;
  telefono?: string;
  activo: boolean;
  ultimoAcceso?: string;
}

export interface Player {
  id: number;
  identificador: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento: string; // YYYY-MM-DD
  sexo: SexType;
  estatus: PlayerStatus;
  posicionHabitual?: string;
  numeroCamiseta?: number;
  fotoUrl?: string;
  telefonoContacto?: string;
  alergiasMedicas?: string;
  categoriaActualId?: number;
  categoriaActualNombre?: string;
  fechaIngreso: string;
}

export interface Guardian {
  id: number;
  usuarioId?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono: string;
  email: string;
  ocupacion?: string;
}

export interface GuardianPlayerRelation {
  tutorId: number;
  jugadorId: number;
  parentesco: string; // 'Padre', 'Madre', 'Tutor Legal', etc.
  esContactoPrincipal: boolean;
}

export interface Coach {
  id: number;
  usuarioId?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono: string;
  email: string;
  licencia?: string;
  activo: boolean;
  categoriasAsignadas?: number[]; // IDs
  fotoUrl?: string;
}

export interface Season {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  esActual: boolean;
  activa: boolean;
}

export interface Category {
  id: number;
  temporadaId: number;
  nombre: string;
  edadMinima: number;
  edadMaxima: number;
  cupoMaximo: number;
  diasEntrenamiento: string[]; // ['Lunes', 'Miércoles', 'Viernes']
  horario: string; // '16:30 - 18:00'
  sedeId: number;
  sedeNombre: string;
  entrenadoresNombres: string[];
  entrenadorIds: number[];
  activa: boolean;
}

export interface CategoryHistory {
  id: number;
  jugadorId: number;
  categoriaAnteriorNombre: string;
  categoriaNuevaNombre: string;
  fechaCambio: string;
  motivo: string;
}

export interface Venue {
  id: number;
  nombre: string;
  direccion: string;
  tipoCancha: 'Sintética' | 'Pasto Natural' | 'Pabellón Cubierto';
}

export interface TrainingSession {
  id: number;
  categoriaId: number;
  categoriaNombre: string;
  sedeId: number;
  sedeNombre: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string;
  horaFin: string;
  entrenadorNombre: string;
  objetivo?: string;
  observaciones?: string;
  estado: 'PROGRAMADA' | 'REALIZADA' | 'CANCELADA';
}

export interface AttendanceRecord {
  id: number;
  sesionId: number;
  jugadorId: number;
  jugadorNombre: string;
  estado: AttendanceStatus;
  observacion?: string;
}

export interface Tournament {
  id: number;
  nombre: string;
  organizador: string;
  tipo: 'Torneo Relámpago' | 'Liga Local' | 'Copa Interclubes' | 'Estatal';
  temporada: string;
  fechaInicio: string;
  fechaFin: string;
  estatus: 'INSCRIPCIÓN' | 'EN_CURSO' | 'FINALIZADO';
  categoriasInscritas: number[];
}

export interface TournamentPlayer {
  id: number;
  torneoId: number;
  categoriaId: number;
  jugadorId: number;
  numeroCamiseta: number;
  fechaAlta: string;
}

export interface Match {
  id: number;
  torneoId: number;
  torneoNombre: string;
  categoriaId: number;
  categoriaNombre: string;
  equipoRival: string;
  esLocal: boolean;
  fecha: string;
  hora: string;
  sede: string;
  cancha?: string;
  estado: MatchStatus;
  golesFavor?: number;
  golesContra?: number;
  goleadores?: string;
  observaciones?: string;
}

export interface ChargeConcept {
  id: number;
  nombre: string;
  importeSugerido: number;
  esRecurrente: boolean;
  activo: boolean;
}

export interface Charge {
  id: number;
  jugadorId: number;
  jugadorNombre: string;
  conceptoId: number;
  conceptoNombre: string;
  periodo?: string; // '2026-10'
  fechaCargo: string;
  fechaVencimiento: string;
  montoOriginal: number;
  descuento: number;
  montoFinal: number;
  montoPagado: number;
  estado: ChargeStatus;
}

export interface Payment {
  id: number;
  folio: string;
  jugadorId: number;
  jugadorNombre: string;
  tutorId?: number;
  tutorNombre?: string;
  fecha: string;
  importe: number;
  formaPago: PaymentMethod;
  estado: 'APLICADO' | 'CANCELADO';
  motivoCancelacion?: string;
  cargosAplicados: {
    cargoId: number;
    conceptoNombre: string;
    importe: number;
  }[];
  canceladoPor?: string;
  fechaCancelacion?: string;
}

export interface UniformProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tallasDisponibles: string[];
  stockPorTalla: Record<string, number>;
  imagenUrl?: string;
  activo: boolean;
}

export interface UniformOrder {
  id: number;
  jugadorId: number;
  jugadorNombre: string;
  tutorNombre?: string;
  productoId: number;
  productoNombre: string;
  talla: string;
  cantidad: number;
  precioUnitario: number;
  montoTotal: number;
  estado: UniformOrderStatus;
  fechaSolicitud: string;
  fechaEntrega?: string;
  recibidoPor?: string;
  cargoId?: number;
}

export interface SportsMaterial {
  id: number;
  nombre: string;
  categoria: 'Balones' | 'Conos & Marcadores' | 'Petos & Chalecos' | 'Equipamiento Táctico' | 'Primeros Auxilios';
  cantidadTotal: number;
  cantidadDisponible: number;
  estado: 'Óptimo' | 'Regular' | 'Requiere Reemplazo';
  ubicacion: string;
}

export interface PerformanceEvaluation {
  id: number;
  jugadorId: number;
  evaluadorId: number;
  evaluadorNombre: string;
  fecha: string;
  periodo: string; // ej. 'Octubre 2026'
  // Escala 1 a 10
  controlBalon: number;
  pase: number;
  tiroDefinicion: number;
  velocidadAgilidad: number;
  resistencia: number;
  posicionamientoTactico: number;
  disciplinaCompromiso: number;
  trabajoEnEquipo: number;
  comentariosFortalezas: string;
  areasDeMejora: string;
  destacadoSemana: boolean;
}

export interface Notice {
  id: number;
  titulo: string;
  mensaje: string;
  fechaPublicacion: string;
  creadoPorNombre: string;
  tipoAudiencia: 'GENERAL' | 'CATEGORIA' | 'ENTRENADORES' | 'TUTOR';
  categoriaIds?: number[];
  importante: boolean;
  activo: boolean;
}

export interface DirectMessage {
  id: number;
  remitenteId: number;
  remitenteNombre: string;
  remitenteRol: Role;
  destinatarioId: number;
  destinatarioNombre: string;
  destinatarioRol: Role;
  jugadorId: number;
  jugadorNombre: string;
  contenido: string;
  fechaHora: string;
  leido: boolean;
}

export interface AppNotification {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'PARTIDO' | 'PAGO' | 'AVISO' | 'MENSAJE' | 'ASISTENCIA' | 'UNIFORME';
  fechaHora: string;
  leida: boolean;
  enlaceTab?: string;
  rolesDestino: Role[];
  tutorId?: number;
  jugadorId?: number;
}

export interface AuditLog {
  id: number;
  usuarioNombre: string;
  usuarioRol: Role;
  accion: string;
  entidad: string;
  detalles: string;
  fechaHora: string;
}
