import { db, schema } from './index';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'admin@logacore.dev';
const ADMIN_PASSWORD = 'admin123';

async function seed() {
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, ADMIN_EMAIL));

  if (existing.length > 0) {
    console.log('Admin user already exists, skipping seed.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await db.insert(schema.users).values({
    name: 'Admin',
    email: ADMIN_EMAIL,
    passwordHash,
    permissions: ['hello.read'],
  });

  console.log(`Seeded admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
