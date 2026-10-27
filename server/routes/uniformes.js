import { listRoute } from '../lib/list-route.js';

export default listRoute("uniformes", "SELECT p.id AS producto_id,p.nombre,p.descripcion,p.imagen_url,v.id AS variante_id,v.talla,v.precio,v.existencias FROM productos_uniforme p LEFT JOIN variantes_uniforme v ON v.producto_id=p.id WHERE p.activo=TRUE ORDER BY p.id,v.id");
