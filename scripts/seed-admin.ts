/**
 * Seed the first admin user into the database.
 *
 * Usage (local — reads DATABASE_URL from .env):
 *   pnpm db:seed-admin
 *
 * Usage (production — pass DB URL directly):
 *   pnpm db:seed-admin -- --db=<connection-string> --email=<email> --password=<password>
 */
import { Client } from 'pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';
import { crypto } from 'node:crypto';

// Load .env from monorepo root
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Parse CLI args
function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--([\w-]+)=(.+)$/);
    if (match) {
      args[match[1]] = match[2];
    }
  }
  return args;
}

const cliArgs = parseArgs();
const DATABASE_URL = cliArgs.db || process.env.DATABASE_URL;

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function seedAdmin() {
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set.');
    console.error('   For local:      Add DATABASE_URL to .env');
    console.error('   For production: pnpm db:seed-admin -- --db=postgresql://...');
    process.exit(1);
  }

  const isRemote = !DATABASE_URL.includes('localhost') && !DATABASE_URL.includes('127.0.0.1');
  console.log(isRemote ? '🌐 Targeting REMOTE database' : '🏠 Targeting LOCAL database');

  const args = cliArgs;
  const email = args.email || (await prompt('📧 Admin email: '));
  const name = args.name || (await prompt('👤 Admin name: ')) || 'Admin';
  const password = args.password || (await prompt('🔑 Admin password (min 8 chars): '));

  if (!email || !email.includes('@')) {
    console.error('❌ Invalid email address.');
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error('❌ Password must be at least 8 characters.');
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database.');

    // Ensure users table exists (aligned with main schema)
    const migrationPath = path.resolve(__dirname, '..', 'packages', 'core', 'migrations', '0001_create_users.sql');
    if (fs.existsSync(migrationPath)) {
      console.log('🔄 Ensuring users table exists...');
      await client.query(fs.readFileSync(migrationPath, 'utf-8'));
    }

    // Check existing
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log(`⚠️  User "${email}" already exists.`);
      process.exit(0);
    }

    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = crypto.randomUUID();

    // Insert (using main schema column names)
    const result = await client.query(
      `INSERT INTO users (id, email, name, password_hash, permissions)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name`,
      [userId, email, name, passwordHash, JSON.stringify(['*'])] // '*' for super admin
    );

    const admin = result.rows[0];
    console.log('\n🎉 First admin seeded successfully!');
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    process.exit(0);
  } catch (err: any) {
    console.error(`❌ Seed failed: ${err.message}`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedAdmin();
