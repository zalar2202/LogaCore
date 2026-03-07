import { schema } from '@logacore/db';

/**
 * Audit Service
 * 
 * Provides standardized methods for logging actions across LogaCore.
 */
export async function logAudit(
    db: any,
    userId: string,
    action: string,
    pluginId: string,
    targetId?: string,
    data: any = {}
) {
    try {
        await db.insert(schema.auditLogs).values({
            userId,
            action,
            pluginId,
            targetId,
            data
        });
    } catch (err) {
        // We log audit failures to console but don't crash 
        // the main business transaction because of a logging error.
        console.error('Audit logging failed:', err);
    }
}
