# LogaCore – DB & Plugin Guide (v0.1)

This guide explains how plugins should interact with the database using Drizzle.

## 1. Importing the DB Client

Plugins should NOT initialize their own database connections. They must use the shared client from `@logacore/db`.

```typescript
import { db } from '@logacore/db';
```

## 2. Defining Plugin Schemas

Each plugin should define its own tables in `plugins/<id>/src/db/schema.ts`.

Example: `plugins/my-plugin/src/db/schema.ts`

```typescript
import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';

export const myPluginItems = pgTable('my_plugin_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## 3. SQL Migrations

Plugins are responsible for their own SQL migrations. 
The core migration runner scans `plugins/<id>/migrations/*.sql`.

- Files must be named with a numeric prefix (e.g., `0001_initial.sql`).
- Only `.sql` files are supported in v0.1.
- Use `pnpm db:migrate` from the root to apply all plugin migrations.

## 4. Why separate SQL from Drizzle?

In v0.1, we use **plugin-owned SQL migrations** instead of Drizzle-generated migrations to:
1. Ensure plugins are self-contained.
2. Avoid a complex central schema merge at build time.
3. Provide a clear path for future "runtime" plugin installations where SQL might be preferred.

Drizzle is used primarily as a **type-safe query builder** and for **declarative schema definitions** within the code.

## 5. Best Practices

- Always use the shared connection pool via `@logacore/db`.
- Use unique table names (prefixed with plugin id) to avoid collisions.
- Keep migrations independent.
