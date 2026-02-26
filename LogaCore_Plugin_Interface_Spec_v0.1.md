# LogaCore – Plugin Interface Specification (v0.1)

This document defines the strict contract that every LogaCore plugin must follow.
It is the single source of truth for how plugins are authored, validated, loaded,
and integrated into applications.

**Audience:** LogaCore core developers and plugin authors.

---

## 1) Goals

The plugin interface must:

- Enable modular feature composition
- Allow safe plugin removal
- Provide consistent admin UX integration
- Support type-safe API registration
- Support plugin-owned database schema evolution
- Provide lifecycle hooks for future enable/disable behaviors
- Be stable enough to avoid frequent redesign

---

## 2) Non-Goals (v0.1)

- Dynamic runtime installation of code (marketplace install)
- Sandboxed third-party plugins
- Multi-tenant plugin isolation
- Automatic conversion of tRPC procedures to REST resources
- Backward-compatible downgrades

---

## 3) Plugin Definition Overview

A plugin must export a single plugin definition object, typically from `index.ts`:

- Named export: `plugin`
- Created using helper: `definePlugin()` (enforces typing and validation)

Example:

```ts
import { definePlugin } from "@logacore/core";

export const plugin = definePlugin({
  id: "cms",
  name: "CMS",
  version: "0.1.0",
  requiredCoreVersion: "^0.1.0",
  // ...
});
```

---

## 4) Required Metadata Fields

Every plugin MUST define:

### 4.1 `id: string`
A globally unique identifier for the plugin.

Rules:
- Lowercase
- Kebab-case (`cms`, `invoice-manager`, `email-marketing`)
- Must be unique across all plugins included in an app
- Should never change once published internally (treat as permanent)

### 4.2 `name: string`
Human-readable display name used in UI and logs.

### 4.3 `version: string`
Semantic version string (SemVer).
Example: `0.1.0`

### 4.4 `requiredCoreVersion: string`
The compatible core version range.
Example: `^0.1.0`

Purpose:
- Core validates plugin compatibility at load time

---

## 5) Optional Metadata Fields

### 5.1 `description?: string`
Short description for docs/admin plugin lists.

### 5.2 `author?: { name: string; url?: string }`
Author metadata (useful for future marketplace readiness).

### 5.3 `dependsOn?: string[]`
List of plugin IDs required for this plugin to work.

Rules:
- Must refer to `id` values of other plugins
- Core must validate dependencies during build-time loading
- Removal of a dependency should be blocked or warned

**v0.1 rule:** Prefer to avoid dependencies; communicate via events/hooks instead.

---

## 6) Permissions Contract

### 6.1 `permissions?: PermissionDefinition[]`
Plugins declare all permission keys they use.

Permission key naming:
- Prefix with plugin id
- Use dot notation
Examples:
- `cms.read`
- `cms.write`
- `invoices.create`
- `invoices.approve`

Why:
- Core collects permission keys into registry
- RBAC enforcement is centralized
- Admin UI can show role permission options

---

## 7) Admin Integration Contract

### 7.1 `admin?: { ... }`
All admin UI registration is done here.

#### 7.1.1 `navItems?: NavItem[]`
Defines sidebar/navigation items.

Fields (recommended):
- `id`: unique within plugin
- `label`: text label
- `href`: route path (e.g. `/admin/cms/posts`)
- `icon`: icon identifier (implementation detail)
- `requiredPerms`: permission keys required to see this item

Rules:
- Paths must not collide with other plugins
- `href` must point to a registered page

#### 7.1.2 `pages?: AdminPage[]`
Defines pages rendered inside the admin shell.

Fields (recommended):
- `id`: unique within plugin
- `path`: route path (e.g. `/admin/cms/posts`)
- `component`: React component reference
- `requiredPerms`: permission keys required to access page
- `title`: optional page title

Routing model (v0.1):
- Admin uses catch-all route resolver (`/admin/[...slug]`)
- Registry maps path → component

#### 7.1.3 `widgets?: DashboardWidget[]`
Optional dashboard widgets.

Use cases:
- summary cards
- quick actions
- recent activity lists

Widgets must declare required permissions.

---

## 8) API Integration Contract

### 8.1 `api?: { ... }`

Plugins may register backend APIs.

**Decision (v0.1):** Use tRPC internally.

Recommended field:
- `router?: TRPCRouter`

Rules:
- Routers must be namespaced (e.g. `cms.*`, `invoices.*`)
- Core merges routers into a single app router
- Procedures must validate input using Zod

REST (future/optional):
- If REST is needed, plugin may also provide route handlers
- Business logic should live in shared services so tRPC and REST can both call it

---

## 9) Database & Migrations Contract

### 9.1 `db?: { ... }`

Plugins own their schema evolution.

Recommended fields:
- `migrationsPath?: string` (defaults to `./migrations`)
- `seed?: () => Promise<void>` optional seeding

Migration rules:
- Migrations are plain SQL files (`*.sql`)
- File naming must ensure deterministic ordering
  Example:
  - `001_create_posts.sql`
  - `002_add_posts_slug.sql`
- Core migration runner:
  - discovers migrations for included plugins
  - applies in order
  - records applied state in `logacore_migrations` table

Data preservation:
- Removing plugin from build does NOT delete tables/data by default
- Destructive uninstall must be explicit (see Plugin Lifecycle Policy)

---

## 10) Hooks & Lifecycle Contract

### 10.1 `hooks?: { ... }`

Hooks allow plugins to respond to core lifecycle events.

v0.1 recommended hooks:
- `onInit?(ctx)` – called when app boots with registry loaded
- `onInstall?(ctx)` – called when migrations complete for the first time (future-ready)
- `onEnable?(ctx)` – called when plugin is enabled (future-ready)
- `onDisable?(ctx)` – called when plugin is disabled (future-ready)

Rules:
- Hooks must be idempotent when possible
- Hooks must not assume order relative to other plugins unless dependency is declared

---

## 11) Services (Recommended Pattern)

Plugins should keep business logic in an internal service layer:

- `plugins/<plugin>/src/services/*`

Reasons:
- UI and API can share the same logic
- Enables future REST exposure without duplication
- Improves testability

Core rule:
- UI should not directly manipulate DB
- API should call services
- Services use core DB client

---

## 12) Validation & Load-Time Rules (Core Enforced)

Core must validate at load time:

- Unique plugin IDs
- Core version compatibility
- Dependency presence (`dependsOn`)
- No duplicate admin paths
- No duplicate permission keys (optional strict mode)

If validation fails:
- Build should fail fast
- Error message must be clear and actionable

---

## 13) Naming Conventions

- Plugin package name:
  - `@logacore/plugin-<id>`
- Plugin folder name:
  - `plugins/<id>/`
- Permissions:
  - `<id>.<action>`
- Admin routes:
  - `/admin/<id>/...`

---

## 14) Minimum Plugin Checklist

A minimal plugin must provide:

- Required metadata (`id`, `name`, `version`, `requiredCoreVersion`)
- At least one admin page OR API router OR migrations
- Any permissions it uses

---

## 15) Example Plugin Skeleton (Recommended Layout)

```
plugins/cms/
  src/
    index.ts
    admin/
      pages/
    api/
      router.ts
    services/
    types/
  migrations/
    001_create_posts.sql
    002_add_posts_slug.sql
  package.json
  README.md
```

---

## 16) Related Documents

- Plugin Lifecycle Policy (Install / Enable / Disable / Remove / Uninstall)
- Technical Architecture Blueprint (v0.1)
- CLI Scaffolding Guide (v0.1)

---

End of Document.
