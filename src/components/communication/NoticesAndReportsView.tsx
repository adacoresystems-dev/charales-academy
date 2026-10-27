import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Plus,
  Send,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter,
  BarChart3,
  DollarSign,
  Award,
  Sparkles,
  FileText,
  Search,
} from 'lucide-react';
import {
  Notice,
  DirectMessage,
  User,
  Category,
  Player,
  PerformanceEvaluation,
  Charge,
  Payment,
  AttendanceRecord,
  AuditLog,
  Role,
} from '../../types';

interface NoticesAndReportsViewProps {
  notices: Notice[];
  messages: DirectMessage[];
  currentUser: User;
  users: User[];
  categories: Category[];
  players: Player[];
  evaluations: PerformanceEvaluation[];
  charges: Charge[];
  payments: Payment[];
  attendance: AttendanceRecord[];
  auditLogs: AuditLog[];
  currentRole: Role;
  onSendMessage: (destinatarioId: number, jugadorId: number, contenido: string) => void;
  onPublishNotice: (
    noticeData: Omit<Notice, 'id' | 'creadoPorNombre' | 'fechaPublicacion' | 'activo'>
  ) => void;
  onSaveEvaluation?: (
    evaluationData: Omit<PerformanceEvaluation, 'id' | 'evaluadorNombre' | 'fechaEvaluacion'>
  ) => void;
}

export const NoticesAndReportsView: React.FC<NoticesAndReportsViewProps> = ({
  notices,
  messages,
  currentUser,
  users,
  categories,
  players,
  evaluations,
  charges,
  payments,
  attendance,
  auditLogs,
  currentRole,
  onSendMessage,
  onPublishNotice,
  onSaveEvaluation,
}) => {
  const [activeTab, setActiveTab] = useState<'avisos' | 'reportes' | 'chat'>('avisos');

  // Notice form
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'GENERAL' | 'CATEGORIA'>('GENERAL');
  const [selectedNoticeCatId, setSelectedNoticeCatId] = useState<number>(categories[0]?.id || 1);
  const [noticeImportant, setNoticeImportant] = useState(false);

  // Reports sub-tab
  const [reportSubTab, setReportSubTab] = useState<'deportivo' | 'financiero' | 'asistencia' | 'auditoria'>('deportivo');
  const [selectedReportPlayerId, setSelectedReportPlayerId] = useState<number>(players[0]?.id || 1);

  // Chat conversation state
  const isParent = currentUser.rol === 'PADRE_TUTOR';
  const defaultRecipient = isParent
    ? users.find((u) => u.rol === 'ENTRENADOR') || users[2]
    : users.find((u) => u.rol === 'PADRE_TUTOR') || users[3];

  const [activeChatRecipientId, setActiveChatRecipientId] = useState<number>(
    defaultRecipient?.id || 3
  );
  const [chatMessageText, setChatMessageText] = useState('');

  const canPublish = currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA' || currentRole === 'ENTRENADOR';

  const handleCreateNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;

    onPublishNotice({
      titulo: noticeTitle.trim(),
      mensaje: noticeMessage.trim(),
      tipoAudiencia: noticeAudience === 'CATEGORIA' ? 'CATEGORIA' : 'GENERAL',
      categoriaIds: noticeAudience === 'CATEGORIA' ? [selectedNoticeCatId] : undefined,
      importante: noticeImportant,
    });

    setNoticeTitle('');
    setNoticeMessage('');
    setShowNoticeModal(false);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    const dummyPlayerId = players[0]?.id || 1;
    onSendMessage(activeChatRecipientId, dummyPlayerId, chatMessageText.trim());
    setChatMessageText('');
  };

  // Chat messages between current user and active recipient
  const activeConversation = messages.filter(
    (m) =>
      (m.remitenteId === currentUser.id && m.destinatarioId === activeChatRecipientId) ||
      (m.remitenteId === activeChatRecipientId && m.destinatarioId === currentUser.id)
  );

  const targetChatUser = users.find((u) => u.id === activeChatRecipientId);

  // Selected player evaluation data
  const selectedEvalPlayer = players.find((p) => p.id === selectedReportPlayerId) || players[0];
  const playerEvals = evaluations.filter((ev) => ev.jugadorId === selectedReportPlayerId);
  const latestEval = playerEvals[playerEvals.length - 1];

  // Financial summary
  const totalCobrado = payments
    .filter((p) => p.estado === 'APLICADO')
    .reduce((sum, p) => sum + p.importe, 0);
  const totalPendiente = charges
    .filter((c) => c.estado === 'PENDIENTE' || c.estado === 'VENCIDO')
    .reduce((sum, c) => sum + (c.montoFinal - c.montoPagado), 0);
  const totalMorosos = charges.filter((c) => c.estado === 'VENCIDO').length;

  // Attendance summary
  const totalAsistencias = attendance.filter((a) => a.estado === 'PRESENTE').length;
  const totalFaltas = attendance.filter((a) => a.estado === 'AUSENTE').length;
  const porcentajeAsistencia = attendance.length > 0
    ? Math.round((totalAsistencias / attendance.length) * 100)
    : 85;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Avisos y Reportes
          </h1>
          <p className="text-xs text-slate-500">
            Comunicados oficiales, bitácora de mensajes, evaluaciones deportivas e informes de gestión
          </p>
        </div>

        {activeTab === 'avisos' && canPublish && (
          <button
            onClick={() => setShowNoticeModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Comunicado</span>
          </button>
        )}
      </div>

      {/* Main Tabs: Avisos vs Reportes vs Chat */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('avisos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'avisos'
              ? 'bg-[#3B59A8] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Avisos del Club ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reportes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reportes'
              ? 'bg-[#3B59A8] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Reportes & Estadísticas</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'chat'
              ? 'bg-[#3B59A8] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat con Familias ({messages.length})</span>
        </button>
      </div>

      {/* TAB 1: AVISOS OFICIALES */}
      {activeTab === 'avisos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.map((n) => {
            const cat = n.categoriaIds && n.categoriaIds.length > 0
              ? categories.find((c) => c.id === n.categoriaIds![0])
              : undefined;
            return (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition-all ${
                  n.importante
                    ? 'bg-amber-50/60 border-amber-200 shadow-xs'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-2 rounded-xl ${
                        n.importante ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-[#3B59A8]'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{n.titulo}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Publicado el {n.fechaPublicacion} por {n.creadoPorNombre}
                      </span>
                    </div>
                  </div>

                  {n.importante && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700">
                      Urgente
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 mt-3 whitespace-pre-line leading-relaxed">
                  {n.mensaje}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-600">
                    Audiencia: {cat ? `Categoría ${cat.nombre}` : 'Toda la Escuela (General)'}
                  </span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-md font-bold text-slate-600 text-[10px]">
                    Oficial
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: REPORTES & ESTADÍSTICAS */}
      {activeTab === 'reportes' && (
        <div className="space-y-5">
          {/* Sub-navigation for reports */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setReportSubTab('deportivo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reportSubTab === 'deportivo' ? 'bg-[#3B59A8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rendimiento Deportivo
            </button>
            <button
              onClick={() => setReportSubTab('asistencia')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reportSubTab === 'asistencia' ? 'bg-[#3B59A8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Asistencias
            </button>
            <button
              onClick={() => setReportSubTab('financiero')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reportSubTab === 'financiero' ? 'bg-[#3B59A8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cobranza & Morosidad
            </button>
            <button
              onClick={() => setReportSubTab('auditoria')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reportSubTab === 'auditoria' ? 'bg-[#3B59A8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Seguridad & Auditoría
            </button>
          </div>

          {/* Deportivo */}
          {reportSubTab === 'deportivo' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Seleccionar Alumno</h3>
                <div className="max-h-96 overflow-y-auto space-y-1 divide-y divide-slate-100">
                  {players.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedReportPlayerId(p.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                        selectedReportPlayerId === p.id
                          ? 'bg-[#3B59A8] text-white font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>⚽ {p.nombre} {p.apellidoPaterno}</span>
                      <span className="text-[10px] opacity-80">{p.categoriaActualNombre}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Evaluación Técnica: {selectedEvalPlayer.nombre} {selectedEvalPlayer.apellidoPaterno}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Folio {selectedEvalPlayer.identificador} · Categoría {selectedEvalPlayer.categoriaActualNombre}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#3B59A8]">
                    {latestEval ? `Fecha: ${latestEval.fecha}` : 'Ciclo 2026'}
                  </span>
                </div>

                {latestEval ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>Control de Balón & Pase</span>
                          <span className="text-[#3B59A8]">{latestEval.controlBalon}/10</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#3B59A8] h-full rounded-full transition-all"
                            style={{ width: `${latestEval.controlBalon * 10}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>Posicionamiento Táctico & Visión</span>
                          <span className="text-[#3B59A8]">{latestEval.posicionamientoTactico}/10</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#2D4EA2] h-full rounded-full transition-all"
                            style={{ width: `${latestEval.posicionamientoTactico * 10}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>Velocidad & Agilidad</span>
                          <span className="text-[#3B59A8]">{latestEval.velocidadAgilidad}/10</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all"
                            style={{ width: `${latestEval.velocidadAgilidad * 10}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>Disciplina, Actitud & Trabajo en Equipo</span>
                          <span className="text-[#3B59A8]">{latestEval.disciplinaCompromiso}/10</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full transition-all"
                            style={{ width: `${latestEval.disciplinaCompromiso * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-800">Fortalezas del Alumno:</span>
                      <p className="text-slate-600 italic">
                        "{latestEval.comentariosFortalezas || 'Demuestra gran compromiso en los entrenamientos y excelente compañerismo.'}"
                      </p>
                      {latestEval.areasDeMejora && (
                        <p className="text-slate-500 text-[11px] pt-1">
                          <strong className="text-slate-700">Áreas de mejora:</strong> {latestEval.areasDeMejora}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 pt-1">
                        Evaluado por: {latestEval.evaluadorNombre}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No se registran evaluaciones recientes para este alumno.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Asistencias */}
          {reportSubTab === 'asistencia' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Tasa Global de Asistencia</span>
                  <p className="text-3xl font-black text-emerald-600 mt-2">{porcentajeAsistencia}%</p>
                  <span className="text-[11px] text-slate-400">Excelente promedio formativo</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Total Asistencias Registradas</span>
                  <p className="text-3xl font-black text-[#3B59A8] mt-2">{totalAsistencias}</p>
                  <span className="text-[11px] text-slate-400">Pases de lista en cancha</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Faltas Registradas</span>
                  <p className="text-3xl font-black text-rose-600 mt-2">{totalFaltas}</p>
                  <span className="text-[11px] text-slate-400">Faltas justificadas / médicas</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Últimos Registros de Pase de Lista</h3>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {attendance.slice(0, 15).map((rec) => (
                    <div key={rec.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{rec.jugadorNombre}</span>
                        {rec.observacion && (
                          <span className="text-[11px] text-slate-400">({rec.observacion})</span>
                        )}
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                </div>
              </div>
            </div>
          )}

          {/* Financiero */}
          {reportSubTab === 'financiero' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Ingresos Cobrados</span>
                  <p className="text-3xl font-black text-emerald-600 mt-2">
                    ${totalCobrado.toLocaleString('es-MX')} MXN
                  </p>
                  <span className="text-[11px] text-slate-400">Ciclo Apertura 2026</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Saldo Pendiente</span>
                  <p className="text-3xl font-black text-amber-600 mt-2">
                    ${totalPendiente.toLocaleString('es-MX')} MXN
                  </p>
                  <span className="text-[11px] text-slate-400">Mensualidades en curso</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Cargos Vencidos</span>
                  <p className="text-3xl font-black text-rose-600 mt-2">{totalMorosos}</p>
                  <span className="text-[11px] text-rose-600 font-bold">Requieren cobranza</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Resumen de Cobranza por Cargo</h3>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {charges.slice(0, 15).map((ch) => (
                    <div key={ch.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{ch.jugadorNombre}</p>
                        <span className="text-[11px] text-slate-400">{ch.conceptoNombre} · {ch.periodo}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">${ch.montoFinal} MXN</p>
                        <span
                          className={`text-[10px] font-bold ${
                            ch.estado === 'PAGADO' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {ch.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Auditoria */}
          {reportSubTab === 'auditoria' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Bitácora Oficial de Auditoría & Trazabilidad</h3>
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 text-xs">
                {auditLogs.slice(0, 25).map((log) => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.accion}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-slate-100 text-slate-600">
                          {log.entidad}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{log.detalles}</p>
                      <span className="text-[10px] text-slate-400">Por {log.usuarioNombre} ({log.usuarioRol})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.fechaHora}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CHAT FAMILIAS */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[550px]">
          {/* Conversation list */}
          <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50 p-3 overflow-y-auto space-y-1 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Conversaciones</span>
            {users
              .filter((u) => u.id !== currentUser.id)
              .map((u) => {
                const isActive = activeChatRecipientId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setActiveChatRecipientId(u.id)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs ${
                      isActive ? 'bg-[#3B59A8] text-white font-bold' : 'hover:bg-slate-200/60 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isActive ? 'bg-white text-[#3B59A8]' : 'bg-blue-100 text-[#3B59A8]'
                      }`}
                    >
                      {u.nombre.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="truncate font-semibold">{u.nombre}</p>
                      <span className="text-[10px] opacity-75">{u.rol}</span>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Active conversation thread */}
          <div className="flex-1 flex flex-col h-full bg-white">
            <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  {targetChatUser ? targetChatUser.nombre : 'Usuario'}
                </h4>
                <span className="text-[10px] text-slate-500">{targetChatUser?.rol} · Escuela Charales</span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
              {activeConversation.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  Inicia una conversación directa y segura con {targetChatUser?.nombre}.
                </div>
              ) : (
                activeConversation.map((msg) => {
                  const isMine = msg.remitenteId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-3.5 py-2 rounded-2xl ${
                          isMine
                            ? 'bg-[#3B59A8] text-white rounded-br-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        <p>{msg.contenido}</p>
                      </div>
                      <span className="text-[9.5px] text-slate-400 mt-1 px-1">{msg.fechaHora}</span>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatMessageText}
                onChange={(e) => setChatMessageText(e.target.value)}
                placeholder="Escribe un mensaje oficial..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
              />
              <button
                type="submit"
                className="p-2 bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notice Create Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Publicar Aviso Oficial</h3>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNoticeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título del Comunicado:</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Ej. Convocatoria Torneo de Primavera 2026..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Audiencia:</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      checked={noticeAudience === 'GENERAL'}
                      onChange={() => setNoticeAudience('GENERAL')}
                    />
                    <span>General (Toda la Escuela)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      checked={noticeAudience === 'CATEGORIA'}
                      onChange={() => setNoticeAudience('CATEGORIA')}
                    />
                    <span>Por Categoría Específica</span>
                  </label>
                </div>
              </div>

              {noticeAudience === 'CATEGORIA' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría Destino:</label>
                  <select
                    value={selectedNoticeCatId}
                    onChange={(e) => setSelectedNoticeCatId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mensaje Completo:</label>
                <textarea
                  required
                  rows={4}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="Escriba aquí los detalles, horarios, requisitos o avisos importantes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={noticeImportant}
                  onChange={(e) => setNoticeImportant(e.target.checked)}
                  className="rounded text-[#3B59A8]"
                />
                <label htmlFor="urgent" className="text-slate-700 font-semibold cursor-pointer">
                  Marcar como Urgente / Destacado
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl shadow-xs"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesAndReportsView;
