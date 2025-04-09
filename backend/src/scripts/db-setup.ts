import { exec } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const runCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`Command warning: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};

const setupPostgres = async (): Promise<void> => {
  try {
    console.log('Setting up PostgreSQL database...');
    
    // Create a temporary .env file for PostgreSQL
    const envPath = path.join(process.cwd(), '.env');
    const originalEnv = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    
    // Make sure DATABASE_URL is set to PostgreSQL
    const postgresUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/itinerary_planner?schema=public';
    fs.writeFileSync(envPath, `DATABASE_URL="${postgresUrl}"\n`);
    
    // Run migrations
    await runCommand('npx prisma migrate dev --name init');
    
    // Restore original .env
    if (originalEnv) {
      fs.writeFileSync(envPath, originalEnv);
    }
    
    console.log('PostgreSQL setup complete!');
  } catch (error) {
    console.error('Failed to set up PostgreSQL:', error);
    throw error;
  }
};

const setupSqlite = async (): Promise<void> => {
  try {
    console.log('Setting up SQLite database...');
    
    // Create a temporary .env file for SQLite
    const envPath = path.join(process.cwd(), '.env');
    const originalEnv = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    
    // Set DATABASE_URL to SQLite
    const sqliteUrl = process.env.DATABASE_URL_SQLITE || 'file:./dev.db';
    fs.writeFileSync(envPath, `DATABASE_URL="${sqliteUrl}"\n`);
    
    // Run migrations
    await runCommand('npx prisma migrate dev --name init');
    
    // Restore original .env
    if (originalEnv) {
      fs.writeFileSync(envPath, originalEnv);
    }
    
    console.log('SQLite setup complete!');
  } catch (error) {
    console.error('Failed to set up SQLite:', error);
    throw error;
  }
};

const main = async (): Promise<void> => {
  const dbType = process.argv[2]?.toLowerCase();
  
  if (!dbType || dbType === 'all') {
    await setupPostgres();
    await setupSqlite();
  } else if (dbType === 'postgres') {
    await setupPostgres();
  } else if (dbType === 'sqlite') {
    await setupSqlite();
  } else {
    console.error('Invalid database type. Use "postgres", "sqlite", or "all"');
    process.exit(1);
  }
};

main()
  .then(() => {
    console.log('Database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
