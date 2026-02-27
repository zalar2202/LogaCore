import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as schema from './schema';

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ DATABASE_URL is not defined. Database features will fail if called.');
}

// During build/CI, we allow a dummy or empty connection string to prevent crashes
const effectiveConnectionString = connectionString || 'postgresql://postgres:password@localhost:5432/logacore';

const client = postgres(effectiveConnectionString);
export const db = drizzle(client, { schema });

export { schema };
