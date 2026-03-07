import { pgTable, uuid, text, timestamp, index, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { schema } from '@logacore/db';

/**
 * CMS Pages Table
 * Represents a publishable container with a unique slug and SEO metadata.
 */
export const pages = pgTable('cms_pages', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    status: text('status').notNull().default('draft'), // draft, published, archived
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),

    authorId: text('author_id').references(() => schema.users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
}, (table) => {
    return [
        index('idx_cms_pages_slug').on(table.slug),
        index('idx_cms_pages_status').on(table.status),
    ];
});

/**
 * CMS Blocks Table
 * Reusable content units (Hero, RichText, FAQ, etc.) with JSON data.
 */
export const blocks = pgTable('cms_blocks', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(), // Admin label
    type: text('type').notNull(), // e.g., 'hero', 'richText', 'faq'
    schemaVersion: integer('schema_version').notNull().default(1),
    status: text('status').notNull().default('draft'),
    data: jsonb('data').notNull().default({}), // Block-specific payload

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    updatedBy: text('updated_by').references(() => schema.users.id),
}, (table) => {
    return [
        index('idx_cms_blocks_type').on(table.type),
        index('idx_cms_blocks_status').on(table.status),
    ];
});

/**
 * CMS Page Blocks (Join Table)
 * Represents an ordered instance of a block on a specific page.
 */
export const pageBlocks = pgTable('cms_page_blocks', {
    id: uuid('id').primaryKey().defaultRandom(),
    pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
    blockId: uuid('block_id').notNull().references(() => blocks.id),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
    return [
        index('idx_cms_pb_page_id').on(table.pageId),
        index('idx_cms_pb_sort').on(table.pageId, table.sortOrder),
    ];
});

// Infer types for TS usage
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type Block = typeof blocks.$inferSelect;
export type NewBlock = typeof blocks.$inferInsert;
export type PageBlock = typeof pageBlocks.$inferSelect;
