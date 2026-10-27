import { listRoute } from '../lib/list-route.js';

export default listRoute("categorias", "SELECT id,temporada_id,nombre,edad_minima,edad_maxima,cupo_maximo,activo FROM categorias ORDER BY nombre,id");
