import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Receipt,
  Search,
  Filter,
  Ban,
  Printer,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Charge, Payment, PaymentMethod, Role, ChargeConcept } from '../../types';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { ReceiptModal } from './ReceiptModal';

interface FinanceViewProps {
  charges: Charge[];
  payments: Payment[];
  chargeConcepts: ChargeConcept[];
  currentRole: Role;
  onGenerateMonthlyCharges: (periodo: string, vencimiento: string) => number;
  onRegisterPayment: (
    chargeIds: number[],
    formaPago: PaymentMethod,
    tutorId?: number,
    tutorNombre?: string
  ) => Payment | null;
  onCancelPayment: (paymentId: number, motivo: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  charges,
  payments,
  chargeConcepts,
  currentRole,
  onGenerateMonthlyCharges,
  onRegisterPayment,
  onCancelPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'cargos' | 'pagos'>('cargos');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [selectedChargeForPay, setSelectedChargeForPay] = useState<Charge | null>(null);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<Payment | null>(null);
  const [paymentToCancel, setPaymentToCancel] = useState<Payment | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [batchSuccessMsg, setBatchSuccessMsg] = useState<string | null>(null);

  const isAdmin = currentRole === 'ADMINISTRADOR';
  const isSecretary = currentRole === 'SECRETARIA';
  const canManagePayments = isAdmin || isSecretary;

  // KPIs
  const totalCollected = payments
    .filter((p) => p.estado === 'APLICADO')
    .reduce((sum, p) => sum + p.importe, 0);

  const pendingDebt = charges
    .filter((c) => c.estado === 'PENDIENTE' || c.estado === 'VENCIDO')
    .reduce((sum, c) => sum + (c.montoFinal - c.montoPagado), 0);

  const overdueCharges = charges.filter((c) => c.estado === 'VENCIDO');

  const filteredCharges = charges.filter((c) => {
    const matchesSearch =
      `${c.jugadorNombre} ${c.conceptoNombre} ${c.periodo || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter((p) => {
    return (
      `${p.folio} ${p.jugadorNombre} ${p.formaPago}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const handleGenerateBatch = () => {
    const count = onGenerateMonthlyCharges('2026-10', '2026-10-15');
    if (count > 0) {
      setBatchSuccessMsg(`¡Éxito! Se generaron ${count} mensualidades del ciclo 2026-10.`);
    } else {
      setBatchSuccessMsg('Todos los alumnos ya contaban con su cargo de este mes.');
    }
    setTimeout(() => setBatchSuccessMsg(null), 5000);
  };

  const handleConfirmCancelPayment = () => {
    if (paymentToCancel && cancellationReason.trim()) {
      onCancelPayment(paymentToCancel.id, cancellationReason.trim());
      setPaymentToCancel(null);
      setCancellationReason('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Pagos y Cobranza
          </h1>
          <p className="text-xs text-slate-500">
            Control financiero de mensualidades, pasarela de cobro, recibos oficiales y saldos deudores
          </p>
        </div>

        {canManagePayments && (
          <button
            onClick={handleGenerateBatch}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar Mensualidades Octubre (HU-044)</span>
          </button>
        )}
      </div>

      {batchSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{batchSuccessMsg}</span>
        </div>
      )}

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Ingresos Totales Recaudados</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums mt-1 font-mono">
            ${totalCollected.toLocaleString()} MXN
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            {payments.filter((p) => p.estado === 'APLICADO').length} pagos acreditados
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Adeudos Pendientes de Cobro</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tabular-nums mt-1 font-mono">
            ${pendingDebt.toLocaleString()} MXN
          </div>
          <span className="text-[11px] text-rose-600 font-semibold block mt-1">
            {overdueCharges.length} mensualidades en estado vencido
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Conceptos Activos</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tabular-nums mt-1">
            {chargeConcepts.length}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Mensualidades, kits y seguros
          </span>
        </div>
      </div>

      {/* Segmented View Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('cargos')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'cargos'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Estado de Cuenta & Cargos ({charges.length})
        </button>
        <button
          onClick={() => setActiveTab('pagos')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'pagos'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Historial de Recibos y Pagos ({payments.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por alumno, concepto o folio..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {activeTab === 'cargos' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          >
            <option value="all">Todos los Estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="VENCIDO">Vencidos (Morosos)</option>
            <option value="PAGADO">Pagados</option>
          </select>
        )}
      </div>

      {/* TAB 1: CHARGES LIST */}
      {activeTab === 'cargos' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Alumno</th>
                  <th className="px-4 py-3.5">Concepto / Periodo</th>
                  <th className="px-4 py-3.5">Vencimiento</th>
                  <th className="px-4 py-3.5">Monto Final</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCharges.map((charge) => (
                  <tr key={charge.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {charge.jugadorNombre}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 block">
                        {charge.conceptoNombre}
                      </span>
                      {charge.periodo && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Periodo: {charge.periodo}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {charge.fechaVencimiento}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 tabular-nums">
                      ${charge.montoFinal}
                      {charge.descuento > 0 && (
                        <span className="text-[10px] text-emerald-700 block font-normal">
                          (Desc. -${charge.descuento})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          charge.estado === 'PAGADO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : charge.estado === 'VENCIDO'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {charge.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {charge.estado !== 'PAGADO' ? (
                        <button
                          onClick={() => setSelectedChargeForPay(charge)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                        >
                          Pagar / Cobrar
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Liquidado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS HISTORY */}
      {activeTab === 'pagos' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Folio Recibo</th>
                  <th className="px-4 py-3.5">Alumno</th>
                  <th className="px-4 py-3.5">Fecha</th>
                  <th className="px-4 py-3.5">Forma de Pago</th>
                  <th className="px-4 py-3.5">Importe</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {payment.folio}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {payment.jugadorNombre}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{payment.fecha}</td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-700">
                      {payment.formaPago}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 tabular-nums">
                      ${payment.importe}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          payment.estado === 'APLICADO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {payment.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedPaymentForReceipt(payment)}
                          className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors flex items-center gap-1"
                          title="Imprimir Comprobante"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Recibo</span>
                        </button>

                        {/* Admin Only: Cancel Payment with Reason (HU-049) */}
                        {isAdmin && payment.estado === 'APLICADO' && (
                          <button
                            onClick={() => setPaymentToCancel(payment)}
                            className="p-1 text-slate-400 hover:text-rose-700 rounded-lg transition-colors"
                            title="Cancelar pago (solo Administrador)"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {selectedChargeForPay && (
        <PaymentGatewayModal
          charge={selectedChargeForPay}
          onClose={() => setSelectedChargeForPay(null)}
          onConfirmPayment={onRegisterPayment}
        />
      )}

      {/* Official Receipt Printable Modal */}
      {selectedPaymentForReceipt && (
        <ReceiptModal
          payment={selectedPaymentForReceipt}
          onClose={() => setSelectedPaymentForReceipt(null)}
        />
      )}

      {/* Cancel Payment Confirmation Dialog (HU-049) */}
      {paymentToCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cancelar Pago Financiero (HU-049)
                </h3>
                <span className="text-xs text-slate-500">Folio: {paymentToCancel.folio}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Esta acción revertirá los cargos asociados a estado pendiente y registrará un asiento de trazabilidad en la auditoría del sistema.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Motivo obligatorio de cancelación:
              </label>
              <textarea
                rows={3}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Ej. Error en forma de cobro, folio duplicado, cheque devuelto..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPaymentToCancel(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cerrar
              </button>
              <button
                disabled={!cancellationReason.trim()}
                onClick={handleConfirmCancelPayment}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
              >
                Revertir y Cancelar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
