import { Avatar } from '../common/Avatar';
import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shirt,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  Users,
  UserCheck,
  Phone,
  Mail,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { StudentCredentialModal } from './StudentCredentialModal';
import {
  Player,
  Category,
  Guardian,
  GuardianPlayerRelation,
  Charge,
  Role,
  PlayerStatus,
} from '../../types';

interface PlayerListProps {
  players: Player[];
  categories: Category[];
  guardians: Guardian[];
  relations: GuardianPlayerRelation[];
  charges: Charge[];
  currentRole: Role;
  onSelectPlayer: (player: Player) => void;
  onOpenNewPlayerModal: () => void;
  onChangePlayerStatus: (id: number, newStatus: PlayerStatus, motivo: string) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  categories,
  guardians,
  relations,
  charges,
  currentRole,
  onSelectPlayer,
  onOpenNewPlayerModal,
  onChangePlayerStatus,
}) => {
  const [subTab, setSubTab] = useState<'jugadores' | 'tutores'>('jugadores');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Status Change Dialog State
  const [statusDialogPlayer, setStatusDialogPlayer] = useState<Player | null>(null);
  const [targetStatus, setTargetStatus] = useState<PlayerStatus>('BAJA_TEMPORAL');
  const [statusReason, setStatusReason] = useState('');

  // Official Credential Modal State
  const [selectedCredentialPlayer, setSelectedCredentialPlayer] = useState<Player | null>(null);

  // Helper calculate age
  const calculateAge = (dobString: string): number => {
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno || ''} ${p.identificador}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' || String(p.categoriaActualId) === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || p.estatus === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleConfirmStatusChange = () => {
    if (statusDialogPlayer && statusReason.trim()) {
      onChangePlayerStatus(statusDialogPlayer.id, targetStatus, statusReason.trim());
      setStatusDialogPlayer(null);
      setStatusReason('');
    }
  };

  const canEdit = currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA';

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Registration */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Jugadores y Tutores
          </h1>
          <p className="text-xs text-slate-500">
            Control de altas, expedientes de alumnos, categorías vigentes y directorio de padres/tutores
          </p>
        </div>

        {canEdit && (
          <button
            onClick={onOpenNewPlayerModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#E31B23] hover:bg-red-700 text-white rounded-xl shadow-sm transition-all hover:shadow-md self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Inscribir Nuevo Alumno</span>
          </button>
        )}
      </div>

      {/* Sub-Tabs: Jugadores vs Tutores & Direct Inscribir Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('jugadores')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'jugadores'
                ? 'bg-[#3B59A8] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Jugadores Inscritos ({players.length})</span>
          </button>

          <button
            onClick={() => setSubTab('tutores')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'tutores'
                ? 'bg-[#3B59A8] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Directorio de Tutores ({guardians.length})</span>
          </button>
        </div>

        {canEdit && (
          <button
            onClick={onOpenNewPlayerModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#3B59A8] hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
            title="Inscribir nuevo alumno (la misma opción del tablero principal)"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Inscribir</span>
          </button>
        )}
      </div>

      {subTab === 'tutores' ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tutor por nombre, apellidos, teléfono o email..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guardians
              .filter((g) => {
                const term = searchTerm.toLowerCase();
                return (
                  `${g.nombre} ${g.apellidoPaterno} ${g.apellidoMaterno || ''} ${g.telefono} ${g.email}`
                    .toLowerCase()
                    .includes(term)
                );
              })
              .map((guardian) => {
                const rels = relations.filter((r) => r.tutorId === guardian.id);
                const linkedPlayers = rels
                  .map((r) => ({
                    player: players.find((p) => p.id === r.jugadorId),
                    parentesco: r.parentesco,
                    esPrincipal: r.esContactoPrincipal,
                  }))
                  .filter((item) => item.player !== undefined);

                return (
                  <div
                    key={guardian.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3B59A8] font-bold text-sm flex items-center justify-center">
                            {guardian.nombre.charAt(0)}{guardian.apellidoPaterno.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm text-slate-900">
                              {guardian.nombre} {guardian.apellidoPaterno} {guardian.apellidoMaterno || ''}
                            </h3>
                            <span className="text-[11px] text-slate-500 font-semibold">
                              {guardian.ocupacion || 'Tutor Registrado'}
                            </span>
                          </div>
                        </div>

                        {rels.some((r) => r.esContactoPrincipal) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                            Principal
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold">{guardian.telefono}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium truncate">{guardian.email}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          Alumnos a su cargo:
                        </span>
                        <div className="space-y-1">
                          {linkedPlayers.map(({ player, parentesco }) => (
                            <div
                              key={player!.id}
                              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 text-left transition-all text-xs group"
                            >
                              <button
                                type="button"
                                onClick={() => onSelectPlayer(player!)}
                                className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                              >
                                <span className="font-bold text-slate-800 group-hover:text-[#3B59A8]">
                                  ⚽ {player!.nombre} {player!.apellidoPaterno}
                                </span>
                                <span className="text-[10px] text-slate-500 font-semibold">
                                  ({player!.categoriaActualNombre})
                                </span>
                              </button>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                  {parentesco}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedCredentialPlayer(player!)}
                                  className="px-2 py-0.5 bg-blue-50 hover:bg-[#3B59A8] hover:text-white text-[#3B59A8] rounded-md font-bold text-[10px] flex items-center gap-1 border border-blue-200 transition-colors cursor-pointer"
                                  title="Ver Credencial Oficial del Alumno"
                                >
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Credencial</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={`https://wa.me/52${guardian.telefono.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-xs font-bold transition-all shadow-xs"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${guardian.telefono}`}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                      >
                        Llamar
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellidos o número de folio (ej. Leo, Usuario, J-2026)..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
          />
        </div>

        {/* Category Filter */}
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:flex gap-2 w-full md:w-auto min-w-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-w-0 w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="min-w-0 w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          >
            <option value="all">Todos los Estatus</option>
            <option value="ACTIVO">Activos</option>
            <option value="BAJA_TEMPORAL">Baja Temporal</option>
            <option value="BAJA_DEFINITIVA">Baja Definitiva</option>
          </select>
        </div>
      </div>

      {/* Players List Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-100">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Folio / Alumno</th>
                <th className="px-4 py-3.5">Edad</th>
                <th className="px-4 py-3.5">Categoría Actual</th>
                <th className="px-4 py-3.5">Tutor Responsable</th>
                <th className="px-4 py-3.5">Estado Financiero</th>
                <th className="px-4 py-3.5">Estatus</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPlayers.map((player) => {
                const age = calculateAge(player.fechaNacimiento);
                const rel = relations.find((r) => r.jugadorId === player.id && r.esContactoPrincipal);
                const tutor = rel ? guardians.find((g) => g.id === rel.tutorId) : null;
                const hasPending = charges.some(
                  (c) =>
                    c.jugadorId === player.id &&
                    (c.estado === 'PENDIENTE' || c.estado === 'VENCIDO')
                );

                return (
                  <tr
                    key={player.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectPlayer(player)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {player.fotoUrl ? (
                          <Avatar src={player.fotoUrl} name={player.nombre} className="w-10 h-10 rounded-xl object-cover border border-[#3B59A8]/20 shadow-xs shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#EEF2FA] border border-[#3B59A8]/20 text-[#3B59A8] font-bold flex items-center justify-center shrink-0 text-xs">
                            {player.numeroCamiseta ? `#${player.numeroCamiseta}` : player.nombre[0]}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block group-hover:text-[#3B59A8] transition-colors">
                            {player.nombre} {player.apellidoPaterno} {player.apellidoMaterno || ''}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {player.identificador}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 tabular-nums font-medium text-slate-800">
                      {age} años
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {player.categoriaActualNombre || 'Sin asignar'}
                    </td>

                    <td className="px-4 py-3.5">
                      {tutor ? (
                        <div>
                          <span className="font-medium text-slate-800 block">
                            {tutor.nombre} {tutor.apellidoPaterno}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {rel?.parentesco} · {tutor.telefono}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sin tutor</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {hasPending ? (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <span>Saldo pendiente</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <span>Al corriente</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          player.estatus === 'ACTIVO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : player.estatus === 'BAJA_TEMPORAL'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {player.estatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div
                        className="inline-flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedCredentialPlayer(player)}
                          className="px-2.5 py-1 text-xs font-bold text-[#3B59A8] bg-blue-50 hover:bg-[#3B59A8] hover:text-white rounded-lg transition-all border border-blue-200/80 flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Ver e Imprimir Credencial Oficial del Alumno"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Credencial Oficial</span>
                        </button>

                        <button
                          onClick={() => onSelectPlayer(player)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Ver Expediente Integral"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canEdit && (
                          <button
                            onClick={() => {
                              setStatusDialogPlayer(player);
                              setTargetStatus(
                                player.estatus === 'ACTIVO' ? 'BAJA_TEMPORAL' : 'ACTIVO'
                              );
                            }}
                            className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Cambiar Estatus del Jugador"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredPlayers.map((player) => {
            const age = calculateAge(player.fechaNacimiento);
            const rel = relations.find((r) => r.jugadorId === player.id && r.esContactoPrincipal);
            const tutor = rel ? guardians.find((g) => g.id === rel.tutorId) : null;
            const hasPending = charges.some(
              (c) =>
                c.jugadorId === player.id &&
                (c.estado === 'PENDIENTE' || c.estado === 'VENCIDO')
            );

            return (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {player.fotoUrl ? (
                      <Avatar src={player.fotoUrl} name={player.nombre} className="w-11 h-11 rounded-xl object-cover border border-[#3B59A8]/20 shadow-xs shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-[#EEF2FA] border border-[#3B59A8]/20 text-[#3B59A8] font-bold flex items-center justify-center shrink-0 text-sm">
                        {player.numeroCamiseta ? `#${player.numeroCamiseta}` : player.nombre[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {player.nombre} {player.apellidoPaterno}
                      </h3>
                      <div className="text-xs text-slate-500">
                        <span>{player.categoriaActualNombre}</span> · <span>{age} años</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      player.estatus === 'ACTIVO'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {player.estatus}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    Tutor: {tutor ? `${tutor.nombre} (${rel?.parentesco})` : 'Sin asignar'}
                  </span>
                  {hasPending ? (
                    <span className="text-rose-600 font-bold">Adeudo</span>
                  ) : (
                    <span className="text-emerald-600 font-bold">Al corriente</span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCredentialPlayer(player);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold text-[#3B59A8] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3B59A8]" />
                    <span>Credencial Oficial</span>
                  </button>

                  <div className="flex items-center gap-1 text-[#3B59A8] font-bold">
                    <span>Ver Expediente</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-400">
            No se encontraron alumnos con los criterios seleccionados.
          </div>
        )}
      </div>
      </>
      )}

      {/* Confirmation Dialog for Player Status Change (HU-010) */}
      {statusDialogPlayer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cambiar Estatus de Jugador
                </h3>
                <span className="text-xs text-slate-500">
                  {statusDialogPlayer.nombre} {statusDialogPlayer.apellidoPaterno}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              El cambio de estatus no borra el historial de partidos ni los pagos históricos del alumno (HU-010).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nuevo Estatus:</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as PlayerStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ACTIVO">ACTIVO (Regular)</option>
                  <option value="BAJA_TEMPORAL">BAJA TEMPORAL (Lesión / Permiso)</option>
                  <option value="BAJA_DEFINITIVA">BAJA DEFINITIVA</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Motivo o justificación del cambio:
                </label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Ej. Incapacidad médica por esguince de tobillo, cambio de residencia..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStatusDialogPlayer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                disabled={!statusReason.trim()}
                onClick={handleConfirmStatusChange}
                className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
              >
                Confirmar Cambio de Estatus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Credential Modal */}
      {selectedCredentialPlayer && (
        <StudentCredentialModal
          player={selectedCredentialPlayer}
          onClose={() => setSelectedCredentialPlayer(null)}
          guardians={guardians}
          relations={relations}
          categories={categories}
        />
      )}
    </div>
  );
};
