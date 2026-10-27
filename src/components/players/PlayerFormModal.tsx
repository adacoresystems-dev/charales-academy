import React, { useState, useRef } from 'react';
import { X, UserPlus, User, Shield, Camera, Upload, Trash2, Link as LinkIcon, Check, Image as ImageIcon } from 'lucide-react';
import { Category, SexType } from '../../types';

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (
    playerData: {
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno?: string;
      fechaNacimiento: string;
      sexo: SexType;
      estatus: 'ACTIVO';
      posicionHabitual: string;
      numeroCamiseta?: number;
      fotoUrl?: string;
      telefonoContacto?: string;
      alergiasMedicas?: string;
      categoriaActualId: number;
    },
    guardianData: {
      nombre: string;
      apellidoPaterno: string;
      telefono: string;
      email: string;
      parentesco: string;
    }
  ) => void;
}

const SAMPLE_AVATARS = [
  {
    name: 'Niño 1',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=240&auto=format&fit=crop&q=80',
  },
  {
    name: 'Niño 2',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=240&auto=format&fit=crop&q=80',
  },
  {
    name: 'Niña 1',
    url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=240&auto=format&fit=crop&q=80',
  },
  {
    name: 'Niño 3',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
  },
  {
    name: 'Niña 2',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
];

export const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('2016-05-15');
  const [sexo, setSexo] = useState<SexType>('MASCULINO');
  const [categoriaId, setCategoriaId] = useState<number>(categories[0]?.id || 1);
  const [posicionHabitual, setPosicionHabitual] = useState('Mediocampista');
  const [numeroCamiseta, setNumeroCamiseta] = useState<string>('10');
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [alergias, setAlergias] = useState('');

  // Mode for image URL input toggle
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guardian
  const [tutorNombre, setTutorNombre] = useState('');
  const [tutorApellido, setTutorApellido] = useState('');
  const [tutorTelefono, setTutorTelefono] = useState('');
  const [tutorEmail, setTutorEmail] = useState('');
  const [tutorParentesco, setTutorParentesco] = useState('Padre');

  if (!isOpen) return null;

  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const calculatedAge = calculateAge(fechaNacimiento);

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
          setFotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (customUrlInput.trim()) {
      setFotoUrl(customUrlInput.trim());
      setShowUrlInput(false);
    }
  };

  const handleRemovePhoto = () => {
    setFotoUrl('');
    setCustomUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellidoPaterno.trim() || !fechaNacimiento) {
      return;
    }

    onSubmit(
      {
        nombre: nombre.trim(),
        apellidoPaterno: apellidoPaterno.trim(),
        apellidoMaterno: apellidoMaterno.trim() || undefined,
        fechaNacimiento,
        sexo,
        estatus: 'ACTIVO',
        posicionHabitual,
        numeroCamiseta: numeroCamiseta ? Number(numeroCamiseta) : undefined,
        fotoUrl: fotoUrl.trim() || undefined,
        telefonoContacto: tutorTelefono || undefined,
        alergiasMedicas: alergias.trim() || undefined,
        categoriaActualId: categoriaId,
      },
      {
        nombre: tutorNombre.trim(),
        apellidoPaterno: tutorApellido.trim(),
        telefono: tutorTelefono.trim(),
        email: tutorEmail.trim(),
        parentesco: tutorParentesco,
      }
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Header with Charales de Chapala styling */}
        <div className="p-5 bg-gradient-to-r from-[#111111] via-[#1a233a] to-[#3B59A8] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E31B23] text-white rounded-xl shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Inscripción de Nuevo Alumno</h2>
              <p className="text-xs text-slate-200">
                Escuela de Futbol Charales de Chapala · Alta de expediente oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Section 1: Player Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#111111] text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-[#3B59A8]" />
              <span>1. Datos del Alumno / Jugador</span>
            </h3>

            {/* FOTO DEL NIÑO FIELD */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#3B59A8]/40 transition-colors">
              <label className="font-bold text-slate-800 text-xs flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#3B59A8]" />
                  <span>Fotografía del Niño / Credencial Deportiva</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  Recomendado para credencial oficial
                </span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Photo Preview / Placeholder */}
                <div className="relative group shrink-0">
                  {fotoUrl ? (
                    <div className="relative">
                      <img
                        src={fotoUrl}
                        alt="Previsualización de foto del alumno"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#3B59A8] shadow-md bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute -top-2 -right-2 p-1.5 bg-[#E31B23] text-white rounded-full hover:bg-red-700 shadow-md transition-colors"
                        title="Quitar foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-[#3B59A8] flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-[#3B59A8]"
                    >
                      <Camera className="w-7 h-7 mb-1 stroke-1" />
                      <span className="text-[10px] font-medium text-center px-1">Sin foto</span>
                    </div>
                  )}
                </div>

                {/* Upload Actions */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Hidden file input */}
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
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#3B59A8] hover:bg-[#2F4788] text-white font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{fotoUrl ? 'Cambiar Foto' : 'Subir Foto del Alumno'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{showUrlInput ? 'Ocultar URL' : 'Enlace Web (URL)'}</span>
                    </button>

                    {fotoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-1.5 px-2.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Quitar</span>
                      </button>
                    )}
                  </div>

                  {/* URL Input Box (Collapsible) */}
                  {showUrlInput && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://ejemplo.com/foto-nino.jpg"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#3B59A8]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}

                  {/* Sample Avatars Selector for quick selection */}
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-500 block mb-1">
                      O selecciona una foto de muestra rápida:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {SAMPLE_AVATARS.map((avatar, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFotoUrl(avatar.url)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 hover:scale-105 ${
                            fotoUrl === avatar.url
                              ? 'border-[#3B59A8] ring-2 ring-[#3B59A8]/30 shadow-xs'
                              : 'border-transparent hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          {fotoUrl === avatar.url && (
                            <span className="absolute inset-0 bg-[#3B59A8]/40 flex items-center justify-center text-white">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre(s) *</label>
                <input
                  required
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Alumno demo 04"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Apellido Paterno *</label>
                <input
                  required
                  type="text"
                  value={apellidoPaterno}
                  onChange={(e) => setApellidoPaterno(e.target.value)}
                  placeholder="Ej. Demo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Apellido Materno</label>
                <input
                  type="text"
                  value={apellidoMaterno}
                  onChange={(e) => setApellidoMaterno(e.target.value)}
                  placeholder="Ej. Demo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  required
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
                <span className="text-[11px] text-[#3B59A8] font-bold block mt-0.5">
                  Edad calculada: {calculatedAge} años
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sexo</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value as SexType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                >
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="NO_ESPECIFICADO">No Especificado</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Categoría Deportiva *
                </label>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre} ({cat.edadMinima}-{cat.edadMaxima} años)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Posición de Juego</label>
                <input
                  type="text"
                  value={posicionHabitual}
                  onChange={(e) => setPosicionHabitual(e.target.value)}
                  placeholder="Ej. Delantero, Portero, Defensa"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dorsal / Camiseta</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={numeroCamiseta}
                  onChange={(e) => setNumeroCamiseta(e.target.value)}
                  placeholder="10"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Alergias o Restricciones
                </label>
                <input
                  type="text"
                  value={alergias}
                  onChange={(e) => setAlergias(e.target.value)}
                  placeholder="Ej. Ninguna, asmático leve"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Guardian Information */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h3 className="font-bold text-[#111111] text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Shield className="w-4 h-4 text-[#3B59A8]" />
              <span>2. Tutor Responsable y Contacto Principal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre Tutor *</label>
                <input
                  type="text"
                  value={tutorNombre}
                  onChange={(e) => setTutorNombre(e.target.value)}
                  placeholder="Ej. Tutor demo 04"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Apellido Tutor *</label>
                <input
                  type="text"
                  value={tutorApellido}
                  onChange={(e) => setTutorApellido(e.target.value)}
                  placeholder="Ej. Demo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Parentesco</label>
                <select
                  value={tutorParentesco}
                  onChange={(e) => setTutorParentesco(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                >
                  <option value="Padre">Padre</option>
                  <option value="Madre">Madre</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                  <option value="Abuelo/a">Abuelo / Abuela</option>
                  <option value="Tío/a">Tío / Tía</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Teléfono Celular WhatsApp *
                </label>
                <input
                  type="tel"
                  value={tutorTelefono}
                  onChange={(e) => setTutorTelefono(e.target.value)}
                  placeholder="Sin teléfono de ejemplo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={tutorEmail}
                  onChange={(e) => setTutorEmail(e.target.value)}
                  placeholder="demo@example.test"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B59A8] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 -mx-6 -mb-6 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              * Campos obligatorios para el registro en Charales de Chapala
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#E31B23] hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all hover:shadow-lg flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Completar Inscripción</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
