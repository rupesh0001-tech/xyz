import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Simple database connection without SSL complications
const connectionString = process.env.DATABASE_URL.replace('?sslmode=disable', '');
export const sql = postgres(connectionString, {
  ssl: false,
  max: 1,
});
export const db = drizzle(sql, { schema });
