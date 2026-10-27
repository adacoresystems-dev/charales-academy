import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Plus,
  Users,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Notice, DirectMessage, User, Category, Player, Role } from '../../types';

interface CommunicationViewProps {
  notices: Notice[];
  messages: DirectMessage[];
  currentUser: User;
  users: User[];
  categories: Category[];
  players: Player[];
  onSendMessage: (destinatarioId: number, jugadorId: number, contenido: string) => void;
  onPublishNotice: (
    noticeData: Omit<Notice, 'id' | 'creadoPorNombre' | 'fechaPublicacion' | 'activo'>
  ) => void;
}

export const CommunicationView: React.FC<CommunicationViewProps> = ({
  notices,
  messages,
  currentUser,
  users,
  categories,
  players,
  onSendMessage,
  onPublishNotice,
}) => {
  const [activeTab, setActiveTab] = useState<'avisos' | 'chat'>('avisos');

  // Notice form
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'GENERAL' | 'CATEGORIA'>('GENERAL');
  const [selectedNoticeCatId, setSelectedNoticeCatId] = useState<number>(categories[0]?.id || 1);
  const [noticeImportant, setNoticeImportant] = useState(false);

  // Chat conversation state
  const isParent = currentUser.rol === 'PADRE_TUTOR';
  const isCoach = currentUser.rol === 'ENTRENADOR';

  // Target chat partner
  const defaultRecipient = isParent
    ? users.find((u) => u.rol === 'ENTRENADOR') || users[2]
    : users.find((u) => u.rol === 'PADRE_TUTOR') || users[3];

  const [activeChatRecipientId, setActiveChatRecipientId] = useState<number>(
    defaultRecipient?.id || 3
  );
  const [chatMessageText, setChatMessageText] = useState('');

  const currentRecipient = users.find((u) => u.id === activeChatRecipientId) || defaultRecipient;

  // Filter messages between currentUser and activeRecipient
  const conversationMessages = messages.filter(
    (m) =>
      (m.remitenteId === currentUser.id && m.destinatarioId === activeChatRecipientId) ||
      (m.remitenteId === activeChatRecipientId && m.destinatarioId === currentUser.id)
  );

  const canPublishNotices =
    currentUser.rol === 'ADMINISTRADOR' ||
    currentUser.rol === 'SECRETARIA' ||
    currentUser.rol === 'ENTRENADOR';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    onSendMessage(activeChatRecipientId, 1, chatMessageText.trim());
    setChatMessageText('');
  };

  const handlePublishNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;

    onPublishNotice({
      titulo: noticeTitle.trim(),
      mensaje: noticeMessage.trim(),
      tipoAudiencia: noticeAudience,
      categoriaIds: noticeAudience === 'CATEGORIA' ? [selectedNoticeCatId] : undefined,
      importante: noticeImportant,
    });

    setShowNoticeModal(false);
    setNoticeTitle('');
    setNoticeMessage('');
  };

  const quickReplies = [
    'Confirmada la asistencia para este sábado.',
    '¿Cuál uniforme llevamos al partido?',
    'Muchas gracias por el informe profe.',
    'Por favor avíseme si requiere hidratación adicional.',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Comunicación Oficial y Mensajería Directa
          </h1>
          <p className="text-xs text-slate-500">
            Muro de avisos escolares y canal directo entre entrenadores y padres de familia (EP09)
          </p>
        </div>

        {canPublishNotices && activeTab === 'avisos' && (
          <button
            onClick={() => setShowNoticeModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#3B59A8] hover:bg-[#2F4788] text-white rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Nuevo Aviso</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('avisos')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'avisos'
              ? 'border-[#3B59A8] text-[#3B59A8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Tablón de Avisos Oficiales ({notices.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'chat'
              ? 'border-[#3B59A8] text-[#3B59A8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat Directo Entrenador - Padres</span>
        </button>
      </div>

      {/* TAB 1: NOTICES BOARD (HU-057, HU-058, HU-059) */}
      {activeTab === 'avisos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-6 rounded-2xl border transition-all space-y-3 ${
                notice.importante
                  ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                  : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {notice.importante && (
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                      <AlertCircle className="w-4 h-4" />
                    </span>
                  )}
                  <h3 className="text-base font-bold text-slate-900">{notice.titulo}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                  {notice.fechaPublicacion}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{notice.mensaje}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Por: {notice.creadoPorNombre}</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Audiencia: {notice.tipoAudiencia}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: DIRECT CHAT BETWEEN COACH & PARENTS */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row h-[550px]">
          {/* Conversation Selector Sidebar */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Conversaciones Activas
            </span>

            {users
              .filter((u) => u.id !== currentUser.id)
              .map((u) => {
                const isSelected = u.id === activeChatRecipientId;
                return (
                  <button
                    key={u.id}
                    onClick={() => setActiveChatRecipientId(u.id)}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'hover:bg-slate-200/60 text-slate-600'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {u.nombre[0]}
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-xs block text-slate-900 truncate">
                        {u.nombre}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {u.rol === 'ENTRENADOR'
                          ? 'Entrenador Sub-10'
                          : u.rol === 'PADRE_TUTOR'
                          ? 'Padre de Leo Usuario'
                          : u.rol}
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Active Chat Thread Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EEF2FA] text-[#3B59A8] font-bold flex items-center justify-center text-xs">
                  {currentRecipient?.nombre[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">
                    {currentRecipient?.nombre}
                  </h3>
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Conectado para atención</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {conversationMessages.map((msg) => {
                const isMe = msg.remitenteId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-slate-900 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                      }`}
                    >
                      <span className="block font-bold text-[10px] opacity-70 mb-0.5">
                        {isMe ? 'Tú' : msg.remitenteNombre}
                      </span>
                      <p>{msg.contenido}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.fechaHora}
                    </span>
                  </div>
                );
              })}

              {conversationMessages.length === 0 && (
                <div className="p-12 text-center text-xs text-slate-400">
                  No hay mensajes previos en esta conversación. Escribe el primer mensaje abajo.
                </div>
              )}
            </div>

            {/* Quick Replies Bar */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">Atajos:</span>
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => setChatMessageText(qr)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-slate-600 whitespace-nowrap transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={chatMessageText}
                onChange={(e) => setChatMessageText(e.target.value)}
                placeholder="Escribe un mensaje para el entrenador o tutor..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
              />
              <button
                type="submit"
                disabled={!chatMessageText.trim()}
                className="p-2.5 bg-[#3B59A8] hover:bg-[#2F4788] disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publish Notice (HU-057) */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="font-bold text-base text-slate-900">Publicar Aviso Oficial (HU-057)</h3>

            <form onSubmit={handlePublishNoticeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título del Aviso:</label>
                <input
                  required
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Ej. Convocatoria Jornada 5, Entrega de Uniformes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mensaje:</label>
                <textarea
                  required
                  rows={3}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="Escribe el comunicado para las familias..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Audiencia:</label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  >
                    <option value="GENERAL">Toda la Escuela</option>
                    <option value="CATEGORIA">Categoría Específica</option>
                  </select>
                </div>

                {noticeAudience === 'CATEGORIA' && (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Categoría:</label>
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
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-notice-imp"
                  checked={noticeImportant}
                  onChange={(e) => setNoticeImportant(e.target.checked)}
                  className="rounded text-[#E31B23] focus:ring-[#E31B23]"
                />
                <label
                  htmlFor="chk-notice-imp"
                  className="font-semibold text-slate-700 cursor-pointer"
                >
                  Marcar como aviso urgente / prioritario
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B59A8] hover:bg-[#2F4788] text-white font-bold rounded-xl shadow-xs"
                >
                  Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
