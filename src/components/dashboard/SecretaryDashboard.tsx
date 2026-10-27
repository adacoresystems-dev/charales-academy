import React, { useState } from 'react';
import {
  UserPlus,
  CreditCard,
  Shirt,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Player, Charge, UniformOrder, Match, Category } from '../../types';

interface SecretaryDashboardProps {
  players: Player[];
  charges: Charge[];
  uniformOrders: UniformOrder[];
  matches: Match[];
  categories: Category[];
  onNavigateTab: (tab: string) => void;
  onOpenNewPlayerModal: () => void;
  onGenerateMonthlyCharges: (periodo: string, vencimiento: string) => number;
}

export const SecretaryDashboard: React.FC<SecretaryDashboardProps> = ({
  players,
  charges,
  uniformOrders,
  matches,
  categories,
  onNavigateTab,
  onOpenNewPlayerModal,
  onGenerateMonthlyCharges,
}) => {
  const [generationSuccessMsg, setGenerationSuccessMsg] = useState<string | null>(null);

  const pendingUniforms = uniformOrders.filter((o) => o.estado === 'SOLICITADO' || o.estado === 'PAGADO');
  const activeCount = players.filter((p) => p.estatus === 'ACTIVO').length;

  const currentMonthCharges = charges.filter((c) => c.periodo === '2026-10');
  const paidCount = currentMonthCharges.filter((c) => c.estado === 'PAGADO').length;
  const pendingCount = currentMonthCharges.filter((c) => c.estado === 'PENDIENTE' || c.estado === 'VENCIDO').length;

  const handleQuickMonthlyBatch = () => {
    const count = onGenerateMonthlyCharges('2026-10', '2026-10-15');
    if (count > 0) {
      setGenerationSuccessMsg(`¡Éxito! Se generaron ${count} mensualidades para los alumnos activos.`);
      setTimeout(() => setGenerationSuccessMsg(null), 5000);
    } else {
      setGenerationSuccessMsg('Todos los alumnos ya tienen generado su cargo para este periodo.');
      setTimeout(() => setGenerationSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#111111] to-[#1c2438] rounded-2xl p-6 sm:p-8 text-white shadow-xs border border-neutral-800">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E31B23]">
            Módulo de Atención & Secretaría Administrativa
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight mt-1">
            Gestión Rápida de Escuela y Familias
          </h1>
          <p className="text-sm text-neutral-300 mt-1">
            Atención a ventanilla, inscripciones de alumnos, cobro de mensualidades y entrega de prendas deportivas.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenNewPlayerModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#E31B23] hover:bg-[#c9151c] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Inscribir Alumno (1 Clic)</span>
            </button>
            <button
              onClick={() => onNavigateTab('finanzas')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#3B59A8] hover:bg-[#2d4480] text-white rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Cobrar en Ventanilla</span>
            </button>
            <button
              onClick={handleQuickMonthlyBatch}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E31B23]" />
              <span>Generar Mensualidades Octubre</span>
            </button>
          </div>
        </div>
      </div>

      {generationSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{generationSuccessMsg}</span>
        </div>
      )}

      {/* Grid of Key Actions & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Uniform Deliveries in Waiting */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Uniformes por Entregar</h3>
                <span className="text-xs text-slate-400">Listos en recepción</span>
              </div>
            </div>
            <span className="text-2xl font-black text-amber-600 tabular-nums">
              {pendingUniforms.length}
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {pendingUniforms.slice(0, 3).map((order) => (
              <div key={order.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">{order.jugadorNombre}</span>
                  <span className="text-[11px] text-slate-500">
                    {order.productoNombre} (Talla {order.talla})
                  </span>
                </div>
                <button
                  onClick={() => onNavigateTab('inventario')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-[11px]"
                >
                  Entregar
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('inventario')}
            className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 pt-2 block"
          >
            Ver todos los pedidos de uniformes →
          </button>
        </div>

        {/* Monthly Collection Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cobranza Octubre 2026</h3>
                <span className="text-xs text-slate-400">Progreso de recaudación</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {paidCount}/{paidCount + pendingCount} Alumnos
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Al corriente:</span>
              <span className="font-bold text-emerald-600">{paidCount} familias</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Pendiente / Vencido:</span>
              <span className="font-bold text-rose-600">{pendingCount} familias</span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{
                  width: `${(paidCount / Math.max(1, paidCount + pendingCount)) * 100}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('finanzas')}
            className="w-full text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 pt-3 block"
          >
            Abrir listado de cobranza y morosos →
          </button>
        </div>

        {/* Matches Scheduled This Weekend */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Jornada de Partidos</h3>
                <span className="text-xs text-slate-400">Próximos compromisos</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {matches
              .filter((m) => m.estado === 'PROGRAMADO')
              .slice(0, 2)
              .map((match) => (
                <div key={match.id} className="py-2.5">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{match.categoriaNombre}</span>
                    <span className="text-indigo-600">{match.hora}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    vs {match.equipoRival} ({match.fecha})
                  </div>
                  <div className="text-[11px] text-slate-400">{match.sede}</div>
                </div>
              ))}
          </div>

          <button
            onClick={() => onNavigateTab('partidos')}
            className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 pt-2 block"
          >
            Ver calendario completo de partidos →
          </button>
        </div>
      </div>
    </div>
  );
};
