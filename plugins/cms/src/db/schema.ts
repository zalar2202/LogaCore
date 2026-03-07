import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { schema } from '@logacore/db';

/**
 * CMS Posts table definition.
 * 
 * Modularity rule: Table names are prefixed with 'cms_'
 */
export const posts = pgTable('cms_posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: text('content'),
    status: text('status').notNull().default('draft'), // draft, published
    authorId: uuid('author_id').references(() => schema.users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => {
    return [
        index('idx_cms_posts_slug').on(table.slug),
    ];
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
