import { listRoute } from '../lib/list-route.js';

export default listRoute("temporadas", "SELECT id,nombre,fecha_inicio,fecha_fin,activa,es_actual FROM temporadas ORDER BY fecha_inicio DESC,id DESC");
