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
  - [ ] apps/*
  - [ ] packages/*
  - [ ] plugins/*
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

- [ ] Provide local Postgres via Docker Compose (recommended)
- [ ] Document:
  - [ ] how to start DB
  - [ ] how to reset DB
  - [ ] connection string format
- [ ] Add basic DB health check utility

Deliverable:
Team can spin up Postgres locally in minutes.

---

# Day 4 – Core Migration Runner (Plugin SQL Migrations)

- [ ] Implement migration tracking table:
  - [ ] `logacore_migrations` (plugin_id, filename, applied_at, checksum optional)
- [ ] Implement plugin migration discovery rules:
  - [ ] default `./migrations`
  - [ ] ordered execution (numeric prefix)
- [ ] Ensure idempotency:
  - [ ] never re-run applied migrations
  - [ ] clear, actionable failure output
- [ ] NOTE: Rollbacks are optional in v0.1 (no auto-down migrations)

Deliverable:
`pnpm db:migrate` applies plugin migrations deterministically.

---

# Day 5 – Drizzle DB Layer Baseline

- [ ] Establish core DB module in `packages/db`:
  - [ ] Drizzle client initialization using `DATABASE_URL`
  - [ ] Standard query helpers (optional)
- [ ] Decide and document:
  - [ ] how plugins import DB client (from core/db package)
  - [ ] where plugin table definitions live (e.g., `plugins/<id>/src/db/*`)
- [ ] Ensure no plugin bypasses the shared connection pool

Deliverable:
Drizzle setup is consistent and reusable across plugins.

---

# Day 6 – CI + Reproducible Dev Setup

- [ ] Add GitHub Actions (minimal):
  - [ ] install
  - [ ] lint
  - [ ] typecheck
  - [ ] build
- [ ] Optional: run migrations in CI (only if DB service is configured)
- [ ] Provide `docker-compose.yml` for local dev (DB + optional app)

Deliverable:
CI catches breakages early; dev setup is standardized.

---

# Day 7 – Staging Deployment Baseline

- [ ] Deploy demo app to staging (Coolify/other)
- [ ] Ensure DB migrations can run in staging workflow:
  - [ ] manual step or pipeline step
- [ ] Verify env vars in staging
- [ ] Add health endpoint/check (simple)
- [ ] Document the deployment steps in docs

Deliverable:
Working staging instance + documented deployment procedure.

---

End of checklist.
