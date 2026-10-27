import { listRoute } from '../lib/list-route.js';

export default listRoute("pagos", "SELECT * FROM v_estado_cuenta ORDER BY fecha_cargo DESC,cargo_id DESC");
