# LogaCore

Internal modular Next.js framework by **LogaTech**. Plugin-based architecture for building admin panels, CMS, CRM, invoicing, and client projects.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript (strict)
- **Monorepo:** pnpm workspaces
- **Database:** PostgreSQL + Drizzle ORM
- **API:** tRPC (internal)
- **Auth:** Auth.js v5 (NextAuth) wrapped by core
- **Validation:** Zod
- **UI:** TailwindCSS + shadcn/ui

## Monorepo Structure

```
apps/
  demo-agency-portal/     # Demo app (Next.js)
packages/
  core/                   # Platform logic (plugin system, RBAC, tRPC, auth)
  db/                     # Drizzle client + schema
  ui/                     # Shared UI kit (future)
plugins/
  hello-world/            # Reference plugin
docs/
  v.01/                   # Architecture specs
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker Desktop (for PostgreSQL)

### Setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL (Docker)
docker compose -f docker-compose.dev.yaml up -d

# Create a .env file at the root with:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/logacore"
# AUTH_SECRET="<generate with: openssl rand -hex 32>"
# AUTH_URL="http://localhost:5555"

# Push DB schema
pnpm --filter @logacore/db drizzle-kit push

# Seed dev admin user
pnpm --filter @logacore/db seed

# Build packages
pnpm --filter @logacore/core build
pnpm --filter @logacore/db build

# Start dev server
pnpm --filter demo-agency-portal dev
```

The app runs at **http://localhost:5555**. Sign in at `/auth/signin` with:

- **Email:** `admin@logacore.dev`
- **Password:** `admin123`

### Useful Commands

```bash
# Full monorepo build
pnpm -r build

# Drizzle Studio (DB GUI)
pnpm --filter @logacore/db drizzle-kit studio

# Re-seed admin user
pnpm --filter @logacore/db seed
```

## Architecture

### Plugin System

Plugins are the primary way to add business logic. Core provides the platform; plugins provide features.

- Plugins are defined with `definePlugin()` and registered in `logacore.config.ts`
- Each plugin can declare: admin pages, nav items, permissions, tRPC routers
- Plugins are included at **build time** — removing a plugin from config removes it from the build
- See [Plugin Authoring Guide](docs/v.01/LogaCore_Plugin_Authoring_Guide.md) for details

### Key Patterns

| Import | Client-safe? | Use case |
|---|---|---|
| `@logacore/core` | Yes | `definePlugin`, types, RBAC |
| `@logacore/core/trpc` | No (server) | tRPC router creation |
| `@logacore/core/auth` | No (server) | Auth utilities |
| `@logacore/plugin-xxx` | Yes | Plugin definition |
| `@logacore/plugin-xxx/api` | No (server) | Plugin tRPC router |

### Auth

- Auth.js v5 with JWT session strategy
- Core wraps Auth.js via `createAuth()` — apps configure providers
- Admin routes are protected by server component redirect
- tRPC procedures are protected by `enforceAuth` middleware
- Permissions are enforced via `requirePerm()` middleware and `can()` utility

### RBAC

- Plugins declare permissions (e.g., `cms.read`, `invoices.create`)
- Core enforces permissions centrally
- Server: `requirePerm('perm')` in tRPC middleware
- Client: `<Require perm="perm">` component for UI gating
- Utility: `can(user, 'perm')` returns boolean

## Documentation

Architecture specs are in [`docs/v.01/`](docs/v.01/):

- [Technical Architecture Blueprint](docs/v.01/LogaCore_v0.1_Technical_Architecture_Blueprint.md)
- [Plugin Interface Spec](docs/v.01/LogaCore_Plugin_Interface_Spec_v0.1.md)
- [Plugin Lifecycle Policy](docs/v.01/LogaCore_Plugin_Lifecycle_Policy.md)
- [Plugin Authoring Guide](docs/v.01/LogaCore_Plugin_Authoring_Guide.md)
- [Architectural Decisions Log](docs/v.01/LogaCore_Architectural_Decisions_Log_v0.1.md)
- [Role 1 Checklist](docs/v.01/LogaCore_Role1_Architect_FullStack_Checklist_v0.1.1.md)
