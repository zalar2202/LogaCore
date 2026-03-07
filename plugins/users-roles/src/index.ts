import { definePlugin } from '@logacore/core';
import { RoleManagement } from './pages/RoleManagement';

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
            key: 'roles.manage',
            name: 'Manage Roles',
            description: 'Create, edit and delete system roles',
        },
        {
            key: 'users.manage',
            name: 'Manage Users',
            description: 'Assign roles to users and manage user details',
        }
    ],

    admin: {
        navItems: [
            {
                id: 'rbac',
                label: 'Users & Roles',
                href: '/admin/rbac',
                requiredPerms: ['roles.manage'],
            },
        ],
        pages: [
            {
                id: 'role-management',
                path: '/admin/rbac',
                component: RoleManagement,
                requiredPerms: ['roles.manage'],
                title: 'Role Management',
            },
        ],
    },
});
