import { exec } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const runCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command}`);
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

const updateSchemaProvider = (provider: 'postgresql' | 'sqlite'): void => {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Use a more precise regex to only replace the provider line in the datasource block
  const providerRegex = /(datasource\s+db\s+{\s*\n\s*)provider(\s*=\s*)"[^"]*"/;
  const replacement = `$1provider$2"${provider}"`;
  
  schema = schema.replace(providerRegex, replacement);
  fs.writeFileSync(schemaPath, schema);
  
  console.log(`Updated schema.prisma to use ${provider} provider`);
};

const setupPostgres = async (): Promise<void> => {
  try {
    console.log('Setting up PostgreSQL database...');
    
    // Create a temporary .env file for PostgreSQL
    const envPath = path.join(process.cwd(), '.env.temp');
    const originalEnv = fs.existsSync(path.join(process.cwd(), '.env')) 
      ? fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8') 
      : '';
    
    // Make sure DATABASE_URL is set to PostgreSQL
    const postgresUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/itinerary_planner?schema=public';
    fs.writeFileSync(envPath, `DATABASE_URL="${postgresUrl}"\nACTIVE_DATABASE="postgres"\n`);
    
    // Temporarily rename the .env.temp to .env
    if (fs.existsSync(path.join(process.cwd(), '.env'))) {
      fs.renameSync(path.join(process.cwd(), '.env'), path.join(process.cwd(), '.env.backup'));
    }
    fs.renameSync(envPath, path.join(process.cwd(), '.env'));
    
    // Update the schema.prisma file to use PostgreSQL
    updateSchemaProvider('postgresql');
    
    // Generate Prisma client
    await runCommand('npx prisma generate');
    
    // Run migrations
    try {
      await runCommand('npx prisma migrate dev --name init');
    } catch (error) {
      console.error('Failed to run migrations for PostgreSQL. You may need to start your PostgreSQL server or check your connection details.');
    }
    
    // Restore original .env
    if (fs.existsSync(path.join(process.cwd(), '.env.backup'))) {
      fs.renameSync(path.join(process.cwd(), '.env'), path.join(process.cwd(), '.env.temp'));
      fs.renameSync(path.join(process.cwd(), '.env.backup'), path.join(process.cwd(), '.env'));
      fs.unlinkSync(path.join(process.cwd(), '.env.temp'));
    }
    
    console.log('PostgreSQL setup complete!');
  } catch (error) {
    console.error('Failed to set up PostgreSQL:', error);
    
    // Restore original .env if it exists
    if (fs.existsSync(path.join(process.cwd(), '.env.backup'))) {
      fs.renameSync(path.join(process.cwd(), '.env.backup'), path.join(process.cwd(), '.env'));
    }
    
    throw error;
  }
};

const setupSqlite = async (): Promise<void> => {
  try {
    console.log('Setting up SQLite database...');
    
    // Create a temporary .env file for SQLite
    const envPath = path.join(process.cwd(), '.env.temp');
    const originalEnv = fs.existsSync(path.join(process.cwd(), '.env')) 
      ? fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8') 
      : '';
    
    // Set DATABASE_URL to SQLite
    const sqliteUrl = process.env.DATABASE_URL_SQLITE || 'file:./prisma/dev.db';
    fs.writeFileSync(envPath, `DATABASE_URL="${sqliteUrl}"\nACTIVE_DATABASE="sqlite"\n`);
    
    // Temporarily rename the .env.temp to .env
    if (fs.existsSync(path.join(process.cwd(), '.env'))) {
      fs.renameSync(path.join(process.cwd(), '.env'), path.join(process.cwd(), '.env.backup'));
    }
    fs.renameSync(envPath, path.join(process.cwd(), '.env'));
    
    // Update the schema.prisma file to use SQLite
    updateSchemaProvider('sqlite');
    
    // Generate Prisma client
    await runCommand('npx prisma generate');
    
    // Run migrations
    await runCommand('npx prisma migrate dev --name init');
    
    // Restore original .env
    if (fs.existsSync(path.join(process.cwd(), '.env.backup'))) {
      fs.renameSync(path.join(process.cwd(), '.env'), path.join(process.cwd(), '.env.temp'));
      fs.renameSync(path.join(process.cwd(), '.env.backup'), path.join(process.cwd(), '.env'));
      fs.unlinkSync(path.join(process.cwd(), '.env.temp'));
    }
    
    console.log('SQLite setup complete!');
  } catch (error) {
    console.error('Failed to set up SQLite:', error);
    
    // Restore original .env if it exists
    if (fs.existsSync(path.join(process.cwd(), '.env.backup'))) {
      fs.renameSync(path.join(process.cwd(), '.env.backup'), path.join(process.cwd(), '.env'));
    }
    
    throw error;
  }
};

const main = async (): Promise<void> => {
  const dbType = process.argv[2]?.toLowerCase();
  
  if (!dbType || dbType === 'all') {
    try {
      await setupPostgres();
    } catch (error) {
      console.warn('PostgreSQL setup failed, continuing with SQLite setup');
    }
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
