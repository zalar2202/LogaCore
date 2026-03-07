import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, requirePerm } from '@logacore/core/trpc';
import { schema } from '@logacore/db';
import { eq, inArray } from 'drizzle-orm';
import { logAudit } from '@logacore/core/server';

/**
 * tRPC Router for User & Role Management
 */
export const usersRolesRouter = createTRPCRouter({
    // --- Roles ---

    listRoles: protectedProcedure
        .use(requirePerm('roles.manage'))
        .query(async ({ ctx }: any) => {
            const roles = await ctx.db.select().from(schema.roles);
            const perms = await ctx.db.select().from(schema.rolePermissions);

            return roles.map((role: any) => ({
                ...role,
                permissions: perms
                    .filter((p: any) => p.roleId === role.id)
                    .map((p: any) => p.permission)
            }));
        }),

    getRole: protectedProcedure
        .input(z.object({ id: z.string() }))
        .use(requirePerm('roles.manage'))
        .query(async ({ ctx, input }: any) => {
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
        .mutation(async ({ ctx, input }: any) => {
            return await ctx.db.transaction(async (tx: any) => {
                await tx.insert(schema.roles).values({
                    id: input.id,
                    name: input.name,
                    description: input.description
                });

                if (input.permissions.length > 0) {
                    await tx.insert(schema.rolePermissions).values(
                        input.permissions.map((p: any) => ({
                            roleId: input.id,
                            permission: p
                        }))
                    );
                }

                await logAudit(tx, ctx.user.id, 'roles.create', 'users-roles', input.id, input);

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
        .mutation(async ({ ctx, input }: any) => {
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
                        input.permissions.map((p: any) => ({
                            roleId: input.id,
                            permission: p
                        }))
                    );
                }

                await logAudit(tx, ctx.user.id, 'roles.update', 'users-roles', input.id, input);

                return { success: true };
            });
        }),

    deleteRole: protectedProcedure
        .input(z.object({ id: z.string() }))
        .use(requirePerm('roles.manage'))
        .mutation(async ({ ctx, input }: any) => {
            await ctx.db.delete(schema.roles).where(eq(schema.roles.id, input.id));
            await logAudit(ctx.db, ctx.user.id, 'roles.delete', 'users-roles', input.id);
            return { success: true };
        }),

    // --- User Assignment ---

    listUsers: protectedProcedure
        .use(requirePerm('users.manage'))
        .query(async ({ ctx }: any) => {
            return await ctx.db.select().from(schema.users);
        }),

    getUserRoles: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .use(requirePerm('users.manage'))
        .query(async ({ ctx, input }: any) => {
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
        .mutation(async ({ ctx, input }: any) => {
            return await ctx.db.transaction(async (tx: any) => {
                await tx.delete(schema.userRoles)
                    .where(eq(schema.userRoles.userId, input.userId));

                if (input.roleIds.length > 0) {
                    await tx.insert(schema.userRoles).values(
                        input.roleIds.map((rid: any) => ({
                            userId: input.userId,
                            roleId: rid
                        }))
                    );
                }

                await logAudit(tx, ctx.user.id, 'users.assign_roles', 'users-roles', input.userId, { roles: input.roleIds });

                return { success: true };
            });
        }),
});
