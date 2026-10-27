import { listRoute } from '../lib/list-route.js';

export default listRoute("entrenamientos", "SELECT * FROM sesiones_entrenamiento ORDER BY fecha DESC,hora_inicio DESC,id DESC");
