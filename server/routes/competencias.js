import { listRoute } from '../lib/list-route.js';

export default listRoute("competencias", "SELECT * FROM competencias ORDER BY fecha_inicio DESC,id DESC");
