import { z } from 'zod';
import {
    createTRPCRouter,
    protectedProcedure,
    requirePerm,
} from '@logacore/core/trpc';
import { TRPCError } from '@trpc/server';
import { desc, eq } from 'drizzle-orm';
import { posts } from '../db/schema';
import type { db as DbType } from '@logacore/db';

/**
 * CMS Plugin tRPC router.
 *
 * Implements CRUD for blog posts with RBAC enforcement.
 */
export const cmsRouter = createTRPCRouter({
    // List all posts
    listPosts: protectedProcedure
        .use(requirePerm('cms.read'))
        .query(async ({ ctx }) => {
            const db = ctx.db as typeof DbType;
            // Manual select since cms_posts isn't in core schema.index
            return await db.select().from(posts).orderBy(desc(posts.createdAt));
        }),

    // Get a single post by slug
    getPost: protectedProcedure
        .use(requirePerm('cms.read'))
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            const db = ctx.db as typeof DbType;
            const result = await db
                .select()
                .from(posts)
                .where(eq(posts.slug, input.slug))
                .limit(1);

            if (!result[0]) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Post not found',
                });
            }

            return result[0];
        }),

    // Create a new post
    createPost: protectedProcedure
        .use(requirePerm('cms.write'))
        .input(
            z.object({
                title: z.string().min(1).max(255),
                slug: z.string().min(1).max(255),
                content: z.string().optional(),
                status: z.enum(['draft', 'published']).default('draft'),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const db = ctx.db as typeof DbType;
            if (!ctx.user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'User missing from context',
                });
            }

            const result = await db.insert(posts).values({
                ...input,
                authorId: ctx.user.id,
            }).returning();

            return result[0];
        }),

    // Update an existing post
    updatePost: protectedProcedure
        .use(requirePerm('cms.write'))
        .input(
            z.object({
                id: z.string().uuid(),
                title: z.string().min(1).max(255),
                content: z.string().optional(),
                status: z.enum(['draft', 'published']),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const db = ctx.db as typeof DbType;
            const { id, ...data } = input;
            const result = await db
                .update(posts)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(posts.id, id))
                .returning();

            if (!result[0]) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Post not found',
                });
            }

            return result[0];
        }),

    // Delete a post
    deletePost: protectedProcedure
        .use(requirePerm('cms.delete'))
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const db = ctx.db as typeof DbType;
            const result = await db
                .delete(posts)
                .where(eq(posts.id, input.id))
                .returning();

            if (!result[0]) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Post not found',
                });
            }

            return { success: true };
        }),
});
