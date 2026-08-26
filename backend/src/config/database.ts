import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const access: PoolOptions = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'canteen_management',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4',
};

export const pool: Pool = mysql.createPool(access);

export async function testDbConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database:', process.env.DB_NAME || 'canteen_management');
    connection.release();
    return true;
  } catch (error: any) {
    console.warn('⚠️ Warning: Could not connect to MySQL server (' + error.message + '). API will run in resilient demo mode.');
    return false;
  }
}
