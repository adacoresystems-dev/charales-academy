import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Clock,
  Users,
  Calendar,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Trophy,
  Search,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  Eye,
  Info,
} from 'lucide-react';
import { Category, Venue, Season, Player, Role, Coach } from '../../types';
import { CategoryRosterModal } from './CategoryRosterModal';

interface CategoriesViewProps {
  categories: Category[];
  venues: Venue[];
  seasons: Season[];
  players: Player[];
  coaches?: Coach[];
  currentRole: Role;
  onAddCategory?: (category: Omit<Category, 'id'>) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  venues,
  seasons,
  players,
  coaches = [],
  currentRole,
  onAddCategory,
}) => {
  const currentSeason = seasons.find((s) => s.esActual) || seasons[0];
  const canManage = currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA';

  // Filters & View Mode
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenueFilter, setSelectedVenueFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'DISPONIBLE' | 'LLENO'>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategoryForRoster, setSelectedCategoryForRoster] = useState<Category | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State for Adding Category
  const [formNombre, setFormNombre] = useState('');
  const [formEdadMinima, setFormEdadMinima] = useState<number>(8);
  const [formEdadMaxima, setFormEdadMaxima] = useState<number>(9);
  const [formCupoMaximo, setFormCupoMaximo] = useState<number>(20);
  const [formSedeId, setFormSedeId] = useState<number>(venues[0]?.id || 1);
  const [formDias, setFormDias] = useState<string[]>(['Lunes', 'Miércoles']);
  const [formHorario, setFormHorario] = useState('16:30 - 18:00');
  const [formCoachIds, setFormCoachIds] = useState<number[]>([]);

  const ALL_DAYS_WEEK = [
    { key: 'Lunes', short: 'LUN' },
    { key: 'Martes', short: 'MAR' },
    { key: 'Miércoles', short: 'MIÉ' },
    { key: 'Jueves', short: 'JUE' },
    { key: 'Viernes', short: 'VIE' },
    { key: 'Sábado', short: 'SÁB' },
    { key: 'Domingo', short: 'DOM' },
  ];

  // Global KPIs calculation
  const totalCapacity = categories.reduce((sum, c) => sum + (c.cupoMaximo || 20), 0);
  const totalEnrolled = categories.reduce((sum, c) => {
    return sum + players.filter((p) => p.categoriaActualId === c.id && p.estatus === 'ACTIVO').length;
  }, 0);
  const globalOccupancy = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const handleToggleDay = (day: string) => {
    setFormDias((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleToggleCoach = (coachId: number) => {
    setFormCoachIds((prev) =>
      prev.includes(coachId) ? prev.filter((id) => id !== coachId) : [...prev, coachId]
    );
  };

  const handleOpenAddModal = () => {
    setFormNombre('');
    setFormEdadMinima(8);
    setFormEdadMaxima(9);
    setFormCupoMaximo(20);
    setFormSedeId(venues[0]?.id || 1);
    setFormDias(['Lunes', 'Miércoles']);
    setFormHorario('16:30 - 18:00');
    setFormCoachIds(coaches[0] ? [coaches[0].id] : []);
    setShowAddModal(true);
  };

  const applyCategoryPreset = (preset: {
    nombre: string;
    edadMinima: number;
    edadMaxima: number;
    cupoMaximo: number;
    horario: string;
    dias: string[];
  }) => {
    setFormNombre(preset.nombre);
    setFormEdadMinima(preset.edadMinima);
    setFormEdadMaxima(preset.edadMaxima);
    setFormCupoMaximo(preset.cupoMaximo);
    setFormHorario(preset.horario);
    setFormDias(preset.dias);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) return;

    const targetVenue = venues.find((v) => v.id === formSedeId);
    const assignedCoaches = coaches.filter((c) => formCoachIds.includes(c.id));

    const newCategoryPayload: Omit<Category, 'id'> = {
      temporadaId: currentSeason?.id || 1,
      nombre: formNombre.trim(),
      edadMinima: Number(formEdadMinima),
      edadMaxima: Number(formEdadMaxima),
      cupoMaximo: Number(formCupoMaximo),
      diasEntrenamiento: formDias.length > 0 ? formDias : ['Lunes', 'Miércoles'],
      horario: formHorario.trim() || '16:30 - 18:00',
      sedeId: formSedeId,
      sedeNombre: targetVenue?.nombre || 'Campo Oficial Club Charales',
      entrenadorIds: formCoachIds,
      entrenadoresNombres: assignedCoaches.map((c) => `${c.nombre} ${c.apellidoPaterno}`),
      activa: true,
    };

    if (onAddCategory) {
      onAddCategory(newCategoryPayload);
    }

    setSuccessMsg(`¡Categoría "${formNombre.trim()}" creada y agregada exitosamente al catálogo oficial!`);
    setTimeout(() => setSuccessMsg(null), 4500);
    setShowAddModal(false);
  };

  // Filter logic
  const filteredCategories = categories.filter((cat) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      cat.nombre.toLowerCase().includes(term) ||
      cat.sedeNombre.toLowerCase().includes(term) ||
      cat.entrenadoresNombres.some((n) => n.toLowerCase().includes(term)) ||
      `${cat.edadMinima}`.includes(term) ||
      `${cat.edadMaxima}`.includes(term);

    const matchVenue =
      selectedVenueFilter === 'all' || String(cat.sedeId) === selectedVenueFilter;

    const enrolled = players.filter(
      (p) => p.categoriaActualId === cat.id && p.estatus === 'ACTIVO'
    ).length;
    const isFull = enrolled >= cat.cupoMaximo;

    const matchStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'LLENO' && isFull) ||
      (selectedStatusFilter === 'DISPONIBLE' && !isFull);

    return matchSearch && matchVenue && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* ========================================================
          HERO EXECUTIVE BANNER (Charales Official Style)
          ======================================================== */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#111111] to-[#1c2438] text-white p-6 sm:p-8 shadow-md border border-neutral-800">
        {/* Dynamic Sport Stripes */}
        <div className="absolute top-0 right-0 w-80 h-full pointer-events-none overflow-hidden opacity-30">
          <svg className="w-full h-full" viewBox="0 0 300 160" preserveAspectRatio="none" fill="none">
            <path d="M120 0 L240 160 L280 160 L160 0 Z" fill="#E31B23" />
            <path d="M180 0 L300 160 L340 160 L220 0 Z" fill="#3B59A8" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[10.5px] font-bold tracking-widest uppercase bg-[#E31B23] text-white rounded-md">
                Área de Coordinación Formativa
              </span>
              {currentSeason && (
                <span className="text-xs text-neutral-300 font-semibold">
                  Temporada Oficial {currentSeason.nombre}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
              Estructura de Categorías y Planteles
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
              Gestión de grupos formativos por rangos de edad oficiales, cupos reglamentarios de cancha, horarios semanales y asignación del cuerpo técnico.
            </p>
          </div>

          {canManage && (
            <div className="shrink-0 flex items-center gap-2.5">
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-[#E31B23] hover:bg-[#c9151c] text-white rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar Categoría</span>
              </button>
            </div>
          )}
        </div>

        {/* Live KPI Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/10 text-xs">
          <div>
            <span className="text-neutral-400 text-[11px] block">Grupos Activos:</span>
            <strong className="text-white text-lg font-mono font-bold">
              {categories.length} Categorías
            </strong>
          </div>
          <div>
            <span className="text-neutral-400 text-[11px] block">Alumnos en Cancha:</span>
            <strong className="text-emerald-400 text-lg font-mono font-bold">
              {totalEnrolled} Alumnos
            </strong>
          </div>
          <div>
            <span className="text-neutral-400 text-[11px] block">Capacidad Instalada:</span>
            <strong className="text-white text-lg font-mono font-bold">
              {totalCapacity} Cupos
            </strong>
          </div>
          <div>
            <span className="text-neutral-400 text-[11px] block">Ocupación General:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <strong className="text-[#3B59A8] text-lg font-mono font-bold">
                {globalOccupancy}%
              </strong>
              <div className="w-20 bg-white/20 h-2 rounded-full overflow-hidden hidden sm:block">
                <div
                  className="bg-[#3B59A8] h-full rounded-full"
                  style={{ width: `${globalOccupancy}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ========================================================
          CONTROLS, SEARCH & VIEW MODE SWITCHER
          ======================================================== */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Left: Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por categoría, profesor, cancha o edad..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8F9FA] border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B59A8] text-neutral-800 font-semibold placeholder-neutral-400"
          />
        </div>

        {/* Center & Right: Filter dropdowns & View Mode Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Status filter buttons */}
          <div className="flex items-center p-1 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-xs">
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`px-3 py-1 font-bold rounded-lg transition-colors cursor-pointer ${
                selectedStatusFilter === 'ALL'
                  ? 'bg-[#3B59A8] text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedStatusFilter('DISPONIBLE')}
              className={`px-3 py-1 font-bold rounded-lg transition-colors cursor-pointer ${
                selectedStatusFilter === 'DISPONIBLE'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-emerald-700'
              }`}
            >
              Con Cupo
            </button>
            <button
              onClick={() => setSelectedStatusFilter('LLENO')}
              className={`px-3 py-1 font-bold rounded-lg transition-colors cursor-pointer ${
                selectedStatusFilter === 'LLENO'
                  ? 'bg-[#E31B23] text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-[#E31B23]'
              }`}
            >
              Llenas
            </button>
          </div>

          {/* Sede selector */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedVenueFilter}
              onChange={(e) => setSelectedVenueFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#F8F9FA] border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] text-neutral-800 font-semibold"
            >
              <option value="all">Todas las Canchas</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-[#F8F9FA] rounded-xl border border-neutral-200">
            <button
              onClick={() => setViewMode('cards')}
              title="Vista en Tarjetas Deportivas"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#3B59A8] shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Vista en Tabla Comparativa"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#3B59A8] shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          VIEW 1: CARDS GRID (TARJETAS DEPORTIVAS REDISEÑADAS)
          ======================================================== */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((cat) => {
            const categoryActivePlayers = players.filter(
              (p) => p.categoriaActualId === cat.id && p.estatus === 'ACTIVO'
            );
            const enrolled = categoryActivePlayers.length;
            const percentage = Math.min(
              100,
              Math.round((enrolled / (cat.cupoMaximo || 20)) * 100)
            );
            const isFull = enrolled >= cat.cupoMaximo;
            const availableSpots = Math.max(0, cat.cupoMaximo - enrolled);
            const assignedCoach = coaches.find((c) => cat.entrenadorIds?.includes(c.id));

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:border-[#3B59A8] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header Bar */}
                  <div className="p-5 border-b border-neutral-100 flex items-start justify-between gap-3 bg-gradient-to-b from-neutral-50/60 to-white">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#3B59A8] bg-blue-50 px-2 py-0.5 rounded-md">
                          {cat.edadMinima} a {cat.edadMaxima} años
                        </span>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          Generación {2026 - cat.edadMaxima} - {2026 - cat.edadMinima}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-neutral-900 group-hover:text-[#3B59A8] transition-colors truncate">
                        {cat.nombre}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 border ${
                        isFull
                          ? 'bg-red-50 text-[#E31B23] border-red-200'
                          : percentage > 75
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {isFull
                        ? '🔴 Cupo Lleno'
                        : percentage > 75
                        ? `🟡 Alta Demanda (${availableSpots} libres)`
                        : `🟢 ${availableSpots} Cupos Libres`}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Coach Dossier Strip */}
                    <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200/80">
                      <div className="flex items-center gap-3 min-w-0">
                        {assignedCoach?.fotoUrl ? (
                          <img
                            src={assignedCoach.fotoUrl}
                            alt={assignedCoach.nombre}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#3B59A8] shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#3B59A8] text-white font-black text-sm flex items-center justify-center shrink-0">
                            {assignedCoach ? assignedCoach.nombre.charAt(0) : 'DT'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Director Técnico a Cargo
                          </span>
                          <span className="text-xs font-bold text-neutral-900 block truncate">
                            {assignedCoach
                              ? `Prof. ${assignedCoach.nombre} ${assignedCoach.apellidoPaterno}`
                              : cat.entrenadoresNombres?.join(', ') || 'Por asignar'}
                          </span>
                          <span className="text-[10px] text-neutral-500 block truncate">
                            {assignedCoach?.licencia || 'Licencia Formativa FMF'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase block">
                          Sede
                        </span>
                        <span className="text-xs font-bold text-neutral-700 block truncate max-w-[140px]" title={cat.sedeNombre}>
                          {cat.sedeNombre.split('(')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Schedule & Interactive Days of Week Matrix */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#3B59A8]" />
                          <span>Días y Horarios de Cancha</span>
                        </span>
                        <span className="font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                          {cat.horario}
                        </span>
                      </div>

                      {/* 7 Days of the Week Chips */}
                      <div className="grid grid-cols-7 gap-1">
                        {ALL_DAYS_WEEK.map(({ key, short }) => {
                          const isAssigned = cat.diasEntrenamiento?.includes(key);
                          return (
                            <div
                              key={key}
                              title={`${key}: ${isAssigned ? 'Entrenamiento Programado' : 'Sin sesión'}`}
                              className={`py-1.5 text-center rounded-lg text-[10px] font-mono font-bold transition-colors ${
                                isAssigned
                                  ? 'bg-[#3B59A8] text-white shadow-2xs'
                                  : 'bg-[#F8F9FA] text-neutral-300 border border-neutral-200/60'
                              }`}
                            >
                              {short}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Capacity Progress Gauge */}
                    <div className="p-4 bg-[#F8F9FA] rounded-xl border border-neutral-200/90 space-y-2">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-neutral-700 text-[11px] uppercase tracking-wider">
                          Ocupación de Plantel:
                        </span>
                        <div className="flex items-baseline gap-1 font-mono">
                          <strong className="text-base font-black text-neutral-900 tabular-nums">
                            {enrolled}
                          </strong>
                          <span className="text-neutral-400">/ {cat.cupoMaximo} cupos</span>
                          <span className="text-[11px] font-bold text-[#3B59A8] ml-1">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFull
                              ? 'bg-[#E31B23]'
                              : percentage > 75
                              ? 'bg-amber-500'
                              : 'bg-[#3B59A8]'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10.5px] text-neutral-500 pt-0.5">
                        <span>
                          {isFull ? (
                            <strong className="text-[#E31B23]">Plantel al límite reglamentario</strong>
                          ) : (
                            <span>Quedan <strong className="text-neutral-800">{availableSpots} lugares</strong></span>
                          )}
                        </span>
                        <span className="font-semibold text-neutral-600">
                          Máx: {cat.cupoMaximo} jugadores
                        </span>
                      </div>
                    </div>

                    {/* Stacked Players Preview Avatars */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2 overflow-hidden">
                          {categoryActivePlayers.slice(0, 5).map((player, idx) => (
                            <div
                              key={player.id}
                              title={`${player.nombre} (Dorsal #${player.numeroCamiseta || '—'})`}
                              className="w-7 h-7 rounded-full bg-[#111111] text-white border-2 border-white font-mono text-[9.5px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                            >
                              {player.numeroCamiseta ? `#${player.numeroCamiseta}` : player.nombre.charAt(0)}
                            </div>
                          ))}
                        </div>
                        {categoryActivePlayers.length > 5 && (
                          <span className="text-[11px] text-neutral-500 font-bold pl-1 font-mono">
                            +{categoryActivePlayers.length - 5} más
                          </span>
                        )}
                        {categoryActivePlayers.length === 0 && (
                          <span className="text-[11px] text-neutral-400 italic">
                            Sin alumnos asignados todavía
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCategoryForRoster(cat)}
                        className="text-xs font-bold text-[#3B59A8] hover:text-[#162963] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Plantel ({enrolled})</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span className="truncate max-w-[180px]">{cat.sedeNombre}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCategoryForRoster(cat)}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>Expedientes de Alumnos</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-neutral-200 text-neutral-400 text-xs">
              No se encontraron categorías que coincidan con los filtros seleccionados.
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          VIEW 2: COMPARATIVE TABLE VIEW (TABLA DETALLADA)
          ======================================================== */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Categoría & Rango</th>
                  <th className="py-3.5 px-4">Profesor / DT</th>
                  <th className="py-3.5 px-4">Días & Horario</th>
                  <th className="py-3.5 px-4">Cancha / Sede</th>
                  <th className="py-3.5 px-4 w-48">Ocupación y Cupo</th>
                  <th className="py-3.5 px-4 text-center">Estatus</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCategories.map((cat) => {
                  const enrolled = players.filter(
                    (p) => p.categoriaActualId === cat.id && p.estatus === 'ACTIVO'
                  ).length;
                  const percentage = Math.min(
                    100,
                    Math.round((enrolled / (cat.cupoMaximo || 20)) * 100)
                  );
                  const isFull = enrolled >= cat.cupoMaximo;
                  const assignedCoach = coaches.find((c) => cat.entrenadorIds?.includes(c.id));

                  return (
                    <tr key={cat.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-neutral-900 block text-sm">
                            {cat.nombre}
                          </span>
                          <span className="text-[11px] text-[#3B59A8] font-bold">
                            {cat.edadMinima} a {cat.edadMaxima} años
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#3B59A8] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {assignedCoach ? assignedCoach.nombre.charAt(0) : 'C'}
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 block">
                              {assignedCoach
                                ? `${assignedCoach.nombre} ${assignedCoach.apellidoPaterno}`
                                : cat.entrenadoresNombres.join(', ') || 'Sin asignar'}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              {assignedCoach?.licencia || 'Cuerpo Técnico'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-800 block">
                          {cat.diasEntrenamiento.join(', ')}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-500">
                          {cat.horario}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-800 block truncate max-w-[160px]">
                          {cat.sedeNombre}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="font-bold text-neutral-900">
                              {enrolled} / {cat.cupoMaximo}
                            </span>
                            <span className="text-[#3B59A8] font-bold">{percentage}%</span>
                          </div>
                          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isFull ? 'bg-[#E31B23]' : 'bg-[#3B59A8]'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isFull
                              ? 'bg-red-100 text-[#E31B23]'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isFull ? 'Lleno' : 'Disponible'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCategoryForRoster(cat)}
                          className="px-3 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-[#3B59A8] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Ver Plantel ({enrolled})
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          PITCH FACILITIES DIRECTORY (SEDES Y CANCHAS DEPORTIVAS)
          ======================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B59A8] flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                Sedes y Canchas Oficiales de Entrenamiento
              </h2>
              <p className="text-[11px] text-neutral-500">
                Infraestructura deportiva asignada para prácticas formativas y encuentros de liga
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-400">
            {venues.length} Sedes Registradas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {venues.map((venue) => {
            const categoriesAtVenue = categories.filter((c) => c.sedeId === venue.id);

            return (
              <div
                key={venue.id}
                className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-neutral-900 text-sm">{venue.nombre}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#3B59A8] shrink-0">
                      {venue.tipoCancha}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{venue.direccion}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200/80 text-[11px] text-neutral-600">
                  <span className="font-bold block text-[10.5px] uppercase tracking-wider text-neutral-400 mb-1">
                    Grupos que entrenan aquí:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {categoriesAtVenue.length > 0 ? (
                      categoriesAtVenue.map((cat) => (
                        <span
                          key={cat.id}
                          className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-800 text-[10px] font-bold"
                        >
                          {cat.nombre.split(' ')[0]}
                        </span>
                      ))
                    ) : (
                      <span className="text-neutral-400 italic">Sin categorías fijas</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          MODAL: CATEGORY SQUAD ROSTER (EXPEDIENTE DEL PLANTEL)
          ======================================================== */}
      {selectedCategoryForRoster && (
        <CategoryRosterModal
          category={selectedCategoryForRoster}
          players={players}
          coaches={coaches}
          isOpen={Boolean(selectedCategoryForRoster)}
          onClose={() => setSelectedCategoryForRoster(null)}
        />
      )}

      {/* ========================================================
          MODAL: AGREGAR NUEVA CATEGORÍA
          ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-scaleUp my-8 border border-neutral-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E31B23] text-white flex items-center justify-center font-bold shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-neutral-900">
                    Registrar Nueva Categoría
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Escuela de Fútbol Infantil Charales de Chapala
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-800 font-bold p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              {/* Presets */}
              <div>
                <span className="text-[10.5px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#3B59A8]" />
                  <span>Plantillas Sugeridas de Categorías FMF:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      label: 'Sub-7 Charalitos',
                      nombre: 'Sub-7 (Iniciación y Psicomotricidad)',
                      edadMinima: 6,
                      edadMaxima: 7,
                      cupoMaximo: 18,
                      horario: '16:00 - 17:15',
                      dias: ['Lunes', 'Miércoles'],
                    },
                    {
                      label: 'Sub-9 Dientes de Leche',
                      nombre: 'Sub-9 Dientes de Leche',
                      edadMinima: 8,
                      edadMaxima: 9,
                      cupoMaximo: 20,
                      horario: '16:30 - 18:00',
                      dias: ['Lunes', 'Miércoles', 'Viernes'],
                    },
                    {
                      label: 'Sub-11 Infantil Menor',
                      nombre: 'Sub-11 Varonil Formativa',
                      edadMinima: 10,
                      edadMaxima: 11,
                      cupoMaximo: 22,
                      horario: '16:30 - 18:00',
                      dias: ['Martes', 'Jueves', 'Viernes'],
                    },
                    {
                      label: 'Sub-13 Juvenil Menor',
                      nombre: 'Sub-13 Fuerzas Básicas',
                      edadMinima: 12,
                      edadMaxima: 13,
                      cupoMaximo: 22,
                      horario: '18:15 - 19:45',
                      dias: ['Lunes', 'Miércoles', 'Viernes'],
                    },
                  ].map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => applyCategoryPreset(preset)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-blue-50 hover:text-[#3B59A8] hover:border-[#3B59A8]/40 border border-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer text-[11px]"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre de Categoría */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-800 uppercase mb-1">
                  Nombre Oficial de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej. Sub-9 Dientes de Leche, Sub-11 Formativa, etc."
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-neutral-300 rounded-xl font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              {/* Rango de Edad & Cupo Máximo */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-neutral-800 uppercase mb-1">
                    Edad Mínima *
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="20"
                    required
                    value={formEdadMinima}
                    onChange={(e) => setFormEdadMinima(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-neutral-800 uppercase mb-1">
                    Edad Máxima *
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="22"
                    required
                    value={formEdadMaxima}
                    onChange={(e) => setFormEdadMaxima(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-neutral-800 uppercase mb-1">
                    Cupo Máx. *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    required
                    value={formCupoMaximo}
                    onChange={(e) => setFormCupoMaximo(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F9FA] border border-neutral-300 rounded-xl font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>
              </div>

              {/* Sede / Cancha */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-800 uppercase mb-1">
                  Cancha / Sede Asignada *
                </label>
                <select
                  value={formSedeId}
                  onChange={(e) => setFormSedeId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-neutral-300 rounded-xl font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nombre} ({v.tipoCancha}) - {v.direccion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Días de la Semana */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-800 uppercase mb-1.5">
                  Días de Entrenamiento *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_DAYS_WEEK.map(({ key, short }) => {
                    const isSelected = formDias.includes(key);
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => handleToggleDay(key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#3B59A8] text-white border-[#3B59A8] shadow-2xs'
                            : 'bg-[#F8F9FA] text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Horario */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-800 uppercase mb-1">
                  Horario de Entrenamiento *
                </label>
                <input
                  type="text"
                  required
                  value={formHorario}
                  onChange={(e) => setFormHorario(e.target.value)}
                  placeholder="Ej. 16:30 - 18:00"
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-neutral-300 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              {/* Entrenador Asignado */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-800 uppercase mb-1.5">
                  Director Técnico Responsable *
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto bg-[#F8F9FA] p-2 rounded-xl border border-neutral-200">
                  {coaches.map((c) => {
                    const isSelected = formCoachIds.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => handleToggleCoach(c.id)}
                        className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-[#3B59A8] text-[#3B59A8]'
                            : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {c.fotoUrl ? (
                            <img
                              src={c.fotoUrl}
                              alt={c.nombre}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover border border-neutral-300"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#3B59A8] text-white font-bold text-xs flex items-center justify-center">
                              {c.nombre[0]}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-xs text-neutral-900 block leading-tight">
                              Prof. {c.nombre} {c.apellidoPaterno}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              {c.licencia || 'Licencia Formativa FMF'}
                            </span>
                          </div>
                        </div>

                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#3B59A8] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-[#E31B23] hover:bg-[#c9151c] text-white shadow-md cursor-pointer transition-colors"
                >
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesView;
