import { listRoute } from '../lib/list-route.js';

export default listRoute("competencias", "SELECT * FROM clasificacion_competencia ORDER BY competencia_categoria_id,puntos DESC,diferencia_goles DESC,goles_favor DESC,id");
