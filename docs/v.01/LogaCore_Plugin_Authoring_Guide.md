# LogaCore — Plugin Authoring Guide (v0.1)

A practical guide for creating LogaCore plugins. For the full contract
specification, see `LogaCore_Plugin_Interface_Spec_v0.1.md`.

---

## 1) Quick Start

```bash
# Create the plugin folder
mkdir -p plugins/my-feature/src/{pages,api}

# Minimal package.json
cat > plugins/my-feature/package.json << 'EOF'
{
  "name": "@logacore/plugin-my-feature",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./api": "./src/api/router.ts"
  },
  "dependencies": {
    "@logacore/core": "workspace:*",
    "@trpc/server": "^11.10.0",
    "zod": "^4.3.6"
  },
  "peerDependencies": {
    "react": ">=19.0.0"
  }
}
EOF

# Install workspace deps
pnpm install
```

---

## 2) Plugin Entry (`src/index.ts`)

Every plugin exports a single `plugin` object created with `definePlugin()`:

```ts
import { definePlugin } from '@logacore/core';
import { MyPage } from './pages/MyPage';

export const plugin = definePlugin({
  id: 'my-feature',          // Kebab-case, permanent once set
  name: 'My Feature',
  version: '0.1.0',
  requiredCoreVersion: '^0.1.0',
  description: 'Short description of the plugin.',

  permissions: [
    {
      key: 'my-feature.read',
      name: 'Read My Feature',
      description: 'View My Feature pages',
    },
    {
      key: 'my-feature.write',
      name: 'Write My Feature',
      description: 'Create and edit My Feature data',
    },
  ],

  admin: {
    navItems: [
      {
        id: 'my-feature',
        label: 'My Feature',
        href: '/admin/my-feature',
        requiredPerms: ['my-feature.read'],
      },
    ],
    pages: [
      {
        id: 'my-feature-page',
        path: '/admin/my-feature',
        component: MyPage,
        requiredPerms: ['my-feature.read'],
        title: 'My Feature',
      },
    ],
  },
});
```

### Critical Rule: Client Safety

The main entry (`src/index.ts`) is imported by `logacore.config.ts`, which
ends up in client bundles. **Never import server-only code here** — no tRPC
routers, no database imports, no `@trpc/server`.

The tRPC router lives behind a **subpath export** (`./api`) that is only
imported in server-only files.

---

## 3) Admin Pages (`src/pages/`)

Pages are React components rendered inside the admin shell:

```tsx
// src/pages/MyPage.tsx
'use client';

export function MyPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-200">My Feature</h2>
      <p className="text-slate-400">Plugin content goes here.</p>
    </div>
  );
}
```

Pages automatically get:
- The admin shell (sidebar, topbar)
- RBAC gating based on `requiredPerms`
- Route resolution via `/admin/[...slug]`

---

## 4) tRPC Router (`src/api/router.ts`)

Plugins define tRPC routers for their API endpoints:

```ts
// src/api/router.ts
import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  requirePerm,
} from '@logacore/core/trpc';

export const myFeatureRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePerm('my-feature.read'))
    .query(({ ctx }) => {
      // ctx.user is guaranteed non-null (enforceAuth runs first)
      // ctx.db is the Drizzle database client
      return { items: [] };
    }),

  create: protectedProcedure
    .use(requirePerm('my-feature.write'))
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return { created: input.name };
    }),
});
```

### Key imports from `@logacore/core/trpc`:
- `createTRPCRouter` — creates a namespaced router
- `protectedProcedure` — base procedure with `enforceAuth` (rejects unauthenticated)
- `requirePerm(perm)` — middleware that checks a specific permission

---

## 5) Wiring Into the App

### Step 1: Register the plugin in `logacore.config.ts`

```ts
import { defineConfig } from '@logacore/core';
import { plugin as myFeature } from '@logacore/plugin-my-feature';

export default defineConfig({
  plugins: [myFeature],
});
```

### Step 2: Compose the tRPC router in `src/lib/trpc/router.ts`

```ts
import { createTRPCRouter } from '@logacore/core/trpc';
import { myFeatureRouter } from '@logacore/plugin-my-feature/api';

export const appRouter = createTRPCRouter({
  'my-feature': myFeatureRouter,
});

export type AppRouter = typeof appRouter;
```

### Step 3: Add the workspace dependency to the app's `package.json`

```json
{
  "dependencies": {
    "@logacore/plugin-my-feature": "workspace:*"
  }
}
```

Run `pnpm install` after adding.

---

## 6) Permissions Model

- Plugins **declare** permissions; core **enforces** them.
- Permission keys follow the pattern `<plugin-id>.<action>`.
- Users have a `permissions: string[]` array on their profile.
- RBAC utilities:
  - **Server**: `requirePerm('my-feature.read')` in tRPC middleware
  - **Client**: `<Require perm="my-feature.read">` component hides UI
  - **Utility**: `can(user, 'my-feature.read')` returns boolean

---

## 7) Server/Client Boundary Rules

| Import path | Safe in client? | Use case |
|---|---|---|
| `@logacore/core` | Yes | `definePlugin`, types, RBAC utilities |
| `@logacore/core/trpc` | **No** (server-only) | tRPC router creation, procedures |
| `@logacore/core/auth` | **No** (server-only) | Auth utilities (`createAuth`, etc.) |
| `@logacore/plugin-xxx` | Yes | Plugin definition |
| `@logacore/plugin-xxx/api` | **No** (server-only) | Plugin tRPC router |

---

## 8) Package.json Exports

Always define two subpath exports:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./api": "./src/api/router.ts"
  }
}
```

This separation ensures the tRPC router (which imports `@trpc/server`)
is never pulled into client bundles.

---

## 9) Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Plugin ID | kebab-case | `my-feature` |
| Package name | `@logacore/plugin-<id>` | `@logacore/plugin-my-feature` |
| Plugin folder | `plugins/<id>/` | `plugins/my-feature/` |
| Permission key | `<id>.<action>` | `my-feature.read` |
| Admin route | `/admin/<id>/...` | `/admin/my-feature` |
| tRPC namespace | plugin ID | `my-feature.*` |
| Router export | `<camelCase>Router` | `myFeatureRouter` |

---

## 10) Removal Test

A plugin should be removable without breaking the build:

1. Remove from `logacore.config.ts`
2. Remove from `src/lib/trpc/router.ts`
3. Remove from app `package.json`
4. Run `pnpm -r build` — must succeed

If the build breaks, the plugin has leaked dependencies into core or
other plugins, which violates the architecture.

---

## Reference

- `LogaCore_Plugin_Interface_Spec_v0.1.md` — Full contract specification
- `LogaCore_Plugin_Lifecycle_Policy.md` — Install/Enable/Disable/Remove lifecycle
- `plugins/hello-world/` — Working reference implementation
