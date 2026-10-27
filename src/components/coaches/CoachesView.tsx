import React, { useState, useRef } from 'react';
import {
  Users,
  Award,
  Phone,
  Mail,
  Calendar,
  Layers,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  ShieldCheck,
  UserCheck,
  MapPin,
  Clock,
  Sparkles,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { Coach, Category, Role } from '../../types';

import defaultCoachMale from '../../assets/images/charales_coach_portrait_1792503325122.jpg';
import defaultCoachFemale from '../../assets/images/charales_coach_female_1792503340726.jpg';

interface CoachesViewProps {
  coaches: Coach[];
  categories: Category[];
  currentRole: Role;
  onAddCoach?: (coach: Omit<Coach, 'id'>) => void;
  onUpdateCoach?: (id: number, data: Partial<Coach>) => void;
}

export const CoachesView: React.FC<CoachesViewProps> = ({
  coaches,
  categories,
  currentRole,
  onAddCoach,
  onUpdateCoach,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPaterno, setFormPaterno] = useState('');
  const [formMaterno, setFormMaterno] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formLicencia, setFormLicencia] = useState('');
  const [formCategories, setFormCategories] = useState<number[]>([]);
  const [formFotoUrl, setFormFotoUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canManage = currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA';

  const filteredCoaches = coaches.filter((c) => {
    const fullName = `${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno || ''} ${c.licencia || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' ||
      (c.categoriasAsignadas && c.categoriasAsignadas.includes(Number(filterCategory)));
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && c.activo) ||
      (filterStatus === 'inactive' && !c.activo);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingCoach(null);
    setFormName('');
    setFormPaterno('');
    setFormMaterno('');
    setFormPhone('');
    setFormEmail('');
    setFormLicencia('Licencia Nacional Formativa FMF');
    setFormCategories([]);
    setFormFotoUrl(defaultCoachMale);
    setShowModal(true);
  };

  const handleOpenEditModal = (coach: Coach) => {
    setEditingCoach(coach);
    setFormName(coach.nombre);
    setFormPaterno(coach.apellidoPaterno);
    setFormMaterno(coach.apellidoMaterno || '');
    setFormPhone(coach.telefono);
    setFormEmail(coach.email);
    setFormLicencia(coach.licencia || '');
    setFormCategories(coach.categoriasAsignadas || []);
    setFormFotoUrl(coach.fotoUrl || '');
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Por favor selecciona una imagen menor a 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormFotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPaterno.trim()) return;

    if (editingCoach && onUpdateCoach) {
      onUpdateCoach(editingCoach.id, {
        nombre: formName.trim(),
        apellidoPaterno: formPaterno.trim(),
        apellidoMaterno: formMaterno.trim(),
        telefono: formPhone.trim(),
        email: formEmail.trim(),
        licencia: formLicencia.trim(),
        categoriasAsignadas: formCategories,
        fotoUrl: formFotoUrl.trim() || undefined,
      });
    } else if (onAddCoach) {
      onAddCoach({
        nombre: formName.trim(),
        apellidoPaterno: formPaterno.trim(),
        apellidoMaterno: formMaterno.trim(),
        telefono: formPhone.trim(),
        email: formEmail.trim(),
        licencia: formLicencia.trim(),
        activo: true,
        categoriasAsignadas: formCategories,
        fotoUrl: formFotoUrl.trim() || defaultCoachMale,
      });
    }
    setShowModal(false);
  };

  const toggleCategorySelection = (catId: number) => {
    setFormCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Cuerpo Técnico y Entrenadores
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3B59A8]/10 text-[#3B59A8]">
              {coaches.length} Profesores
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de directores técnicos, credenciales oficiales con fotografía y asignación de categorías
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-[#3B59A8] hover:bg-[#162963] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Entrenador</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Cuerpo Técnico</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3B59A8] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{coaches.length}</p>
          <span className="text-[11px] text-emerald-600 font-bold">100% Activos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Categorías Cubiertas</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{categories.length}</p>
          <span className="text-[11px] text-slate-500">Sub-6 a Sub-14</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Certificación SICEF</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {coaches.filter((c) => c.licencia?.toLowerCase().includes('uefa') || c.licencia?.toLowerCase().includes('formativa') || c.licencia?.toLowerCase().includes('licencia')).length}
          </p>
          <span className="text-[11px] text-slate-500">Acreditados FMF / UEFA</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Filosofía Formativa</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">100%</p>
          <span className="text-[11px] text-purple-600 font-bold">ADN Charales Chapala</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o licencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCoaches.map((coach) => {
          const assignedCats = categories.filter((cat) =>
            coach.categoriasAsignadas?.includes(cat.id)
          );

          // Get initials
          const initials = `${coach.nombre.charAt(0)}${coach.apellidoPaterno.charAt(0)}`;

          return (
            <div
              key={coach.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Top Coach Header with Real Photo */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {coach.fotoUrl ? (
                      <img
                        src={coach.fotoUrl}
                        alt={`${coach.nombre} ${coach.apellidoPaterno}`}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-900 shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B59A8] to-[#2D4EA2] text-white font-extrabold text-base flex items-center justify-center shadow-md shrink-0">
                        {initials}
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Prof. {coach.nombre} {coach.apellidoPaterno} {coach.apellidoMaterno || ''}
                      </h3>
                      <p className="text-[11px] text-[#3B59A8] font-bold">
                        Director Técnico Formativo
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      coach.activo
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {coach.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* License Badge */}
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#3B59A8] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-500">Acreditación</p>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {coach.licencia || 'Licencia Formativa Acreditada'}
                    </p>
                  </div>
                </div>

                {/* Assigned Categories */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Categorías a su cargo:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedCats.length > 0 ? (
                      assignedCats.map((cat) => (
                        <span
                          key={cat.id}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          ⚽ {cat.nombre}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Sin categorías asignadas actualmente
                      </span>
                    )}
                  </div>
                </div>

                {/* Training Schedule Details */}
                {assignedCats.length > 0 && (
                  <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{assignedCats[0].diasEntrenamiento.join(', ')} · {assignedCats[0].horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{assignedCats[0].sedeNombre}</span>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium">{coach.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{coach.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/52${coach.telefono.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-xs font-bold transition-all shadow-xs"
                >
                  WhatsApp
                </a>

                {canManage && (
                  <button
                    onClick={() => handleOpenEditModal(coach)}
                    className="p-1.5 text-slate-600 hover:text-[#3B59A8] hover:bg-white rounded-lg border border-slate-200 transition-colors"
                    title="Editar Entrenador"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Coach Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scaleUp my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3B59A8] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingCoach ? 'Editar Entrenador' : 'Registrar Nuevo Entrenador'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* SECCIÓN DE FOTO DEL ENTRENADOR */}
              <div className="p-3.5 bg-slate-50/90 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#3B59A8]/40 transition-colors">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-2">
                  Fotografía del Entrenador *
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview / Placeholder */}
                  <div className="relative shrink-0">
                    {formFotoUrl ? (
                      <div className="relative">
                        <img
                          src={formFotoUrl}
                          alt="Foto del profesor"
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-[#3B59A8] shadow-md bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setFormFotoUrl('')}
                          className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-colors"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-6 h-6 stroke-[1.5]" />
                        <span className="text-[9.5px] mt-1 font-semibold">Sin foto</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls & Presets */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir desde dispositivo</span>
                      </button>

                      {formFotoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormFotoUrl('')}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
                        >
                          Quitar
                        </button>
                      )}
                    </div>

                    {/* Presets */}
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">
                        O seleccionar fotografía oficial:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormFotoUrl(defaultCoachMale)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all border ${
                            formFotoUrl === defaultCoachMale
                              ? 'bg-blue-50 border-[#3B59A8] text-[#3B59A8]'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <img
                            src={defaultCoachMale}
                            alt="Profesor Polo Azul"
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span>Profesor</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormFotoUrl(defaultCoachFemale)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all border ${
                            formFotoUrl === defaultCoachFemale
                              ? 'bg-blue-50 border-[#3B59A8] text-[#3B59A8]'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <img
                            src={defaultCoachFemale}
                            alt="Profesora Polo Azul"
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span>Profesora</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Roberto"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPaterno}
                    onChange={(e) => setFormPaterno(e.target.value)}
                    placeholder="Ej. Demo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    value={formMaterno}
                    onChange={(e) => setFormMaterno(e.target.value)}
                    placeholder="Ej. Delgado"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Teléfono Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="Ej. Sin teléfono de ejemplo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="demo@example.test"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Licencia / Certificación
                </label>
                <input
                  type="text"
                  value={formLicencia}
                  onChange={(e) => setFormLicencia(e.target.value)}
                  placeholder="Ej. Licencia B UEFA Pro Youth / SICEF FMF"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                  Asignar Categorías de Entrenamiento
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                  {categories.map((cat) => {
                    const isSelected = formCategories.includes(cat.id);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => toggleCategorySelection(cat.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#3B59A8] text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{cat.nombre}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#3B59A8] hover:bg-[#162963] text-white shadow-md"
                >
                  {editingCoach ? 'Guardar Cambios' : 'Registrar Entrenador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachesView;
