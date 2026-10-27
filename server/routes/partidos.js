import { listRoute } from '../lib/list-route.js';

export default listRoute("partidos", "SELECT * FROM partidos ORDER BY fecha DESC,hora DESC,id DESC");
