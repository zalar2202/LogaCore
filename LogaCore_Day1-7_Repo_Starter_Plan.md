# LogaCore v0.1 – Day 1 to Day 7 Repo Starter Plan

---

## Week Goal

Ship a working vertical slice:
- Monorepo
- Core package
- Plugin loader
- Admin shell
- Hello-world plugin
- Migration runner
- Demo app

No overengineering. No marketplace. No premature scaling.

---

# Day 1 – Monorepo Foundation

- Initialize Git repository
- Setup pnpm workspaces
- Create folders:
  - apps/
  - packages/
  - plugins/
  - docs/
- Configure:
  - TypeScript base config
  - ESLint + Prettier
- Lock architectural decisions in docs/decisions.md

Deliverable:
Repository builds and lint passes.

---

# Day 2 – Core Contracts

- Create packages/core
- Define:
  - PluginDefinition interface
  - definePlugin()
  - defineConfig()
  - LogaCoreConfig
- Create basic registry structure type

Deliverable:
Core compiles. Plugin contract finalized.

---

# Day 3 – Plugin Loader + Demo App

- Implement loadPlugins(config)
- Validate:
  - Unique plugin IDs
  - Version compatibility
- Build registry
- Create apps/demo-agency-portal (Next.js App Router)
- Wire logacore.config.ts

Deliverable:
Demo app boots with empty registry.

---

# Day 4 – Admin Shell + RBAC Skeleton

- Implement AdminLayout
- Sidebar renders registry nav
- Create /admin route group
- Implement minimal RBAC helpers:
  - can(user, perm)
  - <Require perm="">

Deliverable:
/admin loads with registry-driven sidebar.

---

# Day 5 – First Plugin (hello-world)

- Create plugins/hello-world
- Export plugin definition
- Add:
  - One nav item
  - One admin page
  - One permission
- Implement catch-all route resolver
- Add plugin to config

Deliverable:
Plugin injects page into admin.

---

# Day 6 – Database & Migrations

- Implement SQL-based migration runner
- Track applied migrations table:
  logacore_migrations
- Add migration command
- Add example migration

Deliverable:
db:migrate works from clean install.

---

# Day 7 – Hardening + Documentation

- Integrate authentication
- Protect /admin routes
- Write README.md
- Write docs/plugin-authoring.md
- Test clean install from scratch

Deliverable:
Stable internal v0.1 foundation.

---

End of Week Outcome:
A functional modular engine ready for real client project integration.
