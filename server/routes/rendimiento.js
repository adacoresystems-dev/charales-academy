import { listRoute } from '../lib/list-route.js';

export default listRoute("rendimiento", "SELECT * FROM evaluaciones_rendimiento ORDER BY fecha_evaluacion DESC,id DESC");
