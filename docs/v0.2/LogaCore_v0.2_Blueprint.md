# LogaCore v0.2 Blueprint

**Status:** Draft  
**Version:** 0.2  
**Supersedes:** v0.1 Planning & Architectural Documents  
**Scope:** Post–Core Implementation Hardening & Expansion Phase

------------------------------------------------------------------------

# 1. Overview

LogaCore v0.2 represents the transition from:

> “Architecture working in principle” (v0.1)

to:

> “Production-ready internal framework capable of powering real client
> projects.”

At this stage, the system already includes:

-   Monorepo structure (pnpm workspaces)
-   Core package
-   Admin shell
-   Auth wired to PostgreSQL via Drizzle
-   Plugin loader
-   First working plugin (“Hello”)
-   Build-time plugin inclusion via configuration

v0.2 focuses on hardening, validation, reliability, and real-world
validation through production-grade plugins.

------------------------------------------------------------------------

# 2. Objectives of v0.2

1.  Harden plugin contracts  
2.  Formalize migration lifecycle  
3.  Implement real RBAC  
4.  Validate architecture with real plugins  
5.  Prepare for repeatable project scaffolding  
6.  Improve production readiness

------------------------------------------------------------------------

# 3. Core Hardening Phase

## 3.1 Plugin Contract Enforcement (Mandatory)

The plugin system must move from “working” to “strictly validated”.

### Requirements

-   Typed plugin manifest (TypeScript + Zod schema)  
-   Runtime validation on startup  
-   Build-time validation where possible  
-   Clear failure messages

### Validation Rules

-   Unique plugin IDs  
-   Unique admin routes  
-   Unique permission namespaces  
-   Dependency resolution validation (if `dependsOn` exists)  
-   Required Core version compatibility  
-   No route collisions

### Expected Outcome

If the system boots successfully, the plugin ecosystem is structurally
valid.

------------------------------------------------------------------------

## 3.2 Migration Runner v1

Migrations must become deterministic and production-safe.

### Requirements

-   Central migration tracking table (e.g. `_logacore_migrations`)  
-   Ordered execution:
    -   Core first  
    -   Plugins second  
    -   Deterministic plugin order  
-   Safe re-runs (idempotent)  
-   Clear CLI command:
    -   `pnpm db:migrate`

### Removal Policy

-   Removing a plugin does NOT drop tables  
-   Uninstall must be explicit and destructive  
-   Migration history must remain auditable

### Expected Outcome

Database lifecycle is stable across:

-   Dev  
-   CI  
-   Production

------------------------------------------------------------------------

## 3.3 RBAC v1 (Minimum Viable Production)

Permissions exist. Now enforcement must exist.

### Requirements

-   Roles table  
-   Role → permission mapping  
-   User → role mapping  
-   Admin UI for role management  
-   Permission guard middleware for:
    -   Admin routes  
    -   tRPC procedures  
-   Superadmin override behavior

### Permission Convention

    pluginId.action
    example:
    cms.create
    cms.publish
    users.manage

### Expected Outcome

System is safe to deploy without “everyone is admin”.

------------------------------------------------------------------------

# 4. Real Plugin Validation Phase

The “Hello” plugin validates mechanics.  
v0.2 requires real-world complexity validation.

## 4.1 Plugin A: Users & Roles

Purpose: - Role UI  
- Permission mapping UI  
- User assignment

Why: - Touches DB  
- Uses admin shell  
- Uses guards  
- Validates permission architecture

------------------------------------------------------------------------

## 4.2 Plugin B: CMS Lite

Purpose: - CRUD content model  
- Slug routing  
- Publish/draft state  
- List & edit UI

Why: - Validates form patterns  
- Validates data modeling  
- Validates plugin page conventions  
- Validates permission enforcement

------------------------------------------------------------------------

## 4.3 Plugin C: Audit Log

Purpose: - Record admin actions  
- Cross-plugin event logging

Why: - Validates event hooks  
- Validates cross-plugin awareness  
- Adds production credibility

------------------------------------------------------------------------

# 5. Admin Shell Evolution

Admin must become a stable extension surface.

## Improvements

-   Page metadata contract (title, required permission, breadcrumb)  
-   Nav grouping  
-   Plugin settings convention  
-   Plugin health status display  
-   Version visibility

Expected Outcome:

Every plugin feels native and consistent.

------------------------------------------------------------------------

# 6. Scaffolding Phase (Post-Validation)

Scaffolding becomes meaningful after:

-   2–3 real plugins built  
-   Patterns are stable  
-   Core contracts stop shifting daily

## Phase 1 (CLI v0)

-   Copy template  
-   Rename app  
-   Configure plugins  
-   Write `.env`

## Phase 2 (CLI v1)

-   Presets (agency, portal, crm, etc.)  
-   Optional plugin selection  
-   DB setup modes

Scaffolding must follow proven patterns, not guess them.

------------------------------------------------------------------------

# 7. Production Readiness Layer

This phase transforms LogaCore from “internal experiment” into “internal
platform”.

## Required Additions

-   Environment schema validation (Zod)  
-   Logging strategy  
-   Error boundary + reporting  
-   CI pipeline (lint, typecheck, test, build)  
-   Plugin version compatibility checks  
-   Core version compatibility enforcement  
-   Basic integration tests

------------------------------------------------------------------------

# 8. Milestone Roadmap

## Milestone 1 [PARTIAL]
-   [ ] Plugin validation enforcement  
-   [x] Migration runner v1 (Bundled & Standardized)

## Milestone 2 [DONE]
-   [x] RBAC v1 (Roles & Permissions Tables)
-   [x] Role management UI

## Milestone 3 [DONE]
-   [x] CMS Lite plugin (CRUD + Permissions)
-   [x] Audit log plugin (Integrated into users-roles for v0.2)

## Milestone 4

-   CLI v0 scaffolding  
-   Template extraction

## Milestone 5

-   Production readiness enhancements

------------------------------------------------------------------------

# 9. Definition of Done for v0.2

LogaCore v0.2 is complete when:

-   Plugin contracts are enforced and validated  
-   Migrations are deterministic and auditable  
-   RBAC is fully enforced  
-   At least 2 real plugins exist  
-   A new project can be created via CLI  
-   System can be safely deployed to production

------------------------------------------------------------------------

# 10. Strategic Positioning

v0.1 = Architecture exists  
v0.2 = Architecture hardened and validated  
v0.3 = Scalable internal platform  
v1.0 = Mature internal framework ready for long-term evolution
