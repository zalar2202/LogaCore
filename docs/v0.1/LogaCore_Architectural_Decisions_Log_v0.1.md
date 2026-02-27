# LogaCore Architectural Decisions Log (v0.1)

This document records all major technical decisions to prevent flip-flopping.
All changes to core architecture must be reflected here.

---

## Core Stack Decisions

### Framework

Decision:
Next.js (App Router) with TypeScript in a monorepo architecture (pnpm workspaces).

Rationale:

- Full-stack capability (frontend + backend in one codebase)
- Strong ecosystem and long-term viability
- Ideal for modular admin-heavy applications
- Works well with tRPC and modern auth patterns
- App Router supports server components and scalable architecture

Date:
Owner:

---

### Database Strategy

Decision:
PostgreSQL as the primary database with Drizzle as the database access layer.

Rationale:

- Relational modeling suits CRM, invoices, permissions, and business workflows
- Strong data integrity (foreign keys, transactions, constraints)
- Better long-term fit for modular business systems
- Drizzle allows modular table definitions per plugin
- Avoids centralized schema merging complexity (Prisma limitation for plugin architecture)

Date:
Owner:

---

### API Layer (tRPC vs REST)

Decision:
Use tRPC for internal application APIs. REST endpoints may be added when required for external integrations.

Rationale:

- End-to-end type safety across frontend and backend
- Faster development for admin-heavy internal systems
- Clean plugin router merging
- Reduced duplication of request/response types
- REST can be layered later for public APIs or third-party integrations

Date:
Owner:

---

### Authentication Strategy

Decision:
Use NextAuth (Auth.js) for authentication, wrapped inside LogaCore core abstraction.

Rationale:

- Mature integration with Next.js
- Supports OAuth providers (Google, etc.)
- Speeds up implementation of login/session handling
- Core wrapper allows future replacement without affecting plugins
- Works well with role-based access control (RBAC)

Date:
Owner:

---

### Migration Strategy

Decision:
Plugins ship their own SQL migrations. Core provides a migration runner that executes migrations in order and tracks applied state.

Rationale:

- True modularity per plugin
- No central schema file merging required
- Compatible with plugin lifecycle policy
- Preserves data when plugin is removed
- Avoids Prisma schema merging complexity
- Forward-only migrations in v0.1 for safety

Date:
Owner:

---

### Plugin System Philosophy

Decision:
Build-time plugin inclusion with future-ready runtime enable/disable capability. Data preserved by default when plugin removed. Explicit uninstall required for destructive actions.

Rationale:

- Aligns with Next.js build model
- Prevents accidental data loss
- Supports modular architecture
- Enables future marketplace evolution
- Separates “code inclusion” from “runtime activation”
- Encourages plugin isolation and independence

Date:
Owner:

---

## Additional Agreed Policies

### Repository Strategy

Decision:
Monorepo using pnpm workspaces. No external publishing in v0.1.

Rationale:

- Faster iteration
- Simplified cross-package refactoring
- No premature versioning overhead
- Ideal for small team internal development

Date:
Owner:

---

### UI Strategy

Decision:
TailwindCSS + shadcn/ui with strict component abstraction rules.

Rationale:

- Rapid UI development
- Strong accessibility foundation (Radix primitives)
- No heavy UI framework lock-in
- Fully customizable components
- Enforced component-based usage prevents utility class chaos

Date:
Owner:

---

## Rules

1. No architectural changes without updating this document.
2. All decisions must include rationale.
3. Stability > trend chasing.
4. Plugin modularity must never be compromised for convenience.
5. Data safety takes precedence over aggressive automation.

---

End of Document.
