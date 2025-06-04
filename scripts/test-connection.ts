import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('Testing database connection...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Try to query the database
    const result = await pool.query('SELECT NOW()');
    console.log('Connection successful!');
    console.log('Server time:', result.rows[0].now);

    // Try to list tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('\nExisting tables:');
    console.log(tables.rows.map(row => row.table_name));
    
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

testConnection().catch(console.error);
