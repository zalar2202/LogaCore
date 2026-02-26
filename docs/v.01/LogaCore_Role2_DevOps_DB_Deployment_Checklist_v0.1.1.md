# LogaCore v0.1 – Role 2 Checklist (v0.1.1)

## DevOps / Deployment / Database Engineer

This checklist reflects the **current agreed architecture**:

- Monorepo with **pnpm workspaces**
- DB: **PostgreSQL**
- DB layer: **Drizzle** (team-owned modules, no central schema merge)
- Migrations: **plugin-owned SQL migrations** executed by core runner
- CI basics + reproducible local dev env
- Deployment baseline (staging)

Related reference docs:

- LogaCore_Plugin_Lifecycle_Policy.md
- LogaCore_CLI_Scaffolding_Guide.md
- LogaCore_Architectural_Decisions_Log_v0.1.md

---

# Day 1 – Monorepo Setup (pnpm Workspaces)

- [ ] Initialize pnpm workspace + workspace globs:
  - [ ] apps/\*
  - [ ] packages/\*
  - [ ] plugins/\*
- [ ] Configure root scripts:
  - [ ] `dev`, `build`, `lint`, `typecheck`
- [ ] Setup shared configs:
  - [ ] `tsconfig.base.json`
  - [ ] ESLint + Prettier
- [ ] Verify workspace linking works (`workspace:*` deps resolve)

Deliverable:
Monorepo installs and runs consistently on clean machine.

---

# Day 2 – Demo App Bootstrapping + Env Discipline

- [ ] Create Next.js demo app under `apps/demo-agency-portal`
- [ ] Provide `.env.example` and env validation (Zod recommended)
- [ ] Define required env vars (minimum):
  - [ ] `DATABASE_URL`
  - [ ] NextAuth/Auth.js secrets/providers (placeholders)
- [ ] Add scripts per app:
  - [ ] `dev`, `build`, `start`
  - [ ] `db:migrate`

Deliverable:
Fresh install → `pnpm dev` works (even if auth providers are mocked).

---

# Day 3 – PostgreSQL Local Dev Environment

- [x] Provide local Postgres via Docker Compose (recommended)
- [x] Document:
  - [x] how to start DB
  - [x] how to reset DB
  - [x] connection string format
- [x] Add basic DB health check utility

Deliverable:
Team can spin up Postgres locally in minutes.

---

# Day 4 – Core Migration Runner (Plugin SQL Migrations)

- [x] Implement migration tracking table:
  - [x] `logacore_migrations` (plugin_id, filename, applied_at, checksum optional)
- [x] Implement plugin migration discovery rules:
  - [x] default `./migrations`
  - [x] ordered execution (numeric prefix)
- [x] Ensure idempotency:
  - [x] never re-run applied migrations
  - [x] clear, actionable failure output
- [x] NOTE: Rollbacks are optional in v0.1 (no auto-down migrations)

Deliverable:
`pnpm db:migrate` applies plugin migrations deterministically.

---

# Day 5 – Drizzle DB Layer Baseline

- [x] Establish core DB module in `packages/db`:
  - [x] Drizzle client initialization using `DATABASE_URL`
  - [x] Standard query helpers (optional)
- [x] Decide and document:
  - [x] how plugins import DB client (from core/db package)
  - [x] where plugin table definitions live (e.g., `plugins/<id>/src/db/*`)
- [x] Ensure no plugin bypasses the shared connection pool

Deliverable:
Drizzle setup is consistent and reusable across plugins.

---

# Day 6 – CI + Reproducible Dev Setup

- [x] Add GitHub Actions (minimal):
  - [x] install
  - [x] lint
  - [x] typecheck
  - [x] build
- [x] Optional: run migrations in CI (only if DB service is configured)
- [x] Provide `docker-compose.yml` for local dev (DB + optional app)

Deliverable:
CI catches breakages early; dev setup is standardized.

---

# Day 7 – Staging Deployment Baseline

- [x] Deploy demo app to staging (Coolify/other)
- [x] Ensure DB migrations can run in staging workflow:
  - [x] manual step or pipeline step
- [x] Verify env vars in staging
- [x] Add health endpoint/check (simple)
- [x] Document the deployment steps in docs

Deliverable:
Working staging instance + documented deployment procedure.

---

End of checklist.
