import { listRoute } from '../lib/list-route.js';

export default listRoute("inscripciones", "SELECT id,jugador_id,temporada_id,fecha_inscripcion,monto,estatus FROM inscripciones ORDER BY fecha_inscripcion DESC,id DESC");
