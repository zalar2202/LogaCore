import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth';

/**
 * Audit Log table for tracking all administrative actions across plugins.
 */
export const auditLogs = pgTable('audit_logs', {
    id: uuid('id').primaryKey().defaultRandom(),

    // Who did it?
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),

    // What was the action? (e.g., 'roles.create', 'cms.post.delete')
    action: text('action').notNull(),

    // Context (e.g., 'users-roles', 'cms')
    pluginId: text('plugin_id').notNull(),

    // Target resource (e.g., role ID, post ID)
    targetId: text('target_id'),

    // Detailed payload of what changed (before/after / record data)
    data: jsonb('data').$type<Record<string, any>>().default({}),

    // Client info (IP, UA) - Optional if needed
    metadata: jsonb('metadata').$type<{
        ip?: string;
        userAgent?: string;
    }>().default({}),

    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});
