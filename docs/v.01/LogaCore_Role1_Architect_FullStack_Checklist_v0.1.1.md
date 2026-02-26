# LogaCore v0.1 – Role 1 Checklist (v0.1.1)

## Architect / Frontend / Backend Engineer

This checklist reflects the **current agreed architecture**:

- Next.js (App Router) + TypeScript
- Internal APIs via **tRPC**
- Auth via **NextAuth/Auth.js** (wrapped by core)
- DB: **PostgreSQL** with **Drizzle** as DB layer
- Migrations: **plugin-owned SQL migrations** executed by a core runner
- Plugins included at **build time**, with future-ready runtime enable/disable policy

Related reference docs:

- LogaCore_Plugin_Interface_Spec_v0.1.md
- LogaCore_Plugin_Lifecycle_Policy.md
- LogaCore_CLI_Scaffolding_Guide.md
- LogaCore_Architectural_Decisions_Log_v0.1.md

---

# Day 1 – Architecture Lock-In + Spec Adoption

- [x] Confirm and freeze decisions in the Decisions Log (no more stack churn)
- [x] Adopt **Plugin Interface Spec** as the contract (fields, naming, conventions)
- [x] Adopt **Plugin Lifecycle Policy** (Install/Enable/Disable/Remove/Uninstall)
- [x] Confirm API choice: **tRPC for internal**
- [x] Confirm DB access layer: **Drizzle**
- [x] Define “Included vs Enabled” concept (even if runtime toggling is v1+)

Deliverable:
Team aligned on contracts and rules. No ambiguity.

---

# Day 2 – Core Contracts (TypeScript)

- [x] Implement strict TS types for:
  - [x] `definePlugin()` / `PluginDefinition`
  - [x] `defineConfig()` / `LogaCoreConfig`
  - [x] Registry types (nav/pages/permissions/api/db/hooks)
- [x] Implement core validation plan (type-level + runtime checks):
  - [x] Unique plugin IDs
  - [x] Duplicate admin paths
  - [x] Dependency checks (dependsOn)
  - [x] Core version compatibility field present (range check can be stubbed)

Deliverable:
Core types exported and used by a sample plugin without `any`.

---

# Day 3 – Plugin Loader + Registry Builder (Build-time)

- [x] Implement `loadPlugins(config)` (build-time inclusion)
- [x] Build the final registry object:
  - [x] permissions list
  - [x] admin nav items
  - [x] admin pages
  - [x] tRPC routers (namespaced)
  - [x] db migration sources
  - [x] hooks
- [x] Ensure registry build fails fast with actionable error messages

Deliverable:
Registry builds deterministically from `logacore.config.ts`.

---

# Day 4 – Admin Shell + RBAC Gate

- [x] Implement Admin shell components:
  - [x] `AdminLayout`, `Sidebar`, `Topbar`
- [x] Render sidebar from registry nav items
- [x] Implement route resolution:
  - [x] `/admin/[...slug]` resolves registry pages by `path`
- [x] Implement RBAC utilities:
  - [x] `can(user, perm)`
  - [x] `<Require perm>` for UI + route access blocking

Deliverable:
Admin loads, nav is dynamic, pages resolved via registry, permission gate exists.

---

# Day 5 – Hello Plugin (Proof of Integration)

- [x] Create `plugins/hello-world` following Plugin Interface Spec
- [x] Register:
  - [x] one nav item
  - [x] one admin page
  - [x] one permission key (`hello.read`)
- [x] Confirm removing the plugin from config removes UI/routes in next build

Deliverable:
Plugin injection proven end-to-end.

---

# Day 6 – tRPC Integration (Internal API Standard)

- [ ] Define the core tRPC composition pattern:
  - [ ] `createContext()` includes session/user
  - [ ] `protectedProcedure` enforces auth
  - [ ] `requirePerm()` helper enforces RBAC in procedures
- [ ] Implement router merge strategy:
  - [ ] Core merges plugin routers under namespaced keys
- [ ] Add one example procedure in hello-world:
  - [ ] input validated via Zod
  - [ ] permission enforced

Deliverable:
Plugin provides tRPC procedures + UI can call them type-safely.

---

# Day 7 – Auth Wiring + Docs Hardening

- [ ] Integrate NextAuth/Auth.js:
  - [ ] protect `/admin` routes
  - [ ] expose session/user in tRPC context
- [ ] Create/Update docs:
  - [ ] plugin authoring guide references Plugin Interface Spec
  - [ ] “Included vs Enabled vs Removed” behavior aligns with Lifecycle Policy
- [ ] Refactor any shortcuts and remove hardcoded paths

Deliverable:
Clean v0.1 foundation with stable contracts and working auth.

---

End of checklist.
