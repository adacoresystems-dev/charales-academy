import { listRoute } from '../lib/list-route.js';

export default listRoute("uniformes", "SELECT * FROM pedidos_uniforme ORDER BY fecha_solicitud DESC,id DESC");
