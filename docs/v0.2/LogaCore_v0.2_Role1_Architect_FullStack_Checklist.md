# LogaCore v0.2 — Role 1 Checklist (Architect / Full-Stack)

## Core Tasks

- [x] Enforce plugin manifest schema
- [x] Implement validation rules
- [x] Harden migration runner (Bundled for production)
- [x] Implement RBAC enforcement layer
- [x] Implement CMS plugin
- [x] Optimize JWT auth callback (Performance + Stability)
- [x] Centralize Admin Context (@logacore/core/admin)

## Plugin Tasks

- [x] Full Block-Based CMS Architecture
- [x] Page Composition & SEO metadata
- [x] Transactional block sequencing
- [x] @logacore/cli (Bootstrapped)
- [x] `plugin:create` Scaffolding command
- [x] `migration:create` Automation command

## Stability Tasks

- [x] Validate dependency resolution (pnpm overrides)
- [x] Test plugin resolution (Source TS exports)
- [x] Ensure no route collisions (Dynamic catch-all + Registry)
- [x] Idempotent DB Migrations (RBAC bootstrapping)

Definition of Completion:

- [x] CMS plugin deployable
- [x] RBAC fully enforced
- [x] Migrations deterministic
- [x] No app-crashing side effects during auth or navigation
