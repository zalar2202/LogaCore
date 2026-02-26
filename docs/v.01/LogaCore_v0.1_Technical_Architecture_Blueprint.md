# LogaCore v0.1 Technical Architecture Blueprint

---

## 0) v0.1 Scope and Non-goals

### Goals

- Scaffold new apps reliably from a single foundation
- Provide a Core system supporting:
  - Authentication + Role-Based Access Control (RBAC)
  - Admin shell (layout + navigation + plugin injection)
  - Plugin loader + plugin manifest system
  - Database + migrations baseline
  - Shared UI kit + design tokens
- Deliver 2--3 real plugins to validate architecture:
  - CMS / Blog
  - Invoicing or CRM
  - Basic Email module

### Non-goals (Avoid Overengineering)

- Plugin marketplace
- Multi-tenant SaaS hosting
- Visual page builder
- Full WordPress replacement
- Perfect backwards compatibility

---

## 1) Repository Strategy

### Recommended: Monorepo (pnpm workspace / Turborepo)

logacore/ apps/ demo-agency-portal/ demo-ecommerce/ packages/ core/ ui/
db/ cli/ plugins/ cms/ invoices/ email/

Why this matters: - Plugins are importable packages - Version control
per module - Isolation and testability - Clear separation of concerns

---

## 2) Tech Stack (v0.1)

- Next.js (App Router)
- TypeScript
- PostgreSQL
- Prisma or Drizzle (DB layer)
- NextAuth/Auth.js or custom auth
- Zod (validation)
- tRPC or REST (choose and commit)
- TailwindCSS + shadcn/ui
- Queue system postponed unless required

Principle: Choose stable, proven tools and avoid constant stack changes.

---

## 3) Core Package Responsibilities

Core must provide: - Plugin runtime - Admin shell - RBAC/Permission
engine - Shared types + contracts - Hook/event system - Environment
validation

Core must NOT: - Contain business logic - Hardcode feature pages

---

## 4) Plugin System Design

### Plugin Definition Contract

Each plugin exports a structured definition:

```ts
export const plugin = definePlugin({
  id: 'cms',
  name: 'CMS',
  version: '0.1.0',
  requiredCoreVersion: '^0.1.0',

  permissions: [],

  admin: {
    navItems: [],
    pages: [],
    widgets: [],
  },

  api: {
    routes: [],
  },

  db: {
    migrationsPath: './migrations',
    seed: async () => {},
  },

  hooks: {
    onInit: async (ctx) => {},
    onUserCreated: async (ctx, user) => {},
  },
});
```

### Plugin Capabilities (v0.1)

Plugins can: - Register admin navigation - Provide admin pages -
Register API routes - Provide DB migrations - Declare permissions -
Subscribe to lifecycle hooks

### Plugin Loading

Configured explicitly per app:

apps/demo-agency-portal/logacore.config.ts

```ts
export default defineConfig({
  plugins: [
    '@logacore/plugin-cms',
    '@logacore/plugin-invoices',
    '@logacore/plugin-email',
  ],
});
```

Core loads plugins at build time.

---

## 5) Admin UI Architecture

### Core Provides:

- /admin layout
- Sidebar + topbar
- RBAC gate
- Standard page container
- Navigation registry

### Plugins Provide:

- Pages (React components)
- Navigation items
- Dashboard widgets

Routing strategy: - Core owns /admin root layout - Plugins register
slug-based routes - Use catch-all routing for resolution via registry

---

## 6) Permissions Model (RBAC)

Minimum model: - Users → Roles → Permissions - Plugins declare
permission keys

Permission naming convention: cms.read cms.write invoices.create

Core provides: - can(user, "permission.key") -
`<Require perm="permission.key">`{=html} wrapper

Plugins must NOT implement independent permission logic.

---

## 7) Database & Migrations

Recommended v0.1 strategy: - Plugins ship SQL migrations - Core
migration runner executes in order

Advantages: - True modularity - No Prisma schema merging complexity

---

## 8) API Layer

Choose one approach:

Option A: tRPC - Plugins contribute routers - Core merges routers

Option B: REST - Plugins register route handlers - Core wraps with auth
middleware

Core owns authentication and middleware.

---

## 9) CLI Scaffolding

Required commands: - create-logacore-app my-app - Choose preset - Agency
Portal - Content Site - Ecommerce (future)

CLI generates: - Next.js app - logacore.config.ts - Plugin list - Env
template - Admin shell wiring

---

## 10) Presets

Preset = curated plugin list + default configuration

Examples:

Preset: Agency Portal - Core + CMS + Invoices + Clients + Email

Preset: Content Site - Core + CMS + SEO + Email

Presets reduce complexity and improve usability.

---

## 11) Engineering Rules

Non-negotiable:

1.  Core contains platform logic only
2.  Plugins cannot bypass core DB layer
3.  Permissions enforced centrally
4.  Plugins removable without breaking build
5.  Explicit configuration \> hidden magic
6.  Single source of configuration truth
7.  Refactor aggressively in early stages

---

## 12) v0.1 Milestones

Milestone 1: - Monorepo setup - Core skeleton - Plugin registry - Admin
shell - Auth + RBAC

Milestone 2: - CMS plugin end-to-end

Milestone 3: - Second plugin validation

Milestone 4: - CLI scaffolding

---

## 13) Initial Coding Tasks

1.  Setup monorepo structure
2.  Implement definePlugin() and registry
3.  Build admin shell
4.  Implement RBAC helpers
5.  Create test plugin injecting navigation + page
6.  Implement migration runner

---

## Strategic Reminder

This blueprint is designed to: - Prevent architectural chaos - Guide
coding discipline - Enable long-term scalability - Reduce internal
workload - Future-proof LogaTech

Primary mission: Build an internal operating system for delivering
digital infrastructure.
