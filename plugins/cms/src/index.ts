import { definePlugin } from '@logacore/core';
import { CmsDashboard } from './pages/CmsDashboard';

/**
 * LogaCore CMS Plugin
 *
 * Provides blogging/content management capabilities.
 */
export const plugin = definePlugin({
    id: 'cms',
    name: 'CMS',
    version: '0.1.0',
    requiredCoreVersion: '^0.1.0',
    description: 'Manage blog posts and articles.',

    permissions: [
        {
            key: 'cms.read',
            name: 'Read CMS',
            description: 'View the CMS dashboard and post list',
        },
        {
            key: 'cms.write',
            name: 'Write CMS',
            description: 'Create and edit blog posts',
        },
        {
            key: 'cms.delete',
            name: 'Delete CMS',
            description: 'Delete blog posts',
        }
    ],

    admin: {
        navItems: [
            {
                id: 'cms',
                label: 'CMS',
                href: '/admin/cms',
                requiredPerms: ['cms.read'],
            },
        ],
        pages: [
            {
                id: 'cms-dashboard',
                path: '/admin/cms',
                component: CmsDashboard,
                requiredPerms: ['cms.read'],
                title: 'CMS Dashboard',
            },
        ],
    },

    db: {
        migrationsPath: './migrations',
    },
});
