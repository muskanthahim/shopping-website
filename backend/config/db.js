import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'muskan_the_label',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to test DB connection
export const checkDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

export default pool;
