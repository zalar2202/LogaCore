import { eq, inArray } from 'drizzle-orm';
import { schema } from '@logacore/db';

/**
 * Resolves all permissions for a user by aggregating permissions from all their assigned roles.
 * 
 * Falls back gracefully at each step if queries fail (e.g., missing columns/tables).
 * 
 * @param db - Drizzle database instance
 * @param userId - ID of the user to resolve permissions for
 * @returns Array of unique permission strings
 */
export async function resolveUserPermissions(db: any, userId: string): Promise<string[]> {
    const allPermissions: string[] = [];

    // 1. Try to get direct permissions from user table (may not exist in older schemas)
    try {
        const userRes = await db.select({
            permissions: schema.users.permissions
        })
            .from(schema.users)
            .where(eq(schema.users.id, userId))
            .limit(1);

        const directPerms = userRes[0]?.permissions;
        if (Array.isArray(directPerms)) {
            allPermissions.push(...directPerms);
        }
    } catch {
        // Column may not exist — skip
    }

    // 2. Get roles for this user from the RBAC tables
    try {
        const userRoles = await db.select({
            roleId: schema.userRoles.roleId
        })
            .from(schema.userRoles)
            .where(eq(schema.userRoles.userId, userId));

        if (userRoles.length > 0) {
            const roleIds = userRoles.map((r: any) => r.roleId);

            // 3. Get permissions for all those roles
            const rolePerms = await db.select({
                permission: schema.rolePermissions.permission
            })
                .from(schema.rolePermissions)
                .where(inArray(schema.rolePermissions.roleId, roleIds));

            allPermissions.push(...rolePerms.map((rp: any) => rp.permission));
        }
    } catch {
        // RBAC tables may not be fully set up — skip
    }

    // Deduplicate and return
    return [...new Set(allPermissions)];
}
