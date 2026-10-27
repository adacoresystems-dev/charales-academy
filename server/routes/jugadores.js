import { listRoute } from '../lib/list-route.js';

export default listRoute("jugadores", "SELECT id,identificador,nombre,apellido_paterno,apellido_materno,fecha_nacimiento,sexo,estatus,estado_deportivo,posicion_habitual,numero_camiseta,foto_url FROM jugadores ORDER BY apellido_paterno,nombre,id");
