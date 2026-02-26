# LogaCore – CLI Scaffolding Guide (v0.1)

This document explains how the LogaCore CLI scaffolding system works,
what it generates, and how presets are structured.

The purpose of the CLI is to standardize project creation,
reduce repetitive setup work, and ensure architectural consistency.

---

# 1. Purpose of the CLI

The CLI is responsible for:

- Creating new LogaCore applications
- Applying predefined presets
- Wiring core + selected plugins
- Generating configuration files
- Preparing environment templates
- Bootstrapping admin + auth structure

It removes the need to manually copy project boilerplate.

---

# 2. Basic Command Structure

Example command:

    create-logacore-app my-client-portal --preset agency

This command:

1. Creates a new app folder under `apps/`
2. Applies the selected preset
3. Generates required configuration files
4. Links required plugins
5. Prepares environment template

---

# 3. Internal Monorepo Model (v0.1)

In v0.1, LogaCore operates inside a monorepo.

Structure example:

logacore/
apps/
packages/
plugins/
docs/

Plugins are NOT copied into the app folder.
They exist under `/plugins` and are linked using pnpm workspaces.

The scaffolded app references them like this:

    "@logacore/plugin-cms": "workspace:*"

No publishing or external registry required.

---

# 4. What the CLI Generates

For a new app, the CLI generates:

- Next.js app (App Router structure)
- logacore.config.ts
- package.json (with required plugin dependencies)
- .env.example
- Admin shell wiring
- Auth configuration (pre-wired)
- Default layout structure

The app should be runnable immediately with:

    pnpm dev

---

# 5. Presets

A preset defines:

- List of plugins
- Default configuration
- Optional seed data
- Optional theme adjustments

Example: Agency Preset

Includes:

- CMS
- Invoices
- Email
- Clients

The CLI writes the plugin list into:

logacore.config.ts

Example:

export default defineConfig({
plugins: [
"@logacore/plugin-cms",
"@logacore/plugin-invoices",
"@logacore/plugin-email"
]
});

---

# 6. Authentication Setup

Authentication is pre-wired in the template.

The scaffolded project includes:

- Auth configuration file
- Protected /admin routes
- Role-based access control setup

Only environment variables (e.g., provider keys) need adjustment.

No manual rewiring required.

---

# 7. Plugin Inclusion Behavior

Plugin inclusion is decided at build time.

If a plugin is listed in `logacore.config.ts`:

- It is compiled into the build
- Its migrations are applied
- Its routes become available
- Its admin navigation appears

Removing a plugin from config requires rebuild.

---

# 8. Migration Handling During Scaffold

After scaffold:

1. Developer runs:
   pnpm db:migrate

2. Core migration runner:
   - Detects plugin migrations
   - Executes in order
   - Records in `logacore_migrations` table

---

# 9. v0.1 Scope Limitations

The CLI does NOT:

- Dynamically install plugins at runtime
- Download plugins from a marketplace
- Modify running production instances

It prepares the project at development time only.

---

# 10. Future Expansion Possibilities

In later versions, the CLI may support:

- External template repositories
- Version selection
- Marketplace plugin installation
- Automated deployment bootstrapping

These are NOT part of v0.1.

---

# 11. Summary

The LogaCore CLI:

- Standardizes project creation
- Enforces architectural discipline
- Links plugins via workspace
- Pre-wires authentication and admin
- Applies presets for common use cases

It is a productivity tool — not a dynamic runtime installer.

---

End of Document.
