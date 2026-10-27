import { listRoute } from '../lib/list-route.js';

export default listRoute("auditoria", "SELECT id,usuario_id,accion,modulo,entidad,entidad_id,descripcion,creado_en FROM auditoria ORDER BY creado_en DESC,id DESC", ["ADMINISTRADOR"]);
