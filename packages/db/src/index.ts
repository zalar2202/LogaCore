import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in .env');
}

// For migrations and long-running processes
const client = postgres(connectionString);
export const db = drizzle(client);

// For edge environments or connection pooling (optional in v0.1)
// export const pool = ...
