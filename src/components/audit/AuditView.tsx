import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  User,
  Filter,
  CheckCircle2,
  XCircle,
  Lock,
  Search,
} from 'lucide-react';
import { AuditLog, Role } from '../../types';

interface AuditViewProps {
  auditLogs: AuditLog[];
  currentRole: Role;
}

export const AuditView: React.FC<AuditViewProps> = ({ auditLogs, currentRole }) => {
  const [activeTab, setActiveTab] = useState<'bitacora' | 'rbac'>('bitacora');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    return (
      `${log.accion} ${log.usuarioNombre} ${log.entidad} ${log.detalles}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const permissionsMatrix = [
    {
      modulo: 'Autenticación & Usuarios',
      admin: true,
      secretaria: false,
      entrenador: false,
      padre: false,
      nota: 'Gestión de cuentas y contraseñas',
    },
    {
      modulo: 'Inscripción y Altas de Alumnos',
      admin: true,
      secretaria: true,
      entrenador: false,
      padre: false,
      nota: 'Creación de expedientes y cálculo de edad',
    },
    {
      modulo: 'Cambio de Categoría con Historial',
      admin: true,
      secretaria: true,
      entrenador: false,
      padre: false,
      nota: 'Registro de promociones y avance deportivo',
    },
    {
      modulo: 'Toma de Asistencia en Cancha',
      admin: true,
      secretaria: true,
      entrenador: true,
      padre: false,
      nota: 'Registro rápido 1 toque presente/ausente',
    },
    {
      modulo: 'Programación de Partidos',
      admin: true,
      secretaria: true,
      entrenador: true,
      padre: false,
      nota: 'Definición de rivales, sedes y horarios',
    },
    {
      modulo: 'Registro de Marcadores Oficiales',
      admin: true,
      secretaria: true,
      entrenador: true,
      padre: false,
      nota: 'Marcadores, autores de goles y resumen',
    },
    {
      modulo: 'Caja y Cobranza de Mensualidades',
      admin: true,
      secretaria: true,
      entrenador: false,
      padre: false,
      nota: 'Cobro en ventanilla y emisión de recibos',
    },
    {
      modulo: 'Pasarela de Pago en Línea (Portal Familiar)',
      admin: true,
      secretaria: true,
      entrenador: false,
      padre: true,
      nota: 'Pago de mensualidad propia con tarjeta',
    },
    {
      modulo: 'Cancelación de Pagos & Reversiones',
      admin: true,
      secretaria: false,
      entrenador: false,
      padre: false,
      nota: 'Exclusivo Administrador con justificación',
    },
    {
      modulo: 'Evaluaciones y Reportes de Rendimiento',
      admin: true,
      secretaria: false,
      entrenador: true,
      padre: false,
      nota: 'Calificación técnica de 1 a 10 y radar',
    },
    {
      modulo: 'Consulta de Expedientes de sus Hijos',
      admin: true,
      secretaria: true,
      entrenador: false,
      padre: true,
      nota: 'Aislamiento estricto por tutor familiar',
    },
    {
      modulo: 'Chat Directo Entrenador - Padres',
      admin: true,
      secretaria: true,
      entrenador: true,
      padre: true,
      nota: 'Mensajería privada y justificaciones',
    },
    {
      modulo: 'Bitácora de Auditoría del Sistema',
      admin: true,
      secretaria: false,
      entrenador: false,
      padre: false,
      nota: 'Trazabilidad y seguridad informática',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Seguridad, Matriz RBAC y Auditoría del Sistema
          </h1>
          <p className="text-xs text-slate-500">
            Control de accesos por rol y registro cronológico inmutable de operaciones (EP01, HU-006, HU-007)
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('bitacora')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'bitacora'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Bitácora de Auditoría ({auditLogs.length} eventos)</span>
        </button>
        <button
          onClick={() => setActiveTab('rbac')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'rbac'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Matriz de Permisos por Rol (RBAC)</span>
        </button>
      </div>

      {/* TAB 1: AUDIT LOG (HU-007) */}
      {activeTab === 'bitacora' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar bitácora por usuario, entidad o acción (ej. PAGO, ALTA, CANCELACION)..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-100">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Fecha y Hora</th>
                    <th className="px-4 py-3.5">Usuario & Rol</th>
                    <th className="px-4 py-3.5">Acción</th>
                    <th className="px-4 py-3.5">Módulo / Entidad</th>
                    <th className="px-5 py-3.5">Detalles del Suceso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                        {log.fechaHora}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{log.usuarioNombre}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          {log.usuarioRol}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          {log.accion}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                        {log.entidad}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-md">
                        {log.detalles}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC MATRIX (HU-006) */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs">
              Definición de Privilegios por Perfil de Usuario
            </h3>
            <p className="text-[11px] text-slate-500">
              Garantiza la privacidad y restricción de funciones administrativas y financieras
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Funcionalidad del Sistema</th>
                  <th className="px-4 py-3.5 text-center">Administrador</th>
                  <th className="px-4 py-3.5 text-center">Secretaría</th>
                  <th className="px-4 py-3.5 text-center">Entrenador</th>
                  <th className="px-4 py-3.5 text-center">Padre de Familia</th>
                  <th className="px-5 py-3.5">Descripción de Regla</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {permissionsMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.modulo}</td>
                    <td className="px-4 py-3.5 text-center">
                      {item.admin ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {item.secretaria ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {item.entrenador ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {item.padre ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-[11px]">{item.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
