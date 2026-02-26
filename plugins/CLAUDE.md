# LogaCore Plugins

Every folder here is a self-contained plugin package.

## Plugin Structure (Required)

```
plugins/<id>/
  src/
    index.ts            # Must export: export const plugin = definePlugin({...})
    admin/
      pages/            # React components for admin UI
    api/
      router.ts         # tRPC router (namespaced by plugin ID)
    services/           # Business logic layer (UI and API both call services)
    types/              # Plugin-specific types
  migrations/
    001_description.sql # Forward-only SQL migrations
    002_description.sql
  package.json          # name: @logacore/plugin-<id>
```

## Plugin Definition (Required Fields)

Every plugin must call `definePlugin()` with at minimum:
- `id`: string — lowercase kebab-case, permanent once set
- `name`: string — human-readable display name
- `version`: string — semver (e.g., `0.1.0`)
- `requiredCoreVersion`: string — semver range (e.g., `^0.1.0`)

## Rules

- Import `definePlugin` from `@logacore/core`, not from relative paths.
- Services must use the core DB client. Never create direct DB connections.
- tRPC routers must validate all inputs with Zod.
- Permissions use the format: `<plugin-id>.<action>`
- Admin routes must be under `/admin/<plugin-id>/`
- Hooks must be idempotent.
- Plugins must not directly depend on another plugin's DB tables.
- Cross-plugin communication: use events/hooks, not direct imports.

## Migration Rules

- SQL files only. Numeric prefix for ordering (`001_`, `002_`).
- Forward-only in v0.1. No down/rollback migrations.
- Removing plugin from config does NOT delete its tables.
- Table names should be prefixed with plugin ID to avoid collisions.

## Checklist Before Declaring a Plugin Complete

- [ ] Required metadata fields present (id, name, version, requiredCoreVersion)
- [ ] At least one of: admin page, API router, or migrations
- [ ] All permissions declared in plugin definition
- [ ] All tRPC inputs validated with Zod
- [ ] Service layer used (no direct DB calls from UI or route handlers)

## Reference

- Full spec: `docs/v.01/LogaCore_Plugin_Interface_Spec_v0.1.md`
- Lifecycle: `docs/v.01/LogaCore_Plugin_Lifecycle_Policy.md`
