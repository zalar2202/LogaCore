import { definePlugin } from '@logacore/core';
import { HelloPage } from './pages/HelloPage';

export const plugin = definePlugin({
  id: 'hello-world',
  name: 'Hello World',
  version: '0.1.0',
  requiredCoreVersion: '^0.1.0',
  description: 'A demo plugin proving end-to-end integration.',

  permissions: [
    {
      key: 'hello.read',
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
        requiredPerms: ['hello.read'],
      },
    ],
    pages: [
      {
        id: 'hello-page',
        path: '/admin/hello-world',
        component: HelloPage,
        requiredPerms: ['hello.read'],
        title: 'Hello World',
      },
    ],
  },
});
