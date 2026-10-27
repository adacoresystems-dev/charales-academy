import { app } from './app.js';
import { config } from './config/env.js';
import { pool } from './config/db.js';

const server = app.listen(config.port, config.host, () => {
  console.log(`API Charales disponible en http://${config.host}:${config.port}/api`);
});
async function shutdown() {
  server.close(async () => { await pool.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
