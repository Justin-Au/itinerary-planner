  import { prisma } from 'db';
import dotenv from 'dotenv';

dotenv.config();

// Determine which database to use based on environment
const getDatabaseUrl = (): string => {
  const activeDatabase = process.env.ACTIVE_DATABASE?.toLowerCase() || 'postgres';
  
  if (activeDatabase === 'sqlite') {
    console.log('Using SQLite database for mobile development');
    return process.env.DATABASE_URL_SQLITE || 'file:./prisma/dev.db';
  }
  
  // Default to PostgreSQL for web development
  console.log('Using PostgreSQL database for web development');
  return process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/itinerary_planner?schema=public';
};

// Set the DATABASE_URL environment variable for the db package to use
process.env.DATABASE_URL = getDatabaseUrl();

// Export the prisma instance from the db package
export default prisma;
