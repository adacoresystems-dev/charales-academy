import React, { useState } from 'react';
import {
  Shirt,
  Package,
  Plus,
  CheckCircle,
  Truck,
  AlertCircle,
  Search,
  CheckCircle2,
  Box,
  Layers,
} from 'lucide-react';
import {
  UniformProduct,
  UniformOrder,
  SportsMaterial,
  Player,
  Role,
} from '../../types';

interface InventoryViewProps {
  products: UniformProduct[];
  orders: UniformOrder[];
  materials: SportsMaterial[];
  players: Player[];
  currentRole: Role;
  onOrderUniform: (
    jugadorId: number,
    productoId: number,
    talla: string,
    cantidad: number
  ) => void;
  onDeliverUniform: (orderId: number, recibidoPor: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  orders,
  materials,
  players,
  currentRole,
  onOrderUniform,
  onDeliverUniform,
}) => {
  const [activeTab, setActiveTab] = useState<'catalogo' | 'pedidos' | 'materiales'>('catalogo');
  const [orderModalProduct, setOrderModalProduct] = useState<UniformProduct | null>(null);

  // Deliver modal state
  const [deliverModalOrder, setDeliverModalOrder] = useState<UniformOrder | null>(null);
  const [recibidoPor, setRecibidoPor] = useState('');

  // Order form state
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(players[0]?.id || 1);
  const [selectedTalla, setSelectedTalla] = useState<string>('10');
  const [cantidad, setCantidad] = useState<number>(1);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  const canManage = currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA';

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalProduct) return;

    onOrderUniform(selectedPlayerId, orderModalProduct.id, selectedTalla, cantidad);
    setOrderModalProduct(null);
    setOrderSuccessMsg('Pedido de uniforme registrado. Se generó el cargo en su estado de cuenta.');
    setTimeout(() => setOrderSuccessMsg(null), 4000);
  };

  const handleConfirmDeliver = () => {
    if (deliverModalOrder && recibidoPor.trim()) {
      onDeliverUniform(deliverModalOrder.id, recibidoPor.trim());
      setDeliverModalOrder(null);
      setRecibidoPor('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Uniformes
          </h1>
          <p className="text-xs text-slate-500">
            Catálogo de kits oficiales Charales, pedidos de indumentaria por talla y control de entrega a alumnos
          </p>
        </div>
      </div>

      {orderSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{orderSuccessMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'catalogo'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>Catálogo de Uniformes Oficiales</span>
        </button>
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'pedidos'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Pedidos y Entregas ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('materiales')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'materiales'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Materiales de Entrenamiento</span>
        </button>
      </div>

      {/* TAB 1: UNIFORM CATALOG */}
      {activeTab === 'catalogo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Shirt className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{product.nombre}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.descripcion}</p>

                <div className="mt-3">
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    Tallas Disponibles:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {product.tallasDisponibles.map((t) => {
                      const stock = product.stockPorTalla[t] || 0;
                      return (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {t} ({stock} pzs)
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-lg font-black text-slate-900 tabular-nums font-mono">
                  ${product.precio} MXN
                </span>
                {canManage && (
                  <button
                    onClick={() => {
                      setOrderModalProduct(product);
                      setSelectedTalla(product.tallasDisponibles[0]);
                    }}
                    className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
                  >
                    Hacer Pedido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ORDERS & DELIVERIES */}
      {activeTab === 'pedidos' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Alumno Solicitante</th>
                  <th className="px-4 py-3.5">Producto & Talla</th>
                  <th className="px-4 py-3.5">Fecha Pedido</th>
                  <th className="px-4 py-3.5">Importe</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acción de Entrega</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {order.jugadorNombre}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 block">
                        {order.productoNombre}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Talla: {order.talla} · {order.cantidad} pza(s)
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{order.fechaSolicitud}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 tabular-nums">
                      ${order.montoTotal}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.estado === 'ENTREGADO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.estado === 'PAGADO'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.estado}
                      </span>
                      {order.recibidoPor && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Recibió: {order.recibidoPor}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {order.estado !== 'ENTREGADO' && canManage ? (
                        <button
                          onClick={() => {
                            setDeliverModalOrder(order);
                            setRecibidoPor(order.tutorNombre || 'Padre de Familia');
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                        >
                          Registrar Entrega
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px]">
                          ✓ Entregado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SPORTS TRAINING MATERIALS */}
      {activeTab === 'materiales' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                  {mat.categoria}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    mat.estado === 'Óptimo'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {mat.estado}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{mat.nombre}</h3>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Ubicación: {mat.ubicacion}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Disponibles en Campo:</span>
                <span className="font-mono font-bold text-slate-900 text-base tabular-nums">
                  {mat.cantidadDisponible} / {mat.cantidadTotal}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Order Uniform */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="font-bold text-base text-slate-900">
              Solicitar Uniforme para Alumno
            </h3>
            <p className="text-xs text-slate-500">
              {orderModalProduct.nombre} · ${orderModalProduct.precio} MXN
            </p>

            <form onSubmit={handleOrderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Seleccionar Alumno:
                </label>
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} {p.apellidoPaterno} ({p.categoriaActualNombre})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Talla:</label>
                  <select
                    value={selectedTalla}
                    onChange={(e) => setSelectedTalla(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {orderModalProduct.tallasDisponibles.map((t) => (
                      <option key={t} value={t}>
                        Talla {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cantidad:</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex justify-between font-bold text-slate-900">
                <span>Total a Cobrar:</span>
                <span className="font-mono text-emerald-700">
                  ${orderModalProduct.precio * cantidad} MXN
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderModalProduct(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirmar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Deliver Uniform (HU-055) */}
      {deliverModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="font-bold text-base text-slate-900">
              Registrar Entrega de Uniforme (HU-055)
            </h3>
            <p className="text-xs text-slate-500">
              Alumno: {deliverModalOrder.jugadorNombre} · {deliverModalOrder.productoNombre} (Talla {deliverModalOrder.talla})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nombre de quien recibe la prenda:
                </label>
                <input
                  type="text"
                  value={recibidoPor}
                  onChange={(e) => setRecibidoPor(e.target.value)}
                  placeholder="Ej. Usuario demo 04 (Padre)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeliverModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                disabled={!recibidoPor.trim()}
                onClick={handleConfirmDeliver}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs"
              >
                Confirmar Entrega
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
