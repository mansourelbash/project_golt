import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function executeQuery<T>(
  query: string,
  params?: any[]
): Promise<T> {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows as T;
  } finally {
    client.release();
  }
}
