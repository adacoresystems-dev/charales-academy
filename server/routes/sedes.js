import { listRoute } from '../lib/list-route.js';

export default listRoute("sedes", "SELECT id,nombre,ubicacion,referencia,tipo_cancha,activo FROM sedes ORDER BY nombre,id");
