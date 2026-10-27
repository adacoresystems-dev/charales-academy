import React, { useRef } from 'react';
import { X, Printer, Download, Award, CheckCircle, Calendar, ShieldCheck, FileText } from 'lucide-react';
import { Player, Coach } from './types';
import { ClubLogo } from './ClubLogo';
import { RadarChart } from './RadarChart';

interface PdfReportModalProps {
  player: Player | null;
  coach: Coach;
  onClose: () => void;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  player,
  coach,
  onClose
}) => {
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!player) return null;

  const handlePrint = () => {
    window.print();
  };

  const calculateOverallTechnicalScore = () => {
    const s = player.currentSkills;
    const avg = (s.control + s.pase + s.tiro + s.velocidad + s.tactica + s.disciplina) / 6;
    return avg.toFixed(1);
  };

  const todayDate = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E31B23]" />
            <h3 className="text-sm font-bold tracking-wide">
              Vista Previa de Reporte Oficial PDF
            </h3>
            <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded ml-2">
              A4 Formato Oficial
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="overflow-y-auto p-6 md:p-10 bg-[#FAFAFA]">
          <div 
            ref={printContentRef}
            className="bg-white p-8 md:p-12 border border-neutral-300 rounded-xl shadow-xs text-[#111111] max-w-3xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none"
          >
            {/* Header with Club Crest & Institutional Identity */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-[#3B59A8]">
              <div className="flex items-center gap-4">
                <ClubLogo size="lg" />
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-[#111111] tracking-tight uppercase leading-tight">
                    Club de Fútbol Charales de Chapala
                  </h1>
                  <p className="text-xs font-bold text-[#3B59A8] uppercase tracking-wider">
                    Escuela de Fútbol Formativo Infantil · Temporada 2026
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Sede: Unidad Deportiva Municipal Usuario Rayo, Chapala, Jalisco
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-neutral-500 block">Folio Oficial</span>
                <span className="text-sm font-bold text-[#E31B23] font-mono">
                  CC-2026-{player.category.slice(0, 6).replace(' ', '')}-{player.dorsal.toString().padStart(3, '0')}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-1">Fecha: {todayDate}</span>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="my-5 bg-[#3B59A8] text-white py-2 px-4 rounded-md text-center">
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Ficha Integral de Evaluación Técnica, Asistencia y Progreso Deportivo
              </h2>
            </div>

            {/* Player Information Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F8F9FA] border border-neutral-200 rounded-lg mb-6">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Nombre del Jugador</span>
                <span className="text-sm font-bold text-[#111111]">{player.name}</span>
                <span className="text-xs text-neutral-600 block mt-1">
                  Nacimiento: {player.birthDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Categoría y Posición</span>
                <span className="text-sm font-bold text-[#3B59A8]">{player.category}</span>
                <span className="text-xs text-neutral-700 block mt-1">
                  Posición: <strong className="text-neutral-900">{player.position}</strong> (Dorsal #{player.dorsal})
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Tutor Responsable</span>
                <span className="text-xs font-semibold text-neutral-900 block">{player.tutorName}</span>
                <span className="text-[11px] text-neutral-500 block">{player.tutorPhone}</span>
              </div>
            </div>

            {/* Metric Highlights Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-white border border-neutral-200 rounded-lg text-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Asistencia Global</span>
                <span className="text-2xl font-black text-[#3B59A8] font-mono tabular-nums">
                  {player.overallAttendanceRate}%
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  Nivel Excelente (A+)
                </span>
              </div>

              <div className="p-3 bg-white border border-neutral-200 rounded-lg text-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Promedio Técnico</span>
                <span className="text-2xl font-black text-[#E31B23] font-mono tabular-nums">
                  {calculateOverallTechnicalScore()} <span className="text-xs text-neutral-400">/ 10</span>
                </span>
                <span className="text-[10px] text-neutral-600 font-semibold block mt-0.5">
                  Rendimiento Destacado
                </span>
              </div>

              <div className="p-3 bg-white border border-neutral-200 rounded-lg text-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Minutos en Torneo</span>
                <span className="text-2xl font-black text-neutral-900 font-mono tabular-nums">
                  {player.monthlyHistory.reduce((acc, m) => acc + m.minutesPlayed, 0)}'
                </span>
                <span className="text-[10px] text-neutral-600 font-semibold block mt-0.5">
                  {player.monthlyHistory.reduce((acc, m) => acc + m.goals, 0)} Goles · {player.monthlyHistory.reduce((acc, m) => acc + m.assists, 0)} Asistencias
                </span>
              </div>
            </div>

            {/* Technical Skills Breakdown and Radar Visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-center">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b pb-1">
                  <Award className="w-4 h-4 text-[#3B59A8]" />
                  Evaluación por Habilidad Técnica (1 a 10)
                </h3>

                <div className="space-y-2.5 text-xs">
                  {[
                    { label: 'Control y Dominio de Balón', val: player.currentSkills.control },
                    { label: 'Pase y Distribución de Juego', val: player.currentSkills.pase },
                    { label: 'Tiro, Definición y Remate', val: player.currentSkills.tiro },
                    { label: 'Velocidad y Agilidad Motriz', val: player.currentSkills.velocidad },
                    { label: 'Comprensión Táctica y Orden', val: player.currentSkills.tactica },
                    { label: 'Disciplina, Respeto y Actitud', val: player.currentSkills.disciplina },
                  ].map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between font-semibold mb-1">
                        <span className="text-neutral-700">{skill.label}</span>
                        <span className="font-mono text-neutral-900">{skill.val} / 10</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#3B59A8] h-full rounded-full"
                          style={{ width: `${(skill.val / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Radar Diagram */}
              <div className="flex flex-col items-center justify-center p-2 bg-[#F8F9FA] rounded-xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 uppercase mb-1">
                  Perfil Biomecánico y Táctico
                </span>
                <RadarChart
                  size={240}
                  data={[
                    {
                      label: player.name.split(' ')[0],
                      skills: player.currentSkills,
                      strokeColor: '#3B59A8',
                      fillColor: 'rgba(59, 89, 168, 0.25)'
                    },
                    {
                      label: 'Media Categoría',
                      skills: player.categoryAverageSkills || {
                        control: 7, pase: 7, tiro: 7, velocidad: 7, tactica: 7, disciplina: 7
                      },
                      strokeColor: '#94A3B8',
                      fillColor: 'rgba(148, 163, 184, 0.15)'
                    }
                  ]}
                />
              </div>
            </div>

            {/* Coach Qualitative Notes & Recommendations */}
            <div className="p-4 bg-[#F8F9FA] border border-neutral-200 rounded-lg mb-8">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Dictamen Pedagógico y Recomendaciones del Entrenador
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed italic mb-3">
                "{player.coachObservations}"
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-neutral-200">
                <div>
                  <strong className="text-emerald-700 block mb-1">Fortalezas Destacadas:</strong>
                  <ul className="list-disc list-inside text-neutral-600 space-y-0.5">
                    {player.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-amber-700 block mb-1">Objetivos de Próximo Ciclo:</strong>
                  <ul className="list-disc list-inside text-neutral-600 space-y-0.5">
                    {player.areasToImprove.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Signatures & Seal Section */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-neutral-300 text-center text-xs">
              <div>
                <div className="h-12 border-b border-neutral-400 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-neutral-700 text-sm">C. Entrenador R.</span>
                </div>
                <p className="font-bold text-neutral-900 mt-1">{coach.name}</p>
                <p className="text-[10px] text-neutral-500">Director Técnico Formativo</p>
                <p className="text-[9px] text-neutral-400 font-mono">Lic. {coach.licenseNumber}</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#3B59A8] p-1 flex items-center justify-center text-center">
                  <div className="text-[8px] font-bold text-[#3B59A8] leading-tight uppercase">
                    Sello Oficial<br/>Charales<br/>Chapala
                  </div>
                </div>
                <span className="text-[9px] text-neutral-400 mt-1">Certificación Deportiva</span>
              </div>

              <div>
                <div className="h-12 border-b border-neutral-400 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-neutral-700 text-sm">Lic. A. Barajas</span>
                </div>
                <p className="font-bold text-neutral-900 mt-1">Coordinación Deportiva</p>
                <p className="text-[10px] text-neutral-500">Club Charales de Chapala A.C.</p>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-8 pt-3 border-t border-neutral-200 text-center text-[9px] text-neutral-400">
              Este reporte fue generado por el Sistema de Control y Administración de la Escuela de Fútbol Infantil Charales de Chapala. Documento oficial para seguimiento deportivo y comunicación con padres de familia.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
