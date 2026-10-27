import { listRoute } from '../lib/list-route.js';

export default listRoute("tutores", "SELECT id,usuario_id,nombre,apellido_paterno,apellido_materno,telefono,email,direccion,ocupacion FROM tutores ORDER BY apellido_paterno,nombre,id");
