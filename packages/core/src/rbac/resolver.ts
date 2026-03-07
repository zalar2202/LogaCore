import { eq, inArray } from 'drizzle-orm';
import { schema } from '@logacore/db';

/**
 * Resolves all permissions for a user by aggregating permissions from all their assigned roles.
 * 
 * Falls back gracefully if the direct permissions column doesn't exist on the users table.
 * 
 * @param db - Drizzle database instance
 * @param userId - ID of the user to resolve permissions for
 * @returns Array of unique permission strings
 */
export async function resolveUserPermissions(db: any, userId: string): Promise<string[]> {
    try {
        // 1. Try to get direct permissions from user table (may not exist in older schemas)
        let directPermissions: string[] = [];
        try {
            const userRes = await db.select({
                permissions: schema.users.permissions
            })
                .from(schema.users)
                .where(eq(schema.users.id, userId))
                .limit(1);

            directPermissions = userRes[0]?.permissions || [];
        } catch {
            // Column may not exist in production DB yet — skip direct permissions
            console.warn('Could not read direct permissions from users table, using RBAC roles only.');
        }

        // 2. Get roles for this user
        const userRoles = await db.select({
            roleId: schema.userRoles.roleId
        })
            .from(schema.userRoles)
            .where(eq(schema.userRoles.userId, userId));

        if (userRoles.length === 0) {
            return directPermissions;
        }

        const roleIds = userRoles.map((r: any) => r.roleId);

        // 3. Get permissions for all those roles
        const rolePerms = await db.select({
            permission: schema.rolePermissions.permission
        })
            .from(schema.rolePermissions)
            .where(inArray(schema.rolePermissions.roleId, roleIds));

        const aggregatedPermissions = new Set([
            ...directPermissions,
            ...rolePerms.map((rp: any) => rp.permission)
        ]);

        return Array.from(aggregatedPermissions);
    } catch (err) {
        console.error('Failed to resolve user permissions:', err);
        return [];
    }
}
