import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Make sure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in .env");
}

// Connect to Supabase with SSL
const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }, // required for Supabase
  max: 5, // optional connection pool size
});

// Export Drizzle instance
export const db = drizzle(sql, { schema });
export default sql;
