import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  CreditCard,
  ShieldCheck,
  QrCode,
  Calendar,
  User,
  HeartPulse,
  Phone,
  Sparkles,
  Award,
  CheckCircle2,
  RotateCw,
  Share2,
} from 'lucide-react';
import { Player, Guardian, GuardianPlayerRelation, Category } from '../../types';
import { CharalesLogo } from '../common/CharalesLogo';

interface PlayerCredentialModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  guardians: Guardian[];
  relations: GuardianPlayerRelation[];
  categories?: Category[];
}

export const PlayerCredentialModal: React.FC<PlayerCredentialModalProps> = ({
  player,
  isOpen,
  onClose,
  guardians,
  relations,
  categories = [],
}) => {
  const [viewSide, setViewSide] = useState<'front' | 'back' | 'both'>('both');
  const [isCopied, setIsCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !player) return null;

  // Linked guardian
  const rel = relations.find((r) => r.jugadorId === player.id && r.esContactoPrincipal) ||
    relations.find((r) => r.jugadorId === player.id);
  const tutor = rel ? guardians.find((g) => g.id === rel.tutorId) : null;

  // Category
  const category = categories.find((c) => c.id === player.categoriaActualId);

  // Calculate age
  const calculateAge = (birthDateString: string) => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(player.fechaNacimiento);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(
      `https://charaleschapala.com/credenciales/${player.identificador}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp print:border-0 print:shadow-none print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#111111] via-[#3B59A8] to-[#253E7B] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Credencial Oficial del Alumno</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Vigente 2026
                </span>
              </h2>
              <p className="text-xs text-blue-200">
                Club Deportivo Charales de Chapala A.C. · Carnet de Afiliación
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls (Hidden on print) */}
        <div className="p-3 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs print:hidden">
          {/* Side View Switcher */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewSide('both')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewSide === 'both'
                  ? 'bg-[#3B59A8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ambas Caras
            </button>
            <button
              onClick={() => setViewSide('front')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewSide === 'front'
                  ? 'bg-[#3B59A8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Frente (Anverso)
            </button>
            <button
              onClick={() => setViewSide('back')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewSide === 'back'
                  ? 'bg-[#3B59A8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reverso
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Copiar enlace de validación"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{isCopied ? '¡Enlace Copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-xs"
              title="Imprimir Credencial Oficial"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Credencial</span>
            </button>
          </div>
        </div>

        {/* Credential Printable Area */}
        <div ref={printRef} className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Style for clean print */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body * {
                visibility: hidden;
              }
              .print-credential-container, .print-credential-container * {
                visibility: visible;
              }
              .print-credential-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 10px;
              }
            }
          `}} />

          <div className="print-credential-container grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
            {/* ============================================================ */}
            {/* CARA 1: ANVERSO (FRENTE)                                      */}
            {/* ============================================================ */}
            {(viewSide === 'front' || viewSide === 'both') && (
              <div className="w-full max-w-[340px] mx-auto aspect-[1.586/1] bg-gradient-to-br from-[#0c183f] via-[#3B59A8] to-[#122353] rounded-2xl p-4 text-white shadow-xl border-2 border-amber-400/40 relative overflow-hidden flex flex-col justify-between select-none">
                {/* Background watermark logo */}
                <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                  <CharalesLogo size={180} />
                </div>

                {/* Subtle top gloss line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-blue-500" />

                {/* Header: Club Name & Logo */}
                <div className="flex items-center justify-between pb-2 border-b border-white/15 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-sm flex items-center justify-center shrink-0">
                      <CharalesLogo size={32} />
                    </div>
                    <div>
                      <span className="font-black text-[10.5px] uppercase tracking-wider block text-white leading-tight">
                        Charales de Chapala
                      </span>
                      <span className="text-[8.5px] font-bold text-amber-300 block tracking-wider uppercase">
                        Academia de Fútbol Formativa
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[7px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 tracking-wider inline-block">
                      FMF 2026
                    </span>
                    <span className="text-[8.5px] text-blue-200 block font-mono font-bold mt-0.5">
                      {player.identificador}
                    </span>
                  </div>
                </div>

                {/* Center: Photo + Player Main Data */}
                <div className="grid grid-cols-12 gap-3 items-center my-auto py-1 relative z-10">
                  {/* Photo Column */}
                  <div className="col-span-4 flex flex-col items-center">
                    <div className="relative">
                      {player.fotoUrl ? (
                        <img
                          src={player.fotoUrl}
                          alt={player.nombre}
                          className="w-18 h-18 rounded-xl object-cover border-2 border-white shadow-md bg-white"
                        />
                      ) : (
                        <div className="w-18 h-18 rounded-xl bg-blue-900 border-2 border-white flex flex-col items-center justify-center text-white font-black text-xl shadow-md">
                          {player.numeroCamiseta ? `#${player.numeroCamiseta}` : player.nombre[0]}
                        </div>
                      )}

                      {/* Jersey number bubble */}
                      {player.numeroCamiseta && (
                        <span className="absolute -bottom-1.5 -right-1.5 bg-[#E31B23] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                          #{player.numeroCamiseta}
                        </span>
                      )}
                    </div>
                    <span className="text-[7.5px] font-bold text-slate-300 mt-1 uppercase tracking-wider">
                      Alumno Oficial
                    </span>
                  </div>

                  {/* Info Column */}
                  <div className="col-span-8 space-y-1">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-slate-300 font-bold block">
                        Nombre del Jugador
                      </span>
                      <h3 className="font-black text-xs text-white leading-tight truncate">
                        {player.nombre} {player.apellidoPaterno} {player.apellidoMaterno || ''}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[9px] pt-0.5">
                      <div>
                        <span className="text-[7.5px] uppercase text-slate-300 font-bold block">
                          Categoría
                        </span>
                        <span className="font-extrabold text-amber-300 block truncate">
                          {player.categoriaActualNombre || 'Sub-8'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[7.5px] uppercase text-slate-300 font-bold block">
                          Posición
                        </span>
                        <span className="font-bold text-white block truncate">
                          {player.posicionHabitual || 'Delantero'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                      <div>
                        <span className="text-[7.5px] uppercase text-slate-300 font-bold block">
                          Edad
                        </span>
                        <span className="font-bold text-slate-100 block">
                          {age} años ({player.fechaNacimiento.slice(0, 4)})
                        </span>
                      </div>

                      <div>
                        <span className="text-[7.5px] uppercase text-slate-300 font-bold block">
                          Estatus
                        </span>
                        <span className="font-extrabold text-emerald-400 block">
                          {player.estatus === 'ACTIVO' ? 'Afiliado Activo' : player.estatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: Hologram & Signature Strip */}
                <div className="pt-1.5 border-t border-white/15 flex items-center justify-between text-[8px] relative z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-amber-400/20 border border-amber-400/60 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div>
                      <span className="font-bold block text-white text-[7.5px] leading-tight">
                        VALIDADO EN CANCHA
                      </span>
                      <span className="text-[7px] text-slate-300">Apertura - Clausura 2026</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[8px] tracking-widest text-slate-300">
                      *CHARALES-OFICIAL*
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* CARA 2: REVERSO                                               */}
            {/* ============================================================ */}
            {(viewSide === 'back' || viewSide === 'both') && (
              <div className="w-full max-w-[340px] mx-auto aspect-[1.586/1] bg-white rounded-2xl p-4 text-slate-800 shadow-xl border-2 border-slate-300 relative overflow-hidden flex flex-col justify-between select-none">
                {/* Magnetic Strip Illusion */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-slate-900" />

                {/* Legal note */}
                <div className="pt-2 text-[7.5px] text-slate-500 leading-tight">
                  <p>
                    Esta credencial es personal e intransferible. Acredita la afiliación del deportista
                    en torneos, ligas y entrenamientos de Charales de Chapala A.C.
                  </p>
                </div>

                {/* Emergency & Guardian Data */}
                <div className="grid grid-cols-12 gap-2 my-auto text-[8.5px] py-1 border-y border-slate-100">
                  {/* Left: Medical and Guardian */}
                  <div className="col-span-8 space-y-1">
                    <div>
                      <span className="text-[7.5px] uppercase font-bold text-slate-400 block">
                        Padre / Tutor Responsable
                      </span>
                      <span className="font-extrabold text-slate-900 block truncate">
                        {tutor ? `${tutor.nombre} ${tutor.apellidoPaterno}` : 'Tutor Registrado en Sistema'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[7.5px] uppercase font-bold text-slate-400 block">
                          Teléfono de Urgencias
                        </span>
                        <span className="font-bold text-[#3B59A8] block">
                          {tutor?.telefono || player.telefonoContacto || 'Sin teléfono de ejemplo'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[7.5px] uppercase font-bold text-slate-400 block">
                          Alergias / Médicas
                        </span>
                        <span className="font-bold text-rose-600 block truncate">
                          {player.alergiasMedicas || 'Ninguna registrada'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: QR Code */}
                  <div className="col-span-4 flex flex-col items-center justify-center">
                    <div className="p-1 bg-slate-100 border border-slate-300 rounded-lg">
                      <QrCode className="w-12 h-12 text-slate-800" />
                    </div>
                    <span className="text-[7px] text-slate-400 font-mono mt-0.5">VALIDAR QR</span>
                  </div>
                </div>

                {/* Barcode and Signatures */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-2 text-center text-[7.5px]">
                    <div className="border-t border-slate-300 pt-0.5">
                      <span className="font-bold text-slate-700 block">Firma del Director Deportivo</span>
                      <span className="text-[6.5px] text-slate-400">Prof. Javier Demo Usuario</span>
                    </div>
                    <div className="border-t border-slate-300 pt-0.5">
                      <span className="font-bold text-slate-700 block">Firma Padre o Tutor</span>
                      <span className="text-[6.5px] text-slate-400">Autorización Competitiva</span>
                    </div>
                  </div>

                  {/* Simulated barcode */}
                  <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-0.5 h-4">
                      <div className="w-0.5 h-full bg-slate-900" />
                      <div className="w-1 h-full bg-slate-900" />
                      <div className="w-0.5 h-full bg-slate-900" />
                      <div className="w-1.5 h-full bg-slate-900" />
                      <div className="w-0.5 h-full bg-slate-900" />
                      <div className="w-1 h-full bg-slate-900" />
                      <div className="w-2 h-full bg-slate-900" />
                      <div className="w-0.5 h-full bg-slate-900" />
                      <div className="w-1 h-full bg-slate-900" />
                      <div className="w-0.5 h-full bg-slate-900" />
                      <div className="w-1.5 h-full bg-slate-900" />
                      <div className="w-1 h-full bg-slate-900" />
                      <div className="w-0.5 h-full bg-slate-900" />
                      <div className="w-2 h-full bg-slate-900" />
                      <div className="w-0.5 h-full bg-slate-900" />
                      <div className="w-1 h-full bg-slate-900" />
                    </div>
                    <span className="text-[7.5px] font-mono font-bold text-slate-500">
                      RFC: CDC850412-AC · JALISCO
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Institutional validation seal note */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 text-xs text-slate-700 flex items-start gap-3 print:hidden">
            <CheckCircle2 className="w-4 h-4 text-[#3B59A8] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900">
                Credencial de Identidad Deportiva Oficial Certificada
              </p>
              <p className="text-[11.5px] text-slate-600">
                Esta credencial es válida para el pase de lista en cancha, registro en actas arbitrales
                de liga y torneos regionales. Puede ser impresa en cartulina opalina o plastificada formato carnet PVC.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden on print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500 font-mono">
            ID: {player.identificador} · {player.nombre} {player.apellidoPaterno}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#3B59A8] hover:bg-[#162963] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Credencial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCredentialModal;
