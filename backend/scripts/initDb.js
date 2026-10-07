import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'muskan_the_label';

  console.log(`Connecting to MySQL on ${host}:${port} as ${user}...`);

  try {
    // Step 1: Connect without DB to create database
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    console.log(`Creating database "${dbName}" if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.changeUser({ database: dbName });

    // Step 2: Read & Execute schema.sql
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Executing schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('Schema tables created successfully.');
    }

    // Step 3: Read & Execute seed.sql
    const seedPath = path.join(__dirname, '../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('Executing seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('Seed data inserted successfully.');
    }

    await connection.end();
    console.log('Database initialization complete!');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    return false;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase();
}

export default initDatabase;
