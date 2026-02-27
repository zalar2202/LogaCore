# LogaCore v0.2 — CMS Plugin Technical Specification (Single-site, Block-based)

**Document:** `LogaCore_v0.2_CMS_Plugin_Technical_Spec.md`  
**Status:** Draft  
**Version:** v0.2  
**Plugin ID:** `cms`  
**Scope:** Agency apps (single site per app), reusable block-based CMS

------------------------------------------------------------------------

## 0. Context & Goals

### What we already assume exists (Core)

-   Admin shell framework with plugin page registration and navigation
    injection
-   Auth wired to PostgreSQL via Drizzle
-   RBAC system with permission checks (or in-progress in v0.2 core)
-   Plugin loader that includes/excludes plugins at build-time via
    config

### CMS plugin goals (v0.2)

Build a **small-but-real** CMS that: - Proves plugin migrations
(tables + evolvable schema) - Proves RBAC guard enforcement on both UI
routes and API mutations - Provides a **block/section-based** authoring
model usable for agency sites - Supports publish/unpublish and public
read APIs (published-only) - Establishes reusable admin UI patterns
(lists, forms, validation, publish flow)

### Non-goals (v0.2)

-   Media library (separate plugin later)
-   WYSIWYG editor (use structured block forms in v0.2)
-   Revisions/version history (v0.3+)
-   Multi-site/multi-client content isolation (explicitly **single-site
    per app**)
-   i18n, workflows, approvals, A/B tests

------------------------------------------------------------------------

## 1. Content Model (Block-Based, Single Site)

### 1.1 Entities

-   **Page**: publishable container with a unique `slug` and ordered
    block composition
-   **Block**: reusable content unit with `type`, `schemaVersion`, and
    `data` stored as JSON
-   **PageBlock**: join entity representing an ordered block instance on
    a page

### 1.2 Key design principles

1.  **Pages are composition**: page content is primarily the ordered
    list of blocks
2.  **Blocks are reusable**: a single block can be used on multiple
    pages
3.  **Block schemas are versioned**: each block has a `schemaVersion`
    for safe evolution
4.  **Public read = published-only**: public endpoints never return
    drafts

------------------------------------------------------------------------

## 2. Permissions (RBAC)

### 2.1 Permission list

-   `cms.view`
-   `cms.create`
-   `cms.edit`
-   `cms.publish`
-   `cms.delete`
-   `cms.settings` *(optional for later settings page)*

### 2.2 Enforcement rules

-   Admin list/detail pages require `cms.view`
-   Create page/block requires `cms.create`
-   Update page/block requires `cms.edit`
-   Publish/unpublish requires `cms.publish`
-   Delete requires `cms.delete`
-   Public read endpoints require **no** CMS permissions (but enforce
    `published` visibility)

------------------------------------------------------------------------

## 3. Admin Routes & Navigation

### 3.1 Navigation

**CMS** - Pages - Blocks

### 3.2 Admin routes

**Pages** - `/admin/cms/pages` — list pages - `/admin/cms/pages/new` —
create page - `/admin/cms/pages/[id]` — edit page (including
composition/reordering blocks)

**Blocks** - `/admin/cms/blocks` — list blocks - `/admin/cms/blocks/new`
— create block - `/admin/cms/blocks/[id]` — edit block

Optional future: - `/admin/cms/settings`

### 3.3 Route guards

-   Admin router must enforce permission checks on route entry
-   Each page should declare its required permission(s) in its
    registration metadata

------------------------------------------------------------------------

## 4. Database Schema (PostgreSQL + Drizzle)

> Naming convention: prefix with `cms_` to avoid collisions across
> plugins.

### 4.1 Enums

-   `cms_status`: `draft`, `published`, `archived`

### 4.2 Tables

#### 4.2.1 `cms_pages`

| Column               | Type        | Notes                       |
|----------------------|-------------|-----------------------------|
| `id`                 | uuid (PK)   | default `gen_random_uuid()` |
| `title`              | text        | required                    |
| `slug`               | text        | required, unique            |
| `status`             | cms_status  | default `draft`             |
| `seo_title`          | text        | nullable                    |
| `seo_description`    | text        | nullable                    |
| `created_at`         | timestamptz | default now                 |
| `updated_at`         | timestamptz | default now                 |
| `published_at`       | timestamptz | nullable                    |
| `created_by_user_id` | uuid        | FK to core users table      |
| `updated_by_user_id` | uuid        | FK to core users table      |

Indexes/constraints: - Unique index on `slug` - Index on `status` -
Index on `published_at`

#### 4.2.2 `cms_blocks`

| Column               | Type        | Notes                                                       |
|----------------------|-------------|-------------------------------------------------------------|
| `id`                 | uuid (PK)   | default `gen_random_uuid()`                                 |
| `name`               | text        | required (admin label)                                      |
| `type`               | text        | required (e.g., `hero`, `faq`, `cta`, `richText`, `custom`) |
| `schema_version`     | int         | required, default 1                                         |
| `status`             | cms_status  | default `draft`                                             |
| `data`               | jsonb       | required (validated by block-type schema)                   |
| `created_at`         | timestamptz | default now                                                 |
| `updated_at`         | timestamptz | default now                                                 |
| `published_at`       | timestamptz | nullable                                                    |
| `created_by_user_id` | uuid        | FK                                                          |
| `updated_by_user_id` | uuid        | FK                                                          |

Indexes: - Index on `type` - Index on `status`

#### 4.2.3 `cms_page_blocks`

Represents ordered composition and per-page overrides (future).

| Column       | Type        | Notes                                     |
|--------------|-------------|-------------------------------------------|
| `id`         | uuid (PK)   | default `gen_random_uuid()`               |
| `page_id`    | uuid        | FK -\> `cms_pages.id` (on delete cascade) |
| `block_id`   | uuid        | FK -\> `cms_blocks.id`                    |
| `sort_order` | int         | required                                  |
| `created_at` | timestamptz | default now                               |

Constraints: - Unique `(page_id, sort_order)` - Optional unique
`(page_id, block_id)` if you want to prevent duplicates (NOT
recommended; allow reuse within a page)

Indexes: - Composite index `(page_id, sort_order)` - Index on `block_id`

### 4.3 Migration policy

-   CMS plugin owns its migrations under `plugins/cms/migrations`
-   Migrations are tracked by core migration runner
-   Removing CMS from config does **not** drop tables
-   “Uninstall CMS” is an explicit destructive operation (later)

------------------------------------------------------------------------

## 5. Block Types & Schemas (v0.2)

### 5.1 Block registry

CMS defines a registry of supported block types. Each block type has: -
`type` string - `schemaVersion` integer - `zodSchema` for `data` -
`adminEditor` component (form UI) - `renderer` component for public site
(optional in v0.2 but recommended)

### 5.2 Default block types (v0.2)

These are minimal, but cover most agency pages:

1.  **hero** (schemaVersion 1)
    -   headline, subheadline, primaryCtaText, primaryCtaHref,
        backgroundStyle (simple)
2.  **richText** (schemaVersion 1)
    -   content (markdown string) OR structured JSON (choose one in
        implementation; markdown is simpler)
3.  **faq** (schemaVersion 1)
    -   items: \[{ question, answer }\]
4.  **cta** (schemaVersion 1)
    -   title, description, buttonText, buttonHref
5.  **features** (schemaVersion 1)
    -   items: \[{ title, description, icon? }\]

> Note: In v0.2, “icon” can be a string key; real icon mapping can be
> UI-side.

### 5.3 Schema evolution rule

-   Never silently change meaning of an existing schema version
-   If changing shape, bump `schema_version` and provide migration path:
    -   either DB migration that updates stored JSON
    -   or runtime upgrade function during read (preferred for small
        changes)

------------------------------------------------------------------------

## 6. API (tRPC) — Admin & Public

### 6.1 Conventions

-   All admin mutations require authentication + RBAC permissions
-   Admin reads require `cms.view`
-   Public reads require no auth, but enforce published visibility

### 6.2 Admin routers

#### Pages

-   `cms.page.list` *(perm: cms.view)*
    -   filters: status, search (title/slug), pagination
-   `cms.page.get` *(perm: cms.view)*
    -   by id, includes ordered blocks
-   `cms.page.create` *(perm: cms.create)*
    -   title, slug, seo fields (optional)
-   `cms.page.update` *(perm: cms.edit)*
    -   title/slug/seo/status (draft/archived)
-   `cms.page.publish` *(perm: cms.publish)*
    -   sets status published, sets published_at
-   `cms.page.unpublish` *(perm: cms.publish)*
    -   sets status draft, clears published_at
-   `cms.page.delete` *(perm: cms.delete)*
    -   deletes page and its `cms_page_blocks` rows

#### Page composition

-   `cms.page.blocks.set` *(perm: cms.edit)*
    -   input: pageId + ordered list of blockIds (and optional per-item
        metadata later)
    -   behavior: replace composition in one transaction
-   `cms.page.blocks.add` *(perm: cms.edit)*
-   `cms.page.blocks.remove` *(perm: cms.edit)*
-   `cms.page.blocks.reorder` *(perm: cms.edit)*

#### Blocks

-   `cms.block.list` *(perm: cms.view)*
    -   filters: type/status/search
-   `cms.block.get` *(perm: cms.view)*
-   `cms.block.create` *(perm: cms.create)*
    -   name, type, schemaVersion, data
-   `cms.block.update` *(perm: cms.edit)*
-   `cms.block.publish` *(perm: cms.publish)*
-   `cms.block.unpublish` *(perm: cms.publish)*
-   `cms.block.delete` *(perm: cms.delete)*
    -   if block used on pages: either prevent delete or allow with
        cascading removal from pages (choose one)
    -   v0.2 recommendation: **prevent delete if referenced**, provide
        “archive” instead

### 6.3 Public routers (published only)

-   `cms.public.pageBySlug`
    -   input: slug
    -   returns: page (published only) + ordered blocks (published
        blocks only)
-   `cms.public.sitemap`
    -   returns: list of published slugs + updatedAt/publishedAt

------------------------------------------------------------------------

## 7. Admin UI Behavior (v0.2)

### 7.1 Pages list

-   Columns: title, slug, status, updatedAt, publishedAt
-   Actions:
    -   Edit
    -   Publish/Unpublish (if permissions allow)
    -   Archive (optional)
-   Filters: status, search
-   Empty state + CTA “Create your first page”

### 7.2 Page editor

Sections: - Basic: title, slug - SEO: seo_title, seo_description -
Composition: - ordered list of blocks - add existing blocks - create new
block (inline modal) (optional) - drag-and-drop reorder (or up/down
buttons) - Publish controls: - publish/unpublish - warnings if no blocks

### 7.3 Blocks list

-   Columns: name, type, status, updatedAt
-   Filters: type, status, search
-   Actions: edit, publish/unpublish, archive

### 7.4 Block editor

-   Select type (only on create)
-   Render type-specific form based on registry schema
-   Validate using zod
-   Show “schemaVersion” (read-only)
-   Preview (optional in v0.2; recommended in v0.3)

------------------------------------------------------------------------

## 8. Data Validation

### 8.1 Slug rules

-   Lowercase
-   `a-z0-9-` only
-   Trim duplicate dashes
-   Must be unique

Validation performed: - client-side (form) - server-side (API) -
enforced in DB with unique index

### 8.2 Block `data` validation

-   Validate against registry zod schema for that `type` +
    `schemaVersion`
-   Reject unknown types (unless `custom` is allowed)
-   For `custom` type:
    -   v0.2 recommendation: **disallow** unless you have a safe schema
        strategy
    -   if allowed, require a `customSchemaId`

------------------------------------------------------------------------

## 9. Deletion, Archiving, and Safety

### 9.1 Recommended deletion policy (v0.2)

-   **Pages**: deletable (admin action), remove joins automatically
-   **Blocks**:
    -   If block is used by any page, do not allow delete; allow archive
    -   If unused, delete is allowed

### 9.2 Archiving

-   Set status `archived`
-   Archived items are hidden from public reads
-   Admin lists can filter archived items

------------------------------------------------------------------------

## 10. Events & Audit Hooks (Optional but recommended)

If core supports auditing hooks: - On
create/update/publish/unpublish/delete for pages and blocks emit
events: - `cms.page.created` - `cms.page.updated` -
`cms.page.published` - `cms.page.unpublished` - `cms.block.created` -
etc.

These can feed the v0.2 Audit Log plugin later.

------------------------------------------------------------------------

## 11. Future Extensions (v0.3+)

Planned upgrades that should not require a rewrite if v0.2 is
implemented as above: - Media plugin integration (block fields
referencing media IDs) - Revisions/version history - Scheduled
publishing - Page templates - i18n - Full preview links with draft
tokens - Custom fields framework - Rendering optimizations (ISR,
caching, CDN)

------------------------------------------------------------------------

## 12. Definition of Done (CMS v0.2)

CMS plugin is considered complete when: - DB schema exists and
migrations run via core migration runner - Admin pages exist for Pages
and Blocks (list + create + edit) - Composition editing works
(add/remove/reorder blocks) - RBAC guards are enforced in UI and API -
Publish/unpublish works; public endpoints return published content
only - Removal from plugin config removes routes/nav/permissions without
destroying data

------------------------------------------------------------------------

## 13. Implementation Checklist (Engineering)

-   [ ] Define Drizzle schema for `cms_pages`, `cms_blocks`,
    `cms_page_blocks`
-   [ ] Write initial migrations
-   [ ] Implement block registry + zod schemas
-   [ ] Build tRPC router (admin + public)
-   [ ] Add RBAC guards to all procedures
-   [ ] Build admin UI: pages list/editor, blocks list/editor
-   [ ] Implement composition persistence (transactional replace)
-   [ ] Add slug validation (client + server + DB)
-   [ ] Add safety rules for block deletion (prevent if referenced)
-   [ ] Smoke test: create page + blocks, publish, fetch by slug
    publicly
