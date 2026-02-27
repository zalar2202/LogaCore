# LogaCore v0.2 — Core Specification

## 1. Purpose

Define the hardened Core layer responsible for:

-   Plugin loading & validation
-   Admin shell framework
-   Auth integration
-   RBAC enforcement
-   Migration orchestration
-   Version compatibility checks

This document formalizes Core responsibilities in v0.2.

------------------------------------------------------------------------

## 2. Core Responsibilities

### 2.1 Plugin Loader

Core must:

-   Load plugins from configuration before build
-   Validate plugin manifest schema
-   Enforce unique plugin IDs
-   Enforce route uniqueness
-   Validate dependency graph
-   Validate requiredCoreVersion compatibility

Startup must fail fast on violation.

------------------------------------------------------------------------

### 2.2 Admin Shell

Core provides:

-   Global layout
-   Sidebar navigation framework
-   Page wrapper API
-   Route protection guard
-   Plugin page registration surface

Plugins must not directly manipulate routing internals.

------------------------------------------------------------------------

### 2.3 RBAC Enforcement Layer

Core owns:

-   Roles table
-   Role-permission mapping
-   User-role mapping
-   Superadmin override
-   Permission guard middleware

Permission naming convention:

pluginId.action

------------------------------------------------------------------------

### 2.4 Migration Runner

Core must:

-   Run core migrations first
-   Run plugin migrations deterministically
-   Track executed migrations
-   Prevent duplicate execution
-   Support safe plugin removal (no auto-drop)

------------------------------------------------------------------------

### 2.5 Version Governance

Core must enforce:

-   requiredCoreVersion
-   Plugin version tracking
-   Migration version compatibility

------------------------------------------------------------------------

## 3. Non-Goals (v0.2)

-   Marketplace
-   Runtime plugin enable/disable
-   Multi-tenant SaaS

------------------------------------------------------------------------

## 4. Definition of Core Stability

Core is stable when:

-   3 production-grade plugins run without contract changes
-   No breaking changes required to plugin manifest
-   Migration runner handles upgrades cleanly
