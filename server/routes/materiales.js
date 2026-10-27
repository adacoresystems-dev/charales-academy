import { listRoute } from '../lib/list-route.js';

export default listRoute("materiales", "SELECT * FROM materiales_deportivos ORDER BY nombre,id");
