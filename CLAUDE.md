# LogaCore

Internal modular Next.js framework by LogaTech. Plugin-based architecture for CMS, CRM, invoicing, and client projects.

## Role Context

You are working as **Role 1** (Architect / Frontend / Backend):
- Core contracts, plugin system, admin shell, tRPC, auth
- Role 2 (DevOps / DB / Deployment) handles: Docker, CI, migration runner infra, staging

## Stack (Locked — do not suggest alternatives)

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Monorepo: pnpm workspaces (pnpm 10.x)
- Database: PostgreSQL + Drizzle ORM
- API: tRPC (internal), REST later for external only
- Auth: NextAuth/Auth.js wrapped by core
- Validation: Zod everywhere (inputs, env, configs)
- UI: TailwindCSS + shadcn/ui
- Migrations: plugin-owned SQL files, core runner executes

## Monorepo Layout

- `apps/` — Next.js applications (one per client project)
- `packages/core/` — Platform logic only, NO business logic
- `packages/ui/` — Shared UI kit (future)
- `packages/db/` — Drizzle client + migration runner (future)
- `plugins/<id>/` — Business logic lives here
- `docs/v.01/` — Architecture specs (read for context)

## Architecture Rules

1. Core = platform logic only. Never put business logic in core.
2. Plugins cannot bypass core DB layer.
3. Permissions enforced centrally via core RBAC. Plugins declare, core enforces.
4. Plugins must be removable without breaking the build.
5. Explicit configuration > hidden magic. No auto-discovery.
6. Single source of config truth: `logacore.config.ts` per app.
7. Data safety first — no silent destructive actions, no auto-rollback migrations.
8. Build-time plugin inclusion. Runtime enable/disable is future-ready only.

## Naming Conventions

- Plugin package: `@logacore/plugin-<id>` (e.g., `@logacore/plugin-cms`)
- Plugin folder: `plugins/<id>/`
- Plugin ID: lowercase kebab-case, permanent once set
- Permissions: `<plugin-id>.<action>` (e.g., `cms.read`, `invoices.create`)
- Admin routes: `/admin/<plugin-id>/...`
- tRPC routers: namespaced by plugin ID (e.g., `cms.*`)
- Migration files: `NNN_description.sql` (numeric prefix for ordering)
- Imports use `@/*` alias in apps (maps to `./src/*`)

## Coding Standards

- TypeScript strict mode. No `any` unless truly unavoidable (eslint warns).
- All function inputs validated with Zod schemas.
- Prefer named exports. Plugin entry: `export const plugin = definePlugin({...})`
- Use `definePlugin()` from `@logacore/core` for all plugin definitions.
- Use `defineConfig()` from `@logacore/core` for app configuration.
- Service layer pattern: UI and API call services, services use core DB client.
- Hooks must be idempotent.
- Prettier: single quotes, trailing comma es5, semicolons, 2-space indent, 80 char width.

## Commit Messages

Conventional commits: `feat(scope):`, `fix(scope):`, `chore:`, `docs:`, `refactor:`
Scope examples: core, plugin-cms, deploy, admin

## What NOT to Do

- Do NOT add dependencies without explicit approval.
- Do NOT suggest alternative frameworks/ORMs/bundlers to the locked stack.
- Do NOT put business logic in packages/core/.
- Do NOT create Prisma schemas (we use Drizzle).
- Do NOT write REST endpoints for internal APIs (use tRPC).
- Do NOT auto-discover plugins. All inclusion is explicit via config.
- Do NOT create rollback/down migrations in v0.1.
- Do NOT build marketplace, multi-tenant, or SaaS features.
- Do NOT hardcode feature pages in core.

## Key Spec Documents

For deeper context, read these in `docs/v.01/`:
- `LogaCore_Plugin_Interface_Spec_v0.1.md` — plugin contract
- `LogaCore_Plugin_Lifecycle_Policy.md` — install/enable/disable/remove/uninstall
- `LogaCore_v0.1_Technical_Architecture_Blueprint.md` — full architecture
- `LogaCore_Architectural_Decisions_Log_v0.1.md` — locked decisions
- `LogaCore_Role1_Architect_FullStack_Checklist_v0.1.1.md` — current task checklist

## Current State (update as milestones complete)

- [x] Monorepo skeleton (pnpm workspaces, configs, demo app)
- [x] Architecture specs and decisions locked
- [x] Core contracts (definePlugin, defineConfig, registry types, validation)
- [x] Plugin loader + registry builder
- [x] Admin shell (layout, sidebar, route resolver)
- [x] RBAC (can, Require)
- [ ] tRPC integration
- [ ] Auth wiring (NextAuth)
- [x] First plugin (hello-world)
