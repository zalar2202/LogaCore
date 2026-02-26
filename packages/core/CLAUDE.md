# @logacore/core

Platform engine package. The heart of LogaCore.

## What Core Provides

- `definePlugin()` — plugin definition helper with type enforcement
- `defineConfig()` — app configuration helper
- Plugin registry builder (`loadPlugins`)
- Admin shell components (`AdminLayout`, `Sidebar`, `Topbar`)
- RBAC utilities: `can(user, perm)`, `<Require perm="...">`
- tRPC context creation and router merging
- Auth wrapper (NextAuth/Auth.js abstraction)
- Shared TypeScript types and contracts

## What Core Must NOT Contain

- Business logic (no CMS logic, no invoice logic, no CRM logic)
- Feature-specific pages or UI
- Direct database queries for business data
- Plugin-specific types

## File Organization

```
packages/core/
  index.ts              # Public API barrel export
  src/
    plugin/             # definePlugin, PluginDefinition types, registry
    config/             # defineConfig, LogaCoreConfig types
    admin/              # AdminLayout, Sidebar, Topbar, route resolver
    auth/               # NextAuth wrapper, session helpers
    rbac/               # can(), Require component, permission registry
    trpc/               # createContext, protectedProcedure, router merge
    types/              # Shared platform types
```

## Validation Rules (Load-time)

Core must validate at build/load time:
- Unique plugin IDs
- Core version compatibility (`requiredCoreVersion`)
- Dependency presence (`dependsOn`)
- No duplicate admin paths
- No duplicate permission keys

Failures must: fail fast with clear, actionable error messages.

## Export Pattern

All public API exports through `index.ts`. Internal modules are not directly importable by plugins or apps.
