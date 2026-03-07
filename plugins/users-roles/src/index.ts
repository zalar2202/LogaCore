import { definePlugin } from '@logacore/core';
import { RoleManagement } from './pages/RoleManagement';
import { AuditLogs } from './pages/AuditLogs';

/**
 * LogaCore Users & Roles Plugin
 * 
 * Provides RBAC management, user role assignment and permission auditing.
 */
export const plugin = definePlugin({
    id: 'users-roles',
    name: 'Users & Roles',
    version: '0.1.0',
    requiredCoreVersion: '^0.1.0',
    description: 'Manage users, roles and aggregate permissions.',

    permissions: [
        {
            key: 'users-roles.roles.manage',
            name: 'Manage Roles',
            description: 'Create, edit and delete system roles',
        },
        {
            key: 'users-roles.users.manage',
            name: 'Manage Users',
            description: 'Assign roles to users and manage user details',
        },
        {
            key: 'users-roles.audit.read',
            name: 'Read Audit Logs',
            description: 'View the system-wide action history',
        }
    ],

    admin: {
        navItems: [
            {
                id: 'rbac',
                label: 'Users & Roles',
                href: '/admin/rbac',
                requiredPerms: ['users-roles.roles.manage'],
            },
            {
                id: 'audit',
                label: 'Audit Logs',
                href: '/admin/audit',
                requiredPerms: ['users-roles.audit.read'],
            },
        ],
        pages: [
            {
                id: 'role-management',
                path: '/admin/rbac',
                component: RoleManagement,
                requiredPerms: ['users-roles.roles.manage'],
                title: 'Role Management',
            },
            {
                id: 'audit-logs',
                path: '/admin/audit',
                component: AuditLogs,
                requiredPerms: ['users-roles.audit.read'],
                title: 'Audit Logs',
            },
        ],
    },
});
