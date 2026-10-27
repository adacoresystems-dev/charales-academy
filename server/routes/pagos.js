import { listRoute } from '../lib/list-route.js';

export default listRoute("pagos", "SELECT id,folio,jugador_id,tutor_id,fecha_pago,importe,forma_pago,estado,motivo_cancelacion,registrado_por,cancelado_por,cancelado_en FROM pagos ORDER BY fecha_pago DESC,id DESC");
