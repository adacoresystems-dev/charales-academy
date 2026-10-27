import { listRoute } from '../lib/list-route.js';

export default listRoute("usuarios", "SELECT id,rol_id,nombre,apellido,email,activo,creado_en FROM usuarios ORDER BY id", ["ADMINISTRADOR"]);
