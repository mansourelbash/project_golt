import * as dotenv from 'dotenv';
import { Pool } from '@neondatabase/serverless';

dotenv.config();

async function testRegister() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Try to create a test user
    const email = 'test@example.com';
    const name = 'Test User';
    const password = 'password123';

    // First check if the user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    console.log('Checking for existing user...');
    if (existingUser.rows.length > 0) {
      console.log('User already exists');
    } else {
      // Create the user
      const result = await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
        [email, password, name]
      );
      console.log('User created successfully:', result.rows[0]);
    }

    // List all users
    const allUsers = await pool.query('SELECT id, email, name FROM users');
    console.log('\nAll users in database:');
    console.log(allUsers.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

testRegister().catch(console.error);
