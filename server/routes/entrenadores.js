import { listRoute } from '../lib/list-route.js';

export default listRoute("entrenadores", "SELECT id,usuario_id,nombre,apellido_paterno,apellido_materno,telefono,email,licencia,titulo,foto_url,anio_inicio_experiencia,activo FROM entrenadores ORDER BY apellido_paterno,nombre,id");
