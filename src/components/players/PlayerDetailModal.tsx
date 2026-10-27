import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Layers,
  CalendarCheck,
  CreditCard,
  Shirt,
  TrendingUp,
  AlertCircle,
  Phone,
  Mail,
  HeartPulse,
  ArrowRight,
  Clock,
  CheckCircle2,
  Trophy,
  ShieldCheck,
} from 'lucide-react';
import { StudentCredentialModal } from './StudentCredentialModal';
import {
  Player,
  Guardian,
  GuardianPlayerRelation,
  Category,
  CategoryHistory,
  AttendanceRecord,
  Charge,
  Payment,
  UniformOrder,
  PerformanceEvaluation,
  Role,
} from '../../types';

interface PlayerDetailModalProps {
  player: Player | null;
  onClose: () => void;
  guardians: Guardian[];
  relations: GuardianPlayerRelation[];
  categories: Category[];
  categoryHistory: CategoryHistory[];
  attendanceRecords: AttendanceRecord[];
  charges: Charge[];
  payments: Payment[];
  uniformOrders: UniformOrder[];
  evaluations: PerformanceEvaluation[];
  currentRole: Role;
  onChangeCategory: (playerId: number, newCatId: number, motivo: string) => void;
  onOpenPaymentGateway: (chargeId: number) => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  player,
  onClose,
  guardians,
  relations,
  categories,
  categoryHistory,
  attendanceRecords,
  charges,
  payments,
  uniformOrders,
  evaluations,
  currentRole,
  onChangeCategory,
  onOpenPaymentGateway,
}) => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'categoria' | 'asistencia' | 'finanzas' | 'uniformes' | 'rendimiento'
  >('general');

  // Change category sub-state
  const [newCatId, setNewCatId] = useState<number>(categories[0]?.id || 1);
  const [categoryChangeReason, setCategoryChangeReason] = useState('');
  const [showCategoryChangeForm, setShowCategoryChangeForm] = useState(false);
  const [showCredentialModal, setShowCredentialModal] = useState(false);

  if (!player) return null;

  // Associated guardians
  const myRelations = relations.filter((r) => r.jugadorId === player.id);
  const myGuardians = myRelations.map((rel) => ({
    ...rel,
    guardian: guardians.find((g) => g.id === rel.tutorId),
  }));

  // History of categories
  const myCatHistory = categoryHistory.filter((h) => h.jugadorId === player.id);

  // Attendance calculation
  const myAttendance = attendanceRecords.filter((a) => a.jugadorId === player.id);
  const presentCount = myAttendance.filter((a) => a.estado === 'PRESENTE').length;
  const attendanceRate =
    myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 100;

  // Financial status
  const myCharges = charges.filter((c) => c.jugadorId === player.id);
  const myPayments = payments.filter((p) => p.jugadorId === player.id);
  const pendingCharges = myCharges.filter(
    (c) => c.estado === 'PENDIENTE' || c.estado === 'VENCIDO'
  );
  const totalDue = pendingCharges.reduce((acc, c) => acc + (c.montoFinal - c.montoPagado), 0);

  // Uniform orders
  const myUniformOrders = uniformOrders.filter((o) => o.jugadorId === player.id);

  // Performance evaluations
  const myEvaluation = evaluations.find((e) => e.jugadorId === player.id);

  const handleApplyCategoryChange = () => {
    if (newCatId && categoryChangeReason.trim()) {
      onChangeCategory(player.id, newCatId, categoryChangeReason.trim());
      setShowCategoryChangeForm(false);
      setCategoryChangeReason('');
    }
  };

  const canEdit = currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#111111] via-[#1b253b] to-[#3B59A8] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {player.fotoUrl ? (
              <div className="relative shrink-0">
                <img
                  src={player.fotoUrl}
                  alt={player.nombre}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/80 shadow-md bg-white"
                />
                {player.numeroCamiseta && (
                  <span className="absolute -bottom-1 -right-1 bg-[#E31B23] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                    #{player.numeroCamiseta}
                  </span>
                )}
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white font-black text-xl flex items-center justify-center shrink-0">
                {player.numeroCamiseta ? `#${player.numeroCamiseta}` : player.nombre[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-extrabold text-white">
                  {player.nombre} {player.apellidoPaterno} {player.apellidoMaterno || ''}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    player.estatus === 'ACTIVO'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {player.estatus}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200 mt-1">
                <span className="font-mono text-blue-200 font-bold">{player.identificador}</span>
                <span>·</span>
                <span>{player.categoriaActualNombre}</span>
                <span>·</span>
                <span>{player.posicionHabitual}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-1 overflow-x-auto shrink-0">
          {[
            { id: 'general', label: 'Datos Generales & Médicos', icon: User },
            { id: 'categoria', label: 'Categoría & Historial', icon: Layers },
            { id: 'asistencia', label: 'Asistencia Deportiva', icon: CalendarCheck },
            { id: 'finanzas', label: 'Estado de Cuenta & Pagos', icon: CreditCard },
            { id: 'uniformes', label: 'Uniformes & Prendas', icon: Shirt },
            { id: 'rendimiento', label: 'Reporte de Rendimiento', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: GENERAL & SALUD */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Player Profile */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-[#3B59A8]" />
                      <span>Ficha Personal del Alumno</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCredentialModal(true)}
                      className="text-[11px] font-bold text-white bg-[#3B59A8] hover:bg-[#162963] px-3 py-1 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-md"
                      title="Ver e Imprimir Credencial Oficial del Alumno"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
                      <span>Credencial Oficial</span>
                    </button>
                  </div>

                  {/* Child photo card if available */}
                  {player.fotoUrl && (
                    <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={player.fotoUrl}
                          alt={`Foto de ${player.nombre}`}
                          className="w-14 h-14 rounded-xl object-cover border border-[#3B59A8]/30 shadow-xs shrink-0"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 block">Fotografía del Alumno</span>
                          <span className="text-[11px] text-slate-500 block">
                            Documento de identidad deportiva validado
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCredentialModal(true)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#3B59A8] rounded-xl text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                        title="Ver Credencial Oficial"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Ver Credencial</span>
                      </button>
                    </div>
                  )}

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Fecha de Nacimiento:</span>
                      <span className="font-semibold text-slate-800">{player.fechaNacimiento}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Sexo Registrado:</span>
                      <span className="font-semibold text-slate-800">{player.sexo}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Número de Camiseta:</span>
                      <span className="font-bold text-[#3B59A8]">
                        {player.numeroCamiseta ? `#${player.numeroCamiseta}` : 'Sin asignar'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Fecha de Ingreso:</span>
                      <span className="font-semibold text-slate-800">{player.fechaIngreso}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Teléfono Contacto:</span>
                      <span className="font-semibold text-slate-800">
                        {player.telefonoContacto || 'No capturado'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Medical & Allergies */}
                <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-200/60 space-y-3">
                  <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-600" />
                    <span>Salud & Cuidados Médicos</span>
                  </h3>

                  <div className="p-3 bg-white rounded-xl border border-rose-100 text-xs text-slate-700">
                    <span className="font-bold block text-slate-900 mb-1">
                      Alergias / Padecimientos:
                    </span>
                    <p>{player.alergiasMedicas || 'Sin alergias ni restricciones médicas registradas.'}</p>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    En caso de emergencia en campo, se notificará al contacto principal y se aplicará el protocolo de primeros auxilios.
                  </p>
                </div>
              </div>

              {/* Guardians List (HU-011) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Padres y Tutores Vinculados</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myGuardians.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.guardian?.nombre} {item.guardian?.apellidoPaterno}
                        </span>
                        {item.esContactoPrincipal && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                            Principal
                          </span>
                        )}
                      </div>

                      <div className="text-slate-600">
                        <span className="font-medium text-slate-500">Parentesco: </span>
                        <span>{item.parentesco}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.guardian?.telefono || 'Sin teléfono'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.guardian?.email || 'Sin correo'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIA & HISTORIAL (HU-019) */}
          {activeTab === 'categoria' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                    Categoría Vigente
                  </span>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {player.categoriaActualNombre}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Entrenamientos regulares en los días y horarios asignados a este grupo.
                  </p>
                </div>

                {canEdit && (
                  <button
                    onClick={() => setShowCategoryChangeForm(!showCategoryChangeForm)}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    Promover / Cambiar Categoría
                  </button>
                )}
              </div>

              {/* Form Change Category (HU-019) */}
              {showCategoryChangeForm && (
                <div className="p-5 bg-white rounded-2xl border-2 border-emerald-400/50 shadow-md space-y-4 animate-scaleUp">
                  <h4 className="font-bold text-sm text-slate-900">
                    Cambio de Categoría con Registro Histórico
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Nueva Categoría Destino:
                      </label>
                      <select
                        value={newCatId}
                        onChange={(e) => setNewCatId(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre} ({c.edadMinima} a {c.edadMaxima} años)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Motivo del cambio:
                      </label>
                      <input
                        type="text"
                        value={categoryChangeReason}
                        onChange={(e) => setCategoryChangeReason(e.target.value)}
                        placeholder="Ej. Cumplió edad reglamentaria, evaluación destacada..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowCategoryChangeForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={!categoryChangeReason.trim()}
                      onClick={handleApplyCategoryChange}
                      className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs"
                    >
                      Guardar y Actualizar
                    </button>
                  </div>
                </div>
              )}

              {/* History Timeline */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Historial de Categorías (HU-019)</span>
                </h4>

                {myCatHistory.length > 0 ? (
                  <div className="space-y-3">
                    {myCatHistory.map((hist) => (
                      <div
                        key={hist.id}
                        className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs flex items-start justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">
                              {hist.categoriaAnteriorNombre}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-bold text-emerald-700">
                              {hist.categoriaNuevaNombre}
                            </span>
                          </div>
                          <p className="text-slate-500 italic">"{hist.motivo}"</p>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {hist.fechaCambio}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Sin cambios previos de categoría. Permanece en su grupo de ingreso.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ASISTENCIA */}
          {activeTab === 'asistencia' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-xs font-bold text-emerald-800 uppercase block">
                    Porcentaje de Asistencia
                  </span>
                  <span className="text-3xl font-extrabold text-emerald-700 tabular-nums">
                    {attendanceRate}%
                  </span>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                  <span className="text-xs font-bold text-blue-800 uppercase block">
                    Entrenamientos Asistidos
                  </span>
                  <span className="text-3xl font-extrabold text-blue-700 tabular-nums">
                    {presentCount}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase block">
                    Sesiones Evaluadas
                  </span>
                  <span className="text-3xl font-extrabold text-slate-800 tabular-nums">
                    {myAttendance.length}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
                  Bitácora de Sesiones
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {myAttendance.map((rec) => (
                    <div key={rec.id} className="p-3.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          Sesión de Entrenamiento #{rec.sesionId}
                        </span>
                        {rec.observacion && (
                          <span className="text-slate-500 text-[11px] italic">
                            Nota: {rec.observacion}
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                          rec.estado === 'PRESENTE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.estado === 'JUSTIFICADO'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.estado}
                      </span>
                    </div>
                  ))}
                  {myAttendance.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                      Sin registros de asistencia registrados para este alumno.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINANZAS & ESTADO DE CUENTA (HU-046) */}
          {activeTab === 'finanzas' && (
            <div className="space-y-6">
              {/* Financial Summary */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                    Saldo Total Pendiente
                  </span>
                  <div className="text-2xl font-black text-white tabular-nums mt-0.5">
                    ${totalDue.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-400">
                    {pendingCharges.length} cargos por liquidar
                  </span>
                </div>

                {pendingCharges.length > 0 && (
                  <button
                    onClick={() => onOpenPaymentGateway(pendingCharges[0].id)}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pagar en Línea con 1 Clic</span>
                  </button>
                )}
              </div>

              {/* Charges List */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
                  Historial de Mensualidades & Cargos
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {myCharges.map((charge) => (
                    <div key={charge.id} className="p-3.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {charge.conceptoNombre}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Vence: {charge.fechaVencimiento} {charge.periodo ? `· ${charge.periodo}` : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          ${charge.montoFinal}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            charge.estado === 'PAGADO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : charge.estado === 'VENCIDO'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {charge.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: UNIFORMES */}
          {activeTab === 'uniformes' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Shirt className="w-4 h-4 text-emerald-600" />
                <span>Prendas y Solicitudes de Uniforme (HU-053)</span>
              </h4>

              <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 text-xs">
                {myUniformOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">
                        {order.productoNombre}
                      </span>
                      <div className="text-slate-500 text-xs mt-0.5">
                        Talla: <span className="font-bold text-slate-800">{order.talla}</span> ·
                        Cantidad: <span className="font-bold text-slate-800">{order.cantidad}</span>
                      </div>
                      {order.recibidoPor && (
                        <div className="text-[11px] text-emerald-700 mt-1">
                          Entregado a: {order.recibidoPor} ({order.fechaEntrega})
                        </div>
                      )}
                    </div>

                    <div className="text-right space-y-1">
                      <span className="font-mono font-bold text-slate-900 block tabular-nums text-sm">
                        ${order.montoTotal}
                      </span>
                      <span
                        className={`inline-block font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          order.estado === 'ENTREGADO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.estado === 'PAGADO'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.estado}
                      </span>
                    </div>
                  </div>
                ))}
                {myUniformOrders.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    No hay solicitudes de uniforme registradas para este alumno.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: RENDIMIENTO & RADAR */}
          {activeTab === 'rendimiento' && (
            <div className="space-y-6">
              {myEvaluation ? (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                        {myEvaluation.periodo}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                        Evaluación Técnica de {player.nombre}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Evaluador: {myEvaluation.evaluadorNombre} ({myEvaluation.fecha})
                      </p>
                    </div>

                    {myEvaluation.destacadoSemana && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span>¡Alumno Destacado de la Semana!</span>
                      </span>
                    )}
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Control de Balón', score: myEvaluation.controlBalon },
                      { label: 'Pase y Visión', score: myEvaluation.pase },
                      { label: 'Tiro y Definición', score: myEvaluation.tiroDefinicion },
                      { label: 'Velocidad / Agilidad', score: myEvaluation.velocidadAgilidad },
                      { label: 'Resistencia Física', score: myEvaluation.resistencia },
                      { label: 'Táctica / Posición', score: myEvaluation.posicionamientoTactico },
                      { label: 'Disciplina y Puntualidad', score: myEvaluation.disciplinaCompromiso },
                      { label: 'Trabajo en Equipo', score: myEvaluation.trabajoEnEquipo },
                    ].map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3.5 bg-white rounded-xl border border-slate-200 text-center space-y-1"
                      >
                        <span className="text-[11px] font-semibold text-slate-600 block truncate">
                          {skill.label}
                        </span>
                        <span className="text-2xl font-black text-emerald-600 tabular-nums">
                          {skill.score}/10
                        </span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${skill.score * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coach Written Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/70 space-y-1">
                      <span className="font-bold text-emerald-900 block">
                        Fortalezas y Aspectos Destacados:
                      </span>
                      <p className="text-slate-700">{myEvaluation.comentariosFortalezas}</p>
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/70 space-y-1">
                      <span className="font-bold text-blue-900 block">
                        Áreas de Mejora para las Próximas Sesiones:
                      </span>
                      <p className="text-slate-700">{myEvaluation.areasDeMejora}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                  Aún no se ha cargado una evaluación para este periodo.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>

      {/* Official Credential Modal */}
      {showCredentialModal && (
        <StudentCredentialModal
          player={player}
          onClose={() => setShowCredentialModal(false)}
          guardians={guardians}
          relations={relations}
          categories={categories}
        />
      )}
    </div>
  );
};
