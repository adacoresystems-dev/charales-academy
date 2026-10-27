import React, { useState } from 'react';
import {
  Trophy,
  X,
  Calendar,
  Building2,
  Tag,
  CheckCircle2,
  Users,
  Sparkles,
  Info,
} from 'lucide-react';
import { Category, Tournament } from '../../types';

interface TournamentModalProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onAddTournament: (tournamentData: Omit<Tournament, 'id'>) => void;
}

export const TournamentModal: React.FC<TournamentModalProps> = ({
  categories,
  isOpen,
  onClose,
  onAddTournament,
}) => {
  const [nombre, setNombre] = useState('');
  const [organizador, setOrganizador] = useState('');
  const [tipo, setTipo] = useState<Tournament['tipo']>('Liga Local');
  const [temporada, setTemporada] = useState('Apertura 2026');
  const [fechaInicio, setFechaInicio] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [fechaFin, setFechaFin] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [estatus, setEstatus] = useState<Tournament['estatus']>('INSCRIPCIÓN');
  const [categoriasInscritas, setCategoriasInscritas] = useState<number[]>(
    categories.map((c) => c.id)
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleToggleCategory = (catId: number) => {
    setCategoriasInscritas((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSelectAllCategories = () => {
    if (categoriasInscritas.length === categories.length) {
      setCategoriasInscritas([]);
    } else {
      setCategoriasInscritas(categories.map((c) => c.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('Por favor ingresa el nombre de la liga o torneo.');
      return;
    }
    if (!organizador.trim()) {
      setErrorMsg('Indica quién organiza la competición.');
      return;
    }
    if (categoriasInscritas.length === 0) {
      setErrorMsg('Debes seleccionar al menos una categoría participante.');
      return;
    }

    onAddTournament({
      nombre: nombre.trim(),
      organizador: organizador.trim(),
      tipo,
      temporada: temporada.trim() || '2026',
      fechaInicio,
      fechaFin,
      estatus,
      categoriasInscritas,
    });

    onClose();
    // Reset form
    setNombre('');
    setOrganizador('');
    setErrorMsg('');
  };

  const applyPreset = (preset: {
    nombre: string;
    organizador: string;
    tipo: Tournament['tipo'];
    temporada: string;
  }) => {
    setNombre(preset.nombre);
    setOrganizador(preset.organizador);
    setTipo(preset.tipo);
    setTemporada(preset.temporada);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header with Charales Sports styling */}
        <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800 relative">
          <div className="absolute top-0 right-0 w-40 h-full pointer-events-none overflow-hidden opacity-30">
            <svg className="w-full h-full" viewBox="0 0 160 80" preserveAspectRatio="none" fill="none">
              <path d="M40 0 L100 80 L130 80 L70 0 Z" fill="#E31B23" />
              <path d="M80 0 L140 80 L170 80 L110 0 Z" fill="#3B59A8" />
            </svg>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#E31B23] text-white flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Registrar Nueva Liga o Torneo</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Administrador
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Inscribe y calendariza competiciones oficiales para las categorías del club
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer relative z-10"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[#E31B23] font-semibold text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Presets for Rapid Entry */}
          <div>
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#3B59A8]" />
              Plantillas Sugeridas de Torneos Ribereños:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                {
                  label: 'Liga Regional Ribera Chapala',
                  nombre: 'Liga Infantil Ribera de Chapala 2026',
                  organizador: 'Asociación de Fútbol de la Ribera A.C.',
                  tipo: 'Liga Local' as const,
                  temporada: 'Apertura 2026',
                },
                {
                  label: 'Copa Estatal Jalisco Juvenil',
                  nombre: 'Copa Jalisco Infantil & Juvenil 2026',
                  organizador: 'CODE Jalisco / Asociación Estatal de Fútbol',
                  tipo: 'Estatal' as const,
                  temporada: '2026',
                },
                {
                  label: 'Torneo Cuadrangular Amistoso',
                  nombre: 'Torneo Cuadrangular Fiestas de Chapala',
                  organizador: 'Club de Fútbol Charales de Chapala',
                  tipo: 'Torneo Relámpago' as const,
                  temporada: 'Otoño 2026',
                },
              ].map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-blue-50 hover:text-[#3B59A8] hover:border-[#3B59A8]/40 border border-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer text-[11px]"
                >
                  + {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tournament Name */}
          <div>
            <label className="font-bold text-neutral-800 block mb-1">
              Nombre de la Liga o Torneo <span className="text-[#E31B23]">*</span>
            </label>
            <div className="relative">
              <Trophy className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="ej. Liga Regional Infantil Ribera de Chapala"
                className="w-full pl-9 pr-3 py-2.5 bg-[#F8F9FA] border border-neutral-300 rounded-xl font-semibold text-neutral-900 outline-none focus:ring-2 focus:ring-[#3B59A8] focus:border-[#3B59A8]"
              />
            </div>
          </div>

          {/* Organizador & Temporada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-neutral-800 block mb-1">
                Entidad Organizadora <span className="text-[#E31B23]">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={organizador}
                  onChange={(e) => {
                    setOrganizador(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="ej. COMUDE Chapala / CODE Jalisco"
                  className="w-full pl-9 pr-3 py-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-800 block mb-1">
                Temporada o Ciclo
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={temporada}
                  onChange={(e) => setTemporada(e.target.value)}
                  placeholder="ej. Apertura 2026"
                  className="w-full pl-9 pr-3 py-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>
            </div>
          </div>

          {/* Tipo & Estatus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-neutral-800 block mb-1">
                Tipo de Competición
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as Tournament['tipo'])}
                className="w-full p-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#3B59A8] font-semibold"
              >
                <option value="Liga Local">Liga Local (Torneo Regular)</option>
                <option value="Copa Interclubes">Copa Interclubes / Regional</option>
                <option value="Estatal">Torneo Estatal (Jalisco)</option>
                <option value="Torneo Relámpago">Torneo Relámpago (Fin de Semana)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-neutral-800 block mb-1">
                Estatus Actual
              </label>
              <select
                value={estatus}
                onChange={(e) => setEstatus(e.target.value as Tournament['estatus'])}
                className="w-full p-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#3B59A8] font-semibold"
              >
                <option value="INSCRIPCIÓN">Inscripción / Convocatoria Abierta</option>
                <option value="EN_CURSO">En Curso (Partidos Activos)</option>
                <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>
          </div>

          {/* Vigencia / Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-neutral-800 block mb-1">
                Fecha de Inicio
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-800 block mb-1">
                Fecha de Conclusión
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>
            </div>
          </div>

          {/* Categorías Participantes Checkboxes */}
          <div className="pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-neutral-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#3B59A8]" />
                <span>Categorías Inscritas de Charales Chapala:</span>
              </label>
              <button
                type="button"
                onClick={handleSelectAllCategories}
                className="text-[11px] font-bold text-[#3B59A8] hover:underline cursor-pointer"
              >
                {categoriasInscritas.length === categories.length
                  ? 'Desmarcar todas'
                  : 'Seleccionar todas'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const isChecked = categoriasInscritas.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleToggleCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-blue-50/80 border-[#3B59A8] text-neutral-900 shadow-2xs font-semibold'
                        : 'bg-[#F8F9FA] border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="truncate">
                      <span className="block truncate text-xs">{cat.nombre}</span>
                      <span className="text-[10px] text-neutral-400 block">
                        {cat.edadMinima} - {cat.edadMaxima} años
                      </span>
                    </div>
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-[#3B59A8] shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#E31B23] hover:bg-[#c9151c] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Guardar Liga o Torneo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
