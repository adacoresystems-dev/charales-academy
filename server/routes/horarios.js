import { listRoute } from '../lib/list-route.js';

export default listRoute("entrenamientos", "SELECT id,categoria_id,sede_id,dia_semana,hora_inicio,hora_fin,activo FROM horarios_entrenamiento ORDER BY categoria_id,dia_semana,hora_inicio,id");
