# LogaCore Architectural Decisions Log (v0.1)

This document records all major technical decisions to prevent flip-flopping.
All changes to core architecture must be reflected here.

---

## Core Stack Decisions

### Framework

Decision:
Next.js (App Router) with TypeScript in a monorepo architecture (pnpm workspaces).

Rationale:

- Full-stack capability (frontend + backend in one codebase)
- Strong ecosystem and long-term viability
- Ideal for modular admin-heavy applications
- Works well with tRPC and modern auth patterns
- App Router supports server components and scalable architecture

Date:
Owner:

---

### Database Strategy

Decision:
PostgreSQL as the primary database with Drizzle as the database access layer.

Rationale:

- Relational modeling suits CRM, invoices, permissions, and business workflows
- Strong data integrity (foreign keys, transactions, constraints)
- Better long-term fit for modular business systems
- Drizzle allows modular table definitions per plugin
- Avoids centralized schema merging complexity (Prisma limitation for plugin architecture)

Date:
Owner:

---

### API Layer (tRPC vs REST)

Decision:
Use tRPC for internal application APIs. REST endpoints may be added when required for external integrations.

Rationale:

- End-to-end type safety across frontend and backend
- Faster development for admin-heavy internal systems
- Clean plugin router merging
- Reduced duplication of request/response types
- REST can be layered later for public APIs or third-party integrations

Date:
Owner:

---

### Authentication Strategy

Decision:
Use NextAuth (Auth.js) for authentication, wrapped inside LogaCore core abstraction.

Rationale:

- Mature integration with Next.js
- Supports OAuth providers (Google, etc.)
- Speeds up implementation of login/session handling
- Core wrapper allows future replacement without affecting plugins
- Works well with role-based access control (RBAC)

Date:
Owner:

---

### Migration Strategy

Decision:
Plugins ship their own SQL migrations. Core provides a migration runner that executes migrations in order and tracks applied state.

Rationale:

- True modularity per plugin
- No central schema file merging required
- Compatible with plugin lifecycle policy
- Preserves data when plugin is removed
- Avoids Prisma schema merging complexity
- Forward-only migrations in v0.1 for safety

Date:
Owner:

---

### Plugin System Philosophy

Decision:
Build-time plugin inclusion with future-ready runtime enable/disable capability. Data preserved by default when plugin removed. Explicit uninstall required for destructive actions.

Rationale:

- Aligns with Next.js build model
- Prevents accidental data loss
- Supports modular architecture
- Enables future marketplace evolution
- Separates “code inclusion” from “runtime activation”
- Encourages plugin isolation and independence

Date:
Owner:

---

## Additional Agreed Policies

### Repository Strategy

Decision:
Monorepo using pnpm workspaces. No external publishing in v0.1.

Rationale:

- Faster iteration
- Simplified cross-package refactoring
- No premature versioning overhead
- Ideal for small team internal development

Date:
Owner:

---

### UI Strategy

Decision:
TailwindCSS + shadcn/ui with strict component abstraction rules.

Rationale:

- Rapid UI development
- Strong accessibility foundation (Radix primitives)
- No heavy UI framework lock-in
- Fully customizable components
- Enforced component-based usage prevents utility class chaos

Date:
Owner:

---

## Rules

1. No architectural changes without updating this document.
2. All decisions must include rationale.
3. Stability > trend chasing.
4. Plugin modularity must never be compromised for convenience.
5. Data safety takes precedence over aggressive automation.

---

## Package Export Strategy

Decision:
All internal packages (`@logacore/core`, `@logacore/db`, plugins) export source `.ts` files directly instead of compiled `dist/` output. Next.js `externalDir` compiles these on-the-fly via Turbopack.

Rationale:

- Eliminates stale `dist/` artifacts causing "Module not found" errors
- Consistent pattern across all packages and plugins
- No separate build step required for workspace packages before app build
- Turbopack handles compilation, ensuring a single source of truth
- Simplifies developer workflow (no need to run `tsc -w` on each package during development)

Date: 2026-03-08
Owner: Architecture Team

---

## Client/Server Barrel Separation

Decision:
The `@logacore/core` main entry point (`index.ts`) only exports client-safe utilities. Server-only tools are available via subpath exports:
- `@logacore/core/trpc` → tRPC server utilities (router, procedures, middleware)
- `@logacore/core/auth` → Auth.js wrapper (imports DB, NextAuth)
- `@logacore/core/server` → Plugin loader, validation, RBAC resolver

The main barrel exports `trpc` (the React hook) directly from `./src/trpc/client.ts`, bypassing the server barrel.

Rationale:

- Prevents Node.js-only modules (`fs`, `net`, `pg`, `postgres`) from leaking into client bundles
- Resolves "Module not found" errors during Next.js Turbopack builds
- Enforces clean separation of server and client code
- Plugins import client-safe tools from `@logacore/core`, server tools from subpaths

Date: 2026-03-08
Owner: Architecture Team

---

## Dependency Version Alignment

Decision:
Use `pnpm.overrides` in the root `package.json` to enforce a single version of critical shared libraries across the monorepo: `drizzle-orm@^0.45.1`, `@trpc/server@^11.10.0`, `@trpc/client@^11.10.0`, `@trpc/react-query@^11.10.0`.

Rationale:

- Multiple versions of `drizzle-orm` (e.g., `0.30.10` and `0.45.1`) cause "separate declarations of private property" type errors
- Shared types must come from a single package instance to maintain compatibility across the monorepo
- `pnpm.overrides` is the standard mechanism for enforcing version alignment in pnpm workspaces
- Prevents future regressions when adding new plugins with potentially outdated dependencies

Date: 2026-03-08
Owner: Architecture Team

---

## JWT Permission Cache Strategy

Decision:
The JWT callback in `create-auth.ts` only resolves permissions from the database during initial login, explicit session update (`trigger === 'update'`), or when the token is missing cached permissions. For all other requests, the permissions already stored in the JWT are used directly.

Rationale:

- Prevents an "infinite loading loop" caused by hitting the database on every page load, RSC fetch, and API call
- Massive performance improvement (95%+ reduction in authentication-related DB queries)
- Ensures that permissions are correctly cached and shared across both server-side and client-side code paths
- RBAC resolvers (`resolveUserPermissions`) are also now fully resilient and isolated in try/catch blocks to prevent failed queries (e.g., from missing columns) from crashing the auth flow

Date: 2026-03-08
Owner: Architecture Team

---

## Admin Context Subpath Export

Decision:
The `AdminProvider`, `useAdmin`, and `useUser` hooks are exported via a dedicated `@logacore/core/admin` subpath. All plugins and app components must import from this subpath instead of the main core barrel.

Rationale:

- Resolves "useAdmin must be used within <AdminProvider>" errors
- Ensures React Context singleton behavior across the monorepo by forcing a single shared reference to the context object
- Prevents bundlers from creating duplicate instances of the context when imported from different entry points or workspace packages
- Cleans up the main barrel export by moving UI-specific hooks to their own logical domain

Date: 2026-03-08
Owner: Architecture Team

---

## Strict Permission Namespacing

Decision:
All plugin permissions must follow a strict `pluginId.resource.action` (or `pluginId.action`) format. The core engine's `validatePlugins` runner enforces this at boot-time and will prevent the application from starting if a plugin attempts to declare unnamespaced or conflicting permissions.

Rationale:

- Prevents security collisions between independent plugins (e.g., both `cms` and `shop` having a generic `read` permission)
- Ensures a clean, predictable RBAC auditing trail where every action is clearly attributed to a specific domain
- Simplifies cross-plugin role management by categorization
- Boot-time enforcement provides immediate developer feedback for contract violations

Date: 2026-03-08
Owner: Architecture Team

---

End of Document.
