import React from 'react';
import { X, Users, MapPin, Clock, Trophy, Phone, Shield, ArrowRight } from 'lucide-react';
import { Category, Player, Coach } from '../../types';

interface CategoryRosterModalProps {
  category: Category;
  players: Player[];
  coaches: Coach[];
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryRosterModal: React.FC<CategoryRosterModalProps> = ({
  category,
  players,
  coaches,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const categoryPlayers = players.filter(
    (p) => p.categoriaActualId === category.id && p.estatus === 'ACTIVO'
  );

  const assignedCoach = coaches.find((c) => category.entrenadorIds?.includes(c.id));
  const occupancyRate = Math.min(
    100,
    Math.round((categoryPlayers.length / (category.cupoMaximo || 20)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 max-h-[90vh] flex flex-col">
        {/* Header with Charales styling */}
        <div className="bg-[#111111] text-white px-6 py-5 border-b border-neutral-800 relative shrink-0">
          <div className="absolute top-0 right-0 w-60 h-full pointer-events-none overflow-hidden opacity-25">
            <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none" fill="none">
              <path d="M60 0 L140 80 L180 80 L100 0 Z" fill="#E31B23" />
              <path d="M110 0 L190 80 L230 80 L150 0 Z" fill="#3B59A8" />
            </svg>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#3B59A8] text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white tracking-tight">
                    {category.nombre}
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                    {category.edadMinima} a {category.edadMaxima} años
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Plantel oficial de alumnos inscritos en el Club de Fútbol Charales de Chapala
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Category Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-neutral-400 text-[10.5px] block">Director Técnico:</span>
              <strong className="text-white font-semibold block truncate">
                {assignedCoach ? `Prof. ${assignedCoach.nombre} ${assignedCoach.apellidoPaterno}` : category.entrenadoresNombres.join(', ') || 'Por asignar'}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400 text-[10.5px] block">Cancha / Sede:</span>
              <strong className="text-white font-semibold block truncate">
                {category.sedeNombre}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400 text-[10.5px] block">Horarios:</span>
              <strong className="text-white font-semibold block truncate">
                {category.diasEntrenamiento.join(', ')} ({category.horario})
              </strong>
            </div>
            <div>
              <span className="text-neutral-400 text-[10.5px] block">Ocupación:</span>
              <strong className="text-[#E31B23] font-bold block">
                {categoryPlayers.length} de {category.cupoMaximo} cupos ({occupancyRate}%)
              </strong>
            </div>
          </div>
        </div>

        {/* Players List Table Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Lista de Alumnos Activos ({categoryPlayers.length})
            </span>
            <span className="text-xs text-neutral-500">
              {category.cupoMaximo - categoryPlayers.length} lugares disponibles
            </span>
          </div>

          {categoryPlayers.length === 0 ? (
            <div className="p-12 text-center bg-[#F8F9FA] rounded-2xl border border-neutral-200 text-xs text-neutral-500">
              Aún no hay alumnos asignados a esta categoría.
            </div>
          ) : (
            <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9FA] border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">Dorsal</th>
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4">Posición</th>
                    <th className="py-3 px-4">Fecha Nacimiento</th>
                    <th className="py-3 px-4">Tutor Responsable</th>
                    <th className="py-3 px-4 text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {categoryPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <span className="w-7 h-7 rounded-full bg-[#3B59A8] text-white font-mono font-bold text-xs flex items-center justify-center mx-auto shadow-2xs">
                          {player.numeroCamiseta ? `#${player.numeroCamiseta}` : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {player.fotoUrl ? (
                            <img
                              src={player.fotoUrl}
                              alt={player.nombre}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-100 font-bold text-neutral-700 text-xs flex items-center justify-center shrink-0">
                              {player.nombre.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-neutral-900 block">
                              {player.nombre} {player.apellidoPaterno} {player.apellidoMaterno || ''}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {player.identificador}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-neutral-700">
                          {player.posicionHabitual || 'Por definir'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-600">
                        {player.fechaNacimiento}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-neutral-700">
                          <span className="block font-medium">
                            {player.telefonoContacto ? player.telefonoContacto : 'Registrado'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                          {player.estatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F8F9FA] border-t border-neutral-200 flex items-center justify-between shrink-0 text-xs">
          <span className="text-neutral-500">
            Total en plantilla: <strong>{categoryPlayers.length} alumnos</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#111111] hover:bg-neutral-800 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
          >
            Cerrar Plantel
          </button>
        </div>
      </div>
    </div>
  );
};
