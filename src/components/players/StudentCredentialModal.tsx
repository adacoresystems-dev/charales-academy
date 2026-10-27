import React, { useState } from 'react';
import {
  X,
  Printer,
  RotateCw,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  HeartPulse,
  Award,
  Sparkles,
  QrCode,
  Download,
  Share2,
} from 'lucide-react';
import { Player, Guardian, GuardianPlayerRelation, Category } from '../../types';
import { CharalesLogo } from '../common/CharalesLogo';

interface StudentCredentialModalProps {
  player: Player | null;
  onClose: () => void;
  guardians?: Guardian[];
  relations?: GuardianPlayerRelation[];
  categories?: Category[];
}

export const StudentCredentialModal: React.FC<StudentCredentialModalProps> = ({
  player,
  onClose,
  guardians = [],
  relations = [],
  categories = [],
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!player) return null;

  // Find primary guardian
  const rel = relations.find((r) => r.jugadorId === player.id && r.esContactoPrincipal) ||
    relations.find((r) => r.jugadorId === player.id);
  const guardian = rel ? guardians.find((g) => g.id === rel.tutorId) : null;

  // Category
  const category = categories.find((c) => c.id === player.categoriaActualId);

  // Age calculation
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(player.fechaNacimiento);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp print:shadow-none print:border-none print:max-w-none">
        
        {/* Modal Top Header (Hidden on Print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3B59A8] text-white flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Credencial Oficial del Alumno
              </h3>
              <p className="text-[11px] text-slate-300">
                Acreditación Deportiva Institucional · Charales de Chapala A.C.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Voltear Credencial (Anverso / Reverso)"
            >
              <RotateCw className={`w-3.5 h-3.5 transition-transform duration-300 ${isFlipped ? 'rotate-180' : ''}`} />
              <span className="hidden sm:inline">{isFlipped ? 'Ver Anverso' : 'Ver Reverso'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Imprimir Credencial Oficial"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Credential Container Area */}
        <div className="p-6 bg-slate-100/80 flex flex-col items-center justify-center min-h-[460px] print:p-4 print:bg-white">
          
          {/* Card Wrapper with 3D feel */}
          <div className="relative w-full max-w-[500px] perspective-1000">
            
            {/* ============================================================ */}
            {/* ANVERSO (FRONT SIDE) */}
            {/* ============================================================ */}
            {!isFlipped && (
              <div className="w-full bg-gradient-to-br from-[#11245A] via-[#3B59A8] to-[#0D183B] text-white rounded-3xl shadow-2xl p-5 border-2 border-white/20 relative overflow-hidden flex flex-col justify-between aspect-[1.586] transition-all duration-300 select-none">
                
                {/* Decorative Holographic Gloss Foil Overlay */}
                <div className="absolute -top-24 -left-24 w-60 h-60 bg-gradient-to-tr from-white/15 via-rose-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-400/15 via-transparent to-red-500/10 rounded-full blur-2xl pointer-events-none" />
                
                {/* Micro-Watermark pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Top Section: Club Header */}
                <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-white/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center shadow-md shrink-0">
                      <CharalesLogo size={42} />
                    </div>
                    <div>
                      <h4 className="font-black text-[12px] sm:text-[13px] tracking-wider uppercase text-white leading-tight">
                        Club Charales de Chapala A.C.
                      </h4>
                      <p className="text-[9.5px] font-bold text-rose-300 uppercase tracking-wider">
                        Academia Oficial de Fútbol Formativo
                      </p>
                      <span className="text-[8px] text-white/70 block">
                        Afiliación FMF · Jalisco, México
                      </span>
                    </div>
                  </div>

                  {/* Golden Holographic Badge */}
                  <div className="flex flex-col items-end">
                    <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[8.5px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1 border border-amber-200">
                      <Sparkles className="w-2.5 h-2.5 fill-current" />
                      <span>OFICIAL 2026</span>
                    </div>
                    <span className="text-[8px] text-white/70 mt-0.5 font-mono">
                      VIG: DIC 2026
                    </span>
                  </div>
                </div>

                {/* Center Section: Photo & Player Primary Data */}
                <div className="relative z-10 my-auto py-2 flex items-center gap-4">
                  {/* Student Photo */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-white p-1 shadow-lg border-2 border-white/80 overflow-hidden flex items-center justify-center">
                      {player.fotoUrl ? (
                        <img
                          src={player.fotoUrl}
                          alt={player.nombre}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#3B59A8] text-white font-black text-3xl flex flex-col items-center justify-center rounded-xl">
                          <span>{player.nombre.charAt(0)}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-rose-300 mt-1">
                            CHARALES
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Jersey Number Badge */}
                    {player.numeroCamiseta && (
                      <span className="absolute -bottom-2 -right-1 bg-[#E31B23] text-white text-[11px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-md">
                        #{player.numeroCamiseta}
                      </span>
                    )}
                  </div>

                  {/* Details Column */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-xs border border-white/15">
                      <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-blue-200 block">
                        Nombre del Jugador
                      </span>
                      <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white leading-tight truncate">
                        {player.nombre} {player.apellidoPaterno} {player.apellidoMaterno || ''}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
                        <span className="text-[8px] text-white/60 uppercase block font-semibold">
                          Categoría
                        </span>
                        <span className="font-extrabold text-white text-[10.5px] truncate block">
                          {player.categoriaActualNombre || category?.nombre || 'Formativa'}
                        </span>
                      </div>

                      <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
                        <span className="text-[8px] text-white/60 uppercase block font-semibold">
                          Posición
                        </span>
                        <span className="font-bold text-rose-300 text-[10.5px] truncate block">
                          {player.posicionHabitual || 'Delantero'}
                        </span>
                      </div>

                      <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
                        <span className="text-[8px] text-white/60 uppercase block font-semibold">
                          Edad / Nacimiento
                        </span>
                        <span className="font-bold text-white text-[10.5px] block font-mono">
                          {age} años ({player.fechaNacimiento})
                        </span>
                      </div>

                      <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
                        <span className="text-[8px] text-white/60 uppercase block font-semibold">
                          Estatus Club
                        </span>
                        <span className="font-black text-emerald-300 text-[10.5px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{player.estatus}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Matrícula, Barcode & Federation Note */}
                <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between text-[9px]">
                  <div>
                    <span className="text-white/60 text-[8px] block uppercase font-semibold">
                      Matrícula Oficial de Registro
                    </span>
                    <span className="font-mono font-black text-amber-300 text-xs tracking-wider">
                      {player.identificador}
                    </span>
                  </div>

                  {/* Simulated Visual Barcode */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-0.5 h-5 bg-white/90 px-2 py-0.5 rounded">
                      {[1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2].map((w, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900 h-full"
                          style={{ width: `${w}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[7.5px] font-mono text-white/70 mt-0.5">
                      {player.identificador}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] font-bold text-white/90 block">
                      Apertura 2026
                    </span>
                    <span className="text-[7.5px] text-white/60 block">
                      Fútbol Base Charales
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* REVERSO (BACK SIDE) */}
            {/* ============================================================ */}
            {isFlipped && (
              <div className="w-full bg-gradient-to-br from-[#0e1933] via-[#162963] to-[#3B59A8] text-white rounded-3xl shadow-2xl p-5 border-2 border-white/20 relative overflow-hidden flex flex-col justify-between aspect-[1.586] transition-all duration-300 select-none">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Top: Emergency & Medical Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    <span className="font-black text-xs uppercase tracking-wider text-white">
                      Ficha Médica & Contacto de Emergencia
                    </span>
                  </div>
                  <span className="text-[8.5px] font-bold text-amber-300 font-mono">
                    FOLIO #{player.identificador}
                  </span>
                </div>

                {/* Center Content: Medical & Guardian */}
                <div className="py-2 space-y-2 text-[10px]">
                  {/* Medical info */}
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/15 space-y-1">
                    <span className="text-[8px] font-extrabold uppercase text-rose-300 block">
                      Alergias / Consideraciones Médicas
                    </span>
                    <p className="text-white text-[10px] leading-tight font-medium">
                      {player.alergiasMedicas || 'Sin alergias ni restricciones médicas registradas. Apto para competencia física de alto rendimiento.'}
                    </p>
                  </div>

                  {/* Tutor and Emergency Phones */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 p-2 rounded-xl border border-white/10 space-y-0.5">
                      <span className="text-[8px] font-bold uppercase text-white/60 block">
                        Padre / Tutor Responsable
                      </span>
                      <span className="font-extrabold text-white text-[10.5px] truncate block">
                        {guardian ? `${guardian.nombre} ${guardian.apellidoPaterno}` : 'Tutor Registrado'}
                      </span>
                      <span className="text-[9px] text-white/70 block">
                        Parentesco: {rel?.parentesco || 'Tutor Legal'}
                      </span>
                    </div>

                    <div className="bg-white/5 p-2 rounded-xl border border-white/10 space-y-0.5">
                      <span className="text-[8px] font-bold uppercase text-white/60 block">
                        Teléfono de Emergencia
                      </span>
                      <div className="flex items-center gap-1 font-mono font-bold text-amber-300 text-[11px]">
                        <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{guardian?.telefono || player.telefonoContacto || 'Sin teléfono de ejemplo'}</span>
                      </div>
                      <span className="text-[8px] text-emerald-300 block">
                        Atención Inmediata en Cancha
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Signatures, QR and Seal */}
                <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                  {/* Signature 1: Director */}
                  <div className="text-center w-28">
                    <div className="h-6 flex items-end justify-center">
                      <span className="font-serif italic text-[11px] text-white/80 font-bold border-b border-white/40 pb-0.5 px-2">
                        Prof. J. Alumno
                      </span>
                    </div>
                    <span className="text-[7.5px] text-white/60 block mt-0.5 uppercase">
                      Dirección Deportiva
                    </span>
                  </div>

                  {/* QR Code Verification */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white p-1 rounded-lg shadow-sm flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-slate-900" />
                    </div>
                    <span className="text-[7px] text-white/70 font-mono mt-0.5">
                      VALIDAR QR
                    </span>
                  </div>

                  {/* Signature 2: Tutor */}
                  <div className="text-center w-28">
                    <div className="h-6 flex items-end justify-center">
                      <span className="font-serif italic text-[11px] text-white/80 font-bold border-b border-white/40 pb-0.5 px-2">
                        Firma Tutor
                      </span>
                    </div>
                    <span className="text-[7.5px] text-white/60 block mt-0.5 uppercase">
                      Tutor Acreditado
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick instructions & Action Buttons below card */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 print:hidden text-xs">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold border border-slate-200 shadow-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCw className="w-4 h-4 text-[#3B59A8]" />
              <span>Girar Credencial ({isFlipped ? 'Anverso' : 'Reverso'})</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Credencial Oficial</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 text-center text-[11px] text-slate-500 print:hidden">
          <span>Esta credencial es emitida por el Club Deportivo Charales de Chapala A.C. Válida para partidos de liga, visorías y torneos federados.</span>
        </div>
      </div>
    </div>
  );
};

export default StudentCredentialModal;
