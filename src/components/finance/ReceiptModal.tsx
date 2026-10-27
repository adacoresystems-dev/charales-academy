import React from 'react';
import { X, Printer, Shield, CheckCircle2 } from 'lucide-react';
import { Payment } from '../../types';

interface ReceiptModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, onClose }) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Comprobante Oficial de Cobranza (HU-048)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Receipt */}
        <div className="p-6 bg-white space-y-5 text-xs text-slate-700" id="printable-receipt">
          {/* Header */}
          <div className="text-center space-y-1 border-b border-slate-200 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-base flex items-center justify-center mx-auto mb-2">
              ⚽
            </div>
            <h2 className="text-lg font-display font-extrabold text-slate-900 tracking-tight">
              Escuela de Futbol Charales de Chapala
            </h2>
            <p className="text-[11px] text-slate-500">
              Campo Deportivo Municipal Usuario Rayo · Chapala, Jalisco · RFC: RFC DE DEMOSTRACIÓN
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-slate-100 rounded-full font-mono font-bold text-xs text-slate-800">
                Folio: {payment.folio}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 py-2 border-b border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha de Emisión:</span>
              <span className="font-semibold text-slate-900">{payment.fecha}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Alumno:</span>
              <span className="font-bold text-slate-900">{payment.jugadorNombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tutor Responsable:</span>
              <span className="font-medium text-slate-800">
                {payment.tutorNombre || 'Familia Usuario'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Forma de Pago:</span>
              <span className="font-semibold text-emerald-700">{payment.formaPago}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estado de Transacción:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  payment.estado === 'APLICADO'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {payment.estado}
              </span>
            </div>
          </div>

          {/* Applied Items */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">Conceptos Liquidados:</span>
            <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
              {payment.cargosAplicados.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-slate-700">{item.conceptoNombre}</span>
                  <span className="font-mono font-bold text-slate-900">${item.importe}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-2 border-t-2 border-dashed border-slate-200 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">Total Recibido:</span>
            <span className="text-xl font-mono font-black text-slate-900">
              ${payment.importe.toLocaleString()} MXN
            </span>
          </div>

          {/* Footer Digital Stamp */}
          <div className="pt-4 text-center text-[10px] text-slate-400 space-y-1 border-t border-slate-100">
            <p>Comprobante digital para efectos administrativos de la escuela deportiva.</p>
            <p className="font-mono">Sello: 8F2A-99B1-4472-EC01-CHARALES-CHAPALA</p>
          </div>
        </div>
      </div>
    </div>
  );
};
