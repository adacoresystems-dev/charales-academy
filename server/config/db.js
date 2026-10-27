import mysql from 'mysql2/promise';
import { config } from './env.js';

export const pool = mysql.createPool(config.database);

// Todo el trabajo de la transacción usa LA MISMA conexión.
export async function withTransaction(work) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
