import { definePlugin } from '@logacore/core';
import { HelloPage } from './pages/HelloPage';

// Router is server-only — import from '@logacore/plugin-hello-world/api'
// instead to avoid pulling @trpc/server into client bundles.

export const plugin = definePlugin({
  id: 'hello-world',
  name: 'Hello World',
  version: '0.1.0',
  requiredCoreVersion: '^0.1.0',
  description: 'A demo plugin proving end-to-end integration.',

  permissions: [
    {
      key: 'hello-world.read',
      name: 'Read Hello',
      description: 'View the Hello World page',
    },
  ],

  admin: {
    navItems: [
      {
        id: 'hello',
        label: 'Hello World',
        href: '/admin/hello-world',
        requiredPerms: ['hello-world.read'],
      },
    ],
    pages: [
      {
        id: 'hello-page',
        path: '/admin/hello-world',
        component: HelloPage,
        requiredPerms: ['hello-world.read'],
        title: 'Hello World',
      },
    ],
  },
});
