import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, requirePerm } from '@logacore/core/trpc';
import { schema } from '@logacore/db';
import { eq, inArray } from 'drizzle-orm';

/**
 * tRPC Router for User & Role Management
 */
export const usersRolesRouter = createTRPCRouter({
    // --- Roles ---

    listRoles: protectedProcedure
        .use(requirePerm('roles.manage'))
        .query(async ({ ctx }) => {
            return await ctx.db.select().from(schema.roles);
        }),

    getRole: protectedProcedure
        .input(z.object({ id: z.string() }))
        .use(requirePerm('roles.manage'))
        .query(async ({ ctx, input }) => {
            const role = await ctx.db.select()
                .from(schema.roles)
                .where(eq(schema.roles.id, input.id))
                .limit(1);

            if (!role[0]) return null;

            const permissions = await ctx.db.select({
                permission: schema.rolePermissions.permission
            })
                .from(schema.rolePermissions)
                .where(eq(schema.rolePermissions.roleId, input.id));

            return {
                ...role[0],
                permissions: permissions.map((p: any) => p.permission)
            };
        }),

    createRole: protectedProcedure
        .input(z.object({
            id: z.string().min(2),
            name: z.string().min(2),
            description: z.string().optional(),
            permissions: z.array(z.string())
        }))
        .use(requirePerm('roles.manage'))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.transaction(async (tx: any) => {
                await tx.insert(schema.roles).values({
                    id: input.id,
                    name: input.name,
                    description: input.description
                });

                if (input.permissions.length > 0) {
                    await tx.insert(schema.rolePermissions).values(
                        input.permissions.map(p => ({
                            roleId: input.id,
                            permission: p
                        }))
                    );
                }
                return { success: true };
            });
        }),

    updateRole: protectedProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().min(2),
            description: z.string().optional(),
            permissions: z.array(z.string())
        }))
        .use(requirePerm('roles.manage'))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.transaction(async (tx: any) => {
                await tx.update(schema.roles)
                    .set({
                        name: input.name,
                        description: input.description,
                        updatedAt: new Date()
                    })
                    .where(eq(schema.roles.id, input.id));

                // Refresh permissions
                await tx.delete(schema.rolePermissions)
                    .where(eq(schema.rolePermissions.roleId, input.id));

                if (input.permissions.length > 0) {
                    await tx.insert(schema.rolePermissions).values(
                        input.permissions.map(p => ({
                            roleId: input.id,
                            permission: p
                        }))
                    );
                }
                return { success: true };
            });
        }),

    deleteRole: protectedProcedure
        .input(z.object({ id: z.string() }))
        .use(requirePerm('roles.manage'))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(schema.roles).where(eq(schema.roles.id, input.id));
            return { success: true };
        }),

    // --- User Assignment ---

    listUsers: protectedProcedure
        .use(requirePerm('users.manage'))
        .query(async ({ ctx }) => {
            return await ctx.db.select().from(schema.users);
        }),

    getUserRoles: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .use(requirePerm('users.manage'))
        .query(async ({ ctx, input }) => {
            return await ctx.db.select()
                .from(schema.userRoles)
                .where(eq(schema.userRoles.userId, input.userId));
        }),

    assignUserRoles: protectedProcedure
        .input(z.object({
            userId: z.string(),
            roleIds: z.array(z.string())
        }))
        .use(requirePerm('users.manage'))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.transaction(async (tx: any) => {
                await tx.delete(schema.userRoles)
                    .where(eq(schema.userRoles.userId, input.userId));

                if (input.roleIds.length > 0) {
                    await tx.insert(schema.userRoles).values(
                        input.roleIds.map(rid => ({
                            userId: input.userId,
                            roleId: rid
                        }))
                    );
                }
                return { success: true };
            });
        }),
});
