import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const roles = pgTable('roles', {
    id: text('id').primaryKey(), // e.g., 'admin', 'editor', 'agent'
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

export const rolePermissions = pgTable('role_permissions', {
    roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
    permission: text('permission').notNull(), // e.g., 'cms.read', 'cms.*'
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (t) => [
    primaryKey({ columns: [t.roleId, t.permission] }),
]);

export const userRoles = pgTable('user_roles', {
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (t) => [
    primaryKey({ columns: [t.userId, t.roleId] }),
]);
