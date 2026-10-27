import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Lock,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Receipt,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Charge, PaymentMethod, Payment } from '../../types';

interface PaymentGatewayModalProps {
  charge: Charge | null;
  onClose: () => void;
  onConfirmPayment: (
    chargeIds: number[],
    method: PaymentMethod,
    tutorId?: number,
    tutorNombre?: string
  ) => Payment | null;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  charge,
  onClose,
  onConfirmPayment,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('TARJETA');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8829');
  const [cardHolder, setCardHolder] = useState('TUTOR DEMO 01');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null);

  if (!charge) return null;

  const amountToPay = charge.montoFinal - charge.montoPagado;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const payment = onConfirmPayment([charge.id], method, 1, 'Usuario demo 04');
      setIsProcessing(false);
      setCompletedPayment(payment);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Pasarela de Pagos Segura
              </h3>
              <span className="text-xs text-slate-400">
                Acreditación inmediata de mensualidad
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!completedPayment ? (
          <form onSubmit={handleProcessPayment} className="mt-4 space-y-4 text-xs">
            {/* Charge Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Concepto de Cobro:</span>
                <span className="font-bold text-slate-900">{charge.conceptoNombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alumno:</span>
                <span className="font-semibold text-slate-800">{charge.jugadorNombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha Límite:</span>
                <span className="font-medium text-slate-700">{charge.fechaVencimiento}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Total a Pagar:</span>
                <span className="text-2xl font-black text-emerald-600 tabular-nums font-mono">
                  ${amountToPay.toLocaleString()} MXN
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Método de Pago:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'TARJETA', label: 'Tarjeta Débito/Crédito' },
                  { id: 'TRANSFERENCIA', label: 'SPEI / Transf.' },
                  { id: 'EFECTIVO', label: 'Efectivo en Caja' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as PaymentMethod)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                      method === m.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Card Fields */}
            {method === 'TARJETA' && (
              <div className="space-y-3 p-4 bg-slate-900 text-white rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Tarjeta Guardada para Pagos
                  </span>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Titular</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Vence</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs text-center focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs text-center focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Transacción cifrada TLS 256-bit y comprobante fiscal digital emitido al instante.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <span>Procesando pago...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pagar ${amountToPay}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Payment Success Confirmation & Printable Receipt */
          <div className="py-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                ¡Pago Acreditado Exitosamente!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                El saldo ha sido actualizado en tiempo real en el estado de cuenta del alumno.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
                <span>Comprobante Oficial</span>
                <span className="font-mono text-emerald-700">{completedPayment.folio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha y Hora:</span>
                <span className="font-medium text-slate-800">{completedPayment.fecha}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alumno:</span>
                <span className="font-bold text-slate-800">{completedPayment.jugadorNombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Forma de Pago:</span>
                <span className="font-medium text-slate-800">{completedPayment.formaPago}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-extrabold text-slate-900">
                <span>Importe Acreditado:</span>
                <span className="text-emerald-700 font-mono">${completedPayment.importe} MXN</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Recibo</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
