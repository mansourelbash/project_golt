import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function runMigration() {
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
    console.log('Starting migrations...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Found' : 'Missing');
    
    const migrationsPath = path.join(process.cwd(), '..', 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsPath).sort();
    
    for (const file of migrationFiles) {
      if (!file.endsWith('.sql')) continue;
      
      console.log(`Running migration: ${file}`);
      const migrationPath = path.join(migrationsPath, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      try {
        await pool.query(migrationSQL);
        console.log(`Migration ${file} completed successfully!`);
      } catch (error) {
        console.error(`Error executing migration ${file}:`, error);
        throw error;
      }
    }
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration
runMigration().catch(console.error);
