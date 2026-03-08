import { definePlugin } from '@logacore/core';
import { PagesList } from './pages/PagesList';
import { PageEditor } from './pages/PageEditor';
import { BlocksList } from './pages/BlocksList';
import { BlockEditor } from './pages/BlockEditor';

/**
 * LogaCore CMS Plugin
 *
 * Provides enterprise-grade Block Content Architecture (v0.2).
 */
export const plugin = definePlugin({
    id: 'cms',
    name: 'CMS',
    version: '0.1.0',
    requiredCoreVersion: '^0.1.0',
    description: 'Manage block-based pages and reusable content units.',

    permissions: [
        {
            key: 'cms.read',
            name: 'Read CMS',
            description: 'View the CMS dashboard, pages, and blocks',
        },
        {
            key: 'cms.write',
            name: 'Write CMS',
            description: 'Create and edit pages and blocks',
        },
        {
            key: 'cms.delete',
            name: 'Delete CMS',
            description: 'Permanently remove CMS content',
        }
    ],

    admin: {
        navItems: [
            {
                id: 'cms-pages',
                label: 'CMS Pages',
                href: '/admin/cms/pages',
                requiredPerms: ['cms.read'],
            },
            {
                id: 'cms-blocks',
                label: 'CMS Blocks',
                href: '/admin/cms/blocks',
                requiredPerms: ['cms.read'],
            },
        ],
        pages: [
            // --- Pages ---
            {
                id: 'cms-pages-list',
                path: '/admin/cms/pages',
                component: PagesList,
                requiredPerms: ['cms.read'],
                title: 'All Pages',
            },
            {
                id: 'cms-page-editor',
                path: '/admin/cms/pages/[id]',
                component: PageEditor,
                requiredPerms: ['cms.write'],
                title: 'Edit Page',
            },
            {
                id: 'cms-page-new',
                path: '/admin/cms/pages/new',
                component: PageEditor,
                requiredPerms: ['cms.write'],
                title: 'New Page',
            },
            // --- Blocks ---
            {
                id: 'cms-blocks-list',
                path: '/admin/cms/blocks',
                component: BlocksList,
                requiredPerms: ['cms.read'],
                title: 'All Blocks',
            },
            {
                id: 'cms-block-editor',
                path: '/admin/cms/blocks/[id]',
                component: BlockEditor,
                requiredPerms: ['cms.write'],
                title: 'Edit Block',
            },
            {
                id: 'cms-block-new',
                path: '/admin/cms/blocks/new',
                component: BlockEditor,
                requiredPerms: ['cms.write'],
                title: 'New Block',
            },
        ],
    },

    db: {
        migrationsPath: './migrations',
    },
});
