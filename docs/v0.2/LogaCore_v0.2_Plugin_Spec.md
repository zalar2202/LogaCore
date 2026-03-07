# LogaCore v0.2 — Plugin Specification

## 1. Purpose

Formalize plugin expectations and lifecycle for v0.2.

------------------------------------------------------------------------

## 2. Plugin Structure

Each plugin must include:

-   manifest.ts
-   migrations/
-   api/ (tRPC routers)
-   admin/ (pages & nav config)
-   permissions definition

------------------------------------------------------------------------

## 3. Manifest Requirements

Required fields:

-   id
-   name
-   version
-   requiredCoreVersion
-   permissions\[\]
-   adminRoutes\[\]

Optional:

-   dependsOn\[\]

------------------------------------------------------------------------

## 4. Plugin Lifecycle

States:

-   Installed
-   Enabled (via config)
-   Disabled (removed from config)
-   Uninstalled (destructive)

Removing plugin from config: - Removes routes - Removes nav - Removes
permissions from runtime - Does NOT drop tables

------------------------------------------------------------------------

## 5. First Real Plugin: CMS

v0.2 validation plugin.

### CMS Requirements

-   Content table
-   Slug support
-   Draft/publish state
-   CRUD admin pages
-   Permission gates:
    -   cms.create
    -   cms.edit
    -   cms.publish
    -   cms.delete

Purpose:

Validate forms, RBAC, migrations, admin integration, and API
enforcement.

------------------------------------------------------------------------

## 6. Plugin Validation Rules

-   No route collisions
-   No permission namespace overlap
-   Valid dependency resolution
-   Valid migration ordering

------------------------------------------------------------------------

## 7. Definition of Plugin Success

A plugin is production-ready when:

-   Fully guarded by RBAC
-   Has migrations tracked
-   Has clear uninstall strategy
-   Integrates cleanly into admin shell
