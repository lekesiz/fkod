import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'fkod_db',
  user: process.env.DB_USER || 'fkod_user',
  password: process.env.DB_PASSWORD || 'fkod_password_secure',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
