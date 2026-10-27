import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Check, 
  Filter, 
  AlertCircle, 
  Megaphone, 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { NotificationItem, Coach } from './types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  coach: Coach;
  selectedCategory: string;
  onMarkAsRead: (id: string) => void;
  onSendNotification: (newNotif: NotificationItem) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  coach,
  selectedCategory,
  onMarkAsRead,
  onSendNotification
}) => {
  const [filterType, setFilterType] = useState<string>('todos');
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Compose form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationItem['type']>('convocatoria');
  const [targetRole, setTargetRole] = useState<NotificationItem['targetRole']>('Tutor/Jugador');
  const [successToast, setSuccessToast] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      category: selectedCategory,
      read: true,
      sender: coach.name,
      targetRole
    };

    onSendNotification(notif);
    setShowComposeModal(false);
    setTitle('');
    setMessage('');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const filtered = notifications.filter(n => {
    if (filterType === 'todos') return true;
    if (filterType === 'no-leidos') return !n.read;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-50 text-[#E31B23] rounded-lg">
              <Bell className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-[#111111]">
                Sistema de Notificaciones y Avisos Deportivos
              </h1>
              <p className="text-xs text-neutral-500">
                HU-060 · Comunicados oficiales del club y avisos directos a padres de familia y jugadores.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowComposeModal(true)}
          className="px-4 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>Redactar Nuevo Aviso</span>
        </button>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ¡Notificación enviada a los tutores y jugadores de {selectedCategory}!
        </div>
      )}

      {/* Filter Chips Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-neutral-500 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </span>
        {[
          { id: 'todos', label: 'Todos los Avisos' },
          { id: 'no-leidos', label: 'No Leídos' },
          { id: 'convocatoria', label: 'Convocatorias' },
          { id: 'asistencia', label: 'Asistencia y Justificantes' },
          { id: 'aviso', label: 'Avisos Generales' },
          { id: 'torneo', label: 'Torneos' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === f.id
                ? 'bg-[#3B59A8] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 text-xs text-neutral-500">
            No se encontraron notificaciones con este filtro.
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all ${
                !notif.read
                  ? 'bg-blue-50/60 border-[#3B59A8]/40 shadow-xs'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'convocatoria' 
                      ? 'bg-red-100 text-[#E31B23]' 
                      : notif.type === 'asistencia'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-[#3B59A8]'
                  }`}>
                    <Megaphone className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        notif.type === 'convocatoria' 
                          ? 'bg-[#E31B23] text-white' 
                          : notif.type === 'asistencia'
                            ? 'bg-amber-500 text-white'
                            : 'bg-[#3B59A8] text-white'
                      }`}>
                        {notif.type}
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-500">
                        Destino: {notif.targetRole}
                      </span>
                      {notif.category && (
                        <span className="text-[11px] text-neutral-400">· {notif.category}</span>
                      )}
                    </div>

                    <h3 className="text-sm font-extrabold text-[#111111] mt-1.5">
                      {notif.title}
                    </h3>
                    <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-[11px] text-neutral-400">
                      <span>De: <strong className="text-neutral-700">{notif.sender}</strong></span>
                      <span>·</span>
                      <span className="font-mono">{notif.date}</span>
                    </div>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    className="self-start sm:self-center px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Marcar como leído</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose Notification Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
            <h3 className="text-base font-extrabold text-[#111111] mb-1">
              Redactar Aviso / Notificación a Jugadores y Tutores
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              La notificación se enviará al portal y buzón de los tutores de la categoría {selectedCategory}.
            </p>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Tipo de Notificación</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none"
                  >
                    <option value="convocatoria">Convocatoria a Partido</option>
                    <option value="aviso">Aviso General</option>
                    <option value="asistencia">Asistencia / Justificante</option>
                    <option value="torneo">Resultado de Torneo</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Destinatarios</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full p-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none"
                  >
                    <option value="Tutor/Jugador">Padres de Familia y Jugadores</option>
                    <option value="Entrenador">Cuerpo Técnico</option>
                    <option value="Todos">Toda la Comunidad Charales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">Título del Mensaje *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Convocatoria Jornada 8 vs Tuzos Ocotlán"
                  className="w-full p-2.5 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">Contenido del Aviso *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe las indicaciones (hora de llegada, indumentaria, uniforme rojo, hidratación)..."
                  className="w-full p-2.5 bg-[#F8F9FA] border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Enviar Aviso Inmediato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
