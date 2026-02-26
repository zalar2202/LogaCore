# LogaCore – Plugin Lifecycle Policy (v0.1)

This document defines the official lifecycle rules for plugins inside LogaCore.

The goal is to ensure:

- Architectural consistency
- Safe plugin removal
- Data integrity
- Predictable behavior
- Future scalability toward a marketplace model

This policy applies to all internal and future public plugins.

---

# 1. Core Principles

1. Code inclusion is decided at build time.
2. Runtime enable/disable is controlled via database state (future-ready).
3. Database data is preserved by default.
4. Destructive operations must be explicit.
5. Plugins must be removable without breaking the application.
6. Plugins may not directly depend on other plugins’ database tables.

---

# 2. Plugin States

A plugin can exist in the following states:

1. Not Included
2. Installed
3. Enabled
4. Disabled
5. Removed (Code Removed, Data Preserved)
6. Uninstalled (Code Removed, Data Deleted)

---

# 3. Lifecycle Definitions

## 3.1 Install

Definition:
The plugin is included in the app configuration and migrations are executed.

Triggered by:

- Adding plugin to `logacore.config.ts`
- Running migration process
- Building and deploying the app

Effects:

- Plugin code becomes part of the build
- Plugin migrations run
- Required database tables created
- Plugin entry recorded in `logacore_plugins` table

Example `logacore_plugins` table:

- plugin_id
- installed_at
- enabled
- version_installed
- last_seen_at

---

## 3.2 Enable

Definition:
Plugin is active at runtime.

Effects:

- Navigation items appear in admin
- Routes become accessible
- API procedures available
- Permissions enforced
- Scheduled tasks (if any) run

Important:
Enable/Disable should NOT require rebuild if plugin code is already included.

---

## 3.3 Disable

Definition:
Plugin remains installed but inactive.

Effects:

- Navigation hidden
- Routes blocked
- API endpoints disabled
- Background jobs paused

Database:

- All data remains intact
- No schema changes occur

Purpose:
Allows temporary deactivation without losing state.

---

## 3.4 Remove (Build-Level Removal)

Definition:
Plugin is removed from `logacore.config.ts` and app is rebuilt.

Triggered by:

- Removing plugin from config
- Rebuilding and redeploying app

Effects:

- Plugin code excluded from build
- No UI, routes, or APIs remain
- Permissions removed from runtime registry

Database:

- Tables remain intact
- Data preserved
- Migration history preserved

Re-adding plugin:

- Previous data becomes available again
- Settings restored
- State continues from last known version

Default behavior: SAFE removal.

---

## 3.5 Uninstall (Destructive)

Definition:
Plugin is removed AND all associated data is deleted.

Triggered by:

- Explicit uninstall command
- Admin confirmation process
- Optional CLI command

Effects:

- Drop plugin-owned tables OR
- Delete plugin-owned rows
- Remove plugin entry from `logacore_plugins`
- Mark migration state as cleaned

Requirements:

- Explicit confirmation
- Warning about irreversible action
- Optional automatic backup

This action must never happen silently.

---

# 4. Database Policy

Default Rule:
Removing a plugin does NOT delete its data.

Rationale:

- Prevent accidental data loss
- Allow temporary deactivation
- Support licensing tiers
- Enable reinstallation without data migration

Plugins own their tables and settings.

Core must not automatically rollback migrations unless uninstall is explicitly requested.

---

# 5. Dependency Rules

Plugins must not directly depend on another plugin’s database tables.

If dependency is required:

- Plugin must declare:
  dependsOn: ["plugin-id"]

Core behavior:

- Prevent removal if dependent plugin exists
- Warn before uninstall

Recommended pattern:
Cross-plugin communication should occur via:

- Events
- Hooks
- Service layer contracts

---

# 6. Versioning Policy

Each plugin declares:

- id
- version
- requiredCoreVersion

On build:

- Core validates compatibility
- Migration runner checks schema state
- Optional upgrade hooks may execute

Downgrades are not supported in v0.1.

---

# 7. Future-Proofing for Marketplace Model

This lifecycle model allows:

- Local development (v0.1)
- Enable/disable runtime toggling (v1)
- Marketplace distribution (future)
- Premium plugin tiers
- License-based feature activation

---

# 8. Summary

Removing plugin from build:

- Removes UI and logic
- Preserves database data

Disabling plugin:

- Keeps code included
- Hides functionality

Uninstalling plugin:

- Deletes data explicitly
- Requires confirmation

Primary Principle:
Safety first. Destructive actions must be intentional.

---

End of Document.
