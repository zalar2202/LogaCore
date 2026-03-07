import { z } from 'zod';
import {
    createTRPCRouter,
    protectedProcedure,
    requirePerm,
} from '@logacore/core/trpc';
import { TRPCError } from '@trpc/server';
import { desc, eq, asc } from 'drizzle-orm';
import { pages, blocks, pageBlocks } from '../db/schema';
import type { db as DbType } from '@logacore/db';
import { logAudit } from '@logacore/core/server';

/**
 * CMS Plugin tRPC router.
 *
 * Implements Block-Based Content Architecture (v0.2 Standard).
 */
export const cmsRouter = createTRPCRouter({
    // --- Pages ---

    listPages: protectedProcedure
        .use(requirePerm('cms.read'))
        .query(async ({ ctx }) => {
            const db = ctx.db as typeof DbType;
            return await db.select().from(pages).orderBy(desc(pages.updatedAt));
        }),

    getPage: protectedProcedure
        .use(requirePerm('cms.read'))
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const db = ctx.db as typeof DbType;
            const result = await db.select().from(pages).where(eq(pages.id, input.id)).limit(1);
            if (!result[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' });

            const blocksOnPage = await db
                .select({
                    id: blocks.id,
                    name: blocks.name,
                    type: blocks.type,
                    data: blocks.data,
                    sortOrder: pageBlocks.sortOrder,
                    pbId: pageBlocks.id
                })
                .from(pageBlocks)
                .innerJoin(blocks, eq(pageBlocks.blockId, blocks.id))
                .where(eq(pageBlocks.pageId, input.id))
                .orderBy(asc(pageBlocks.sortOrder));

            return { ...result[0], blocks: blocksOnPage };
        }),

    createPage: protectedProcedure
        .use(requirePerm('cms.write'))
        .input(z.object({
            title: z.string().min(1),
            slug: z.string().min(1),
            seoTitle: z.string().optional(),
            seoDescription: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
            const user = ctx.user as any;
            const db = ctx.db as typeof DbType;
            const result = await db.insert(pages).values({
                ...input,
                authorId: user.id,
            }).returning();

            await logAudit(db, user.id, 'cms.page.create', 'cms', result[0].id, input);
            return result[0];
        }),

    updatePage: protectedProcedure
        .use(requirePerm('cms.write'))
        .input(z.object({
            id: z.string().uuid(),
            title: z.string().min(1),
            slug: z.string().min(1),
            status: z.enum(['draft', 'published', 'archived']),
            seoTitle: z.string().optional(),
            seoDescription: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
            const user = ctx.user as any;
            const db = ctx.db as typeof DbType;
            const { id, ...data } = input;
            const result = await db.update(pages)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(pages.id, id))
                .returning();

            if (!result[0]) throw new TRPCError({ code: 'NOT_FOUND' });
            await logAudit(db, user.id, 'cms.page.update', 'cms', id, data);
            return result[0];
        }),

    // --- Blocks ---

    listBlocks: protectedProcedure
        .use(requirePerm('cms.read'))
        .query(async ({ ctx }) => {
            const db = ctx.db as typeof DbType;
            return await db.select().from(blocks).orderBy(desc(blocks.updatedAt));
        }),

    createBlock: protectedProcedure
        .use(requirePerm('cms.write'))
        .input(z.object({
            name: z.string().min(1),
            type: z.string(),
            data: z.any(),
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
            const user = ctx.user as any;
            const db = ctx.db as typeof DbType;
            const result = await db.insert(blocks).values({
                ...input,
                schemaVersion: 1, // Default v0.2
            }).returning();

            await logAudit(db, user.id, 'cms.block.create', 'cms', result[0].id, input);
            return result[0];
        }),

    updateBlock: protectedProcedure
        .use(requirePerm('cms.write'))
        .input(z.object({
            id: z.string().uuid(),
            name: z.string().min(1),
            data: z.any(),
            status: z.enum(['draft', 'published', 'archived']).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
            const user = ctx.user as any;
            const db = ctx.db as typeof DbType;
            const { id, ...data } = input;
            const result = await db.update(blocks)
                .set({ ...data, updatedAt: new Date(), updatedBy: user.id })
                .where(eq(blocks.id, id))
                .returning();

            if (!result[0]) throw new TRPCError({ code: 'NOT_FOUND' });
            await logAudit(db, user.id, 'cms.block.update', 'cms', id, data);
            return result[0];
        }),

    // --- Composition ---

    setPageBlocks: protectedProcedure
        .use(requirePerm('cms.write'))
        .input(z.object({
            pageId: z.string().uuid(),
            blocksIds: z.array(z.string().uuid()),
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
            const user = ctx.user as any;
            const db = ctx.db as typeof DbType;
            return await db.transaction(async (tx) => {
                // Clear existing
                await tx.delete(pageBlocks).where(eq(pageBlocks.pageId, input.pageId));

                // Add new ordered
                if (input.blocksIds.length > 0) {
                    await tx.insert(pageBlocks).values(
                        input.blocksIds.map((id, index) => ({
                            pageId: input.pageId,
                            blockId: id,
                            sortOrder: index,
                        }))
                    );
                }

                await logAudit(tx, user.id, 'cms.page.composition', 'cms', input.pageId, { blocks: input.blocksIds });
                return { success: true };
            });
        }),
});
