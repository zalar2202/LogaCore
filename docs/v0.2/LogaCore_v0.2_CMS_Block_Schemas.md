# LogaCore v0.2 — CMS Block Schemas (Registry + Validation + Editors)

**Document:** `LogaCore_v0.2_CMS_Block_Schemas.md`  
**Status:** Draft  
**Version:** v0.2  
**Plugin ID:** `cms`  
**Applies to:** Single-site CMS, block-based composition

------------------------------------------------------------------------

## 0. Goals

This document defines the initial **block registry** for the CMS plugin:

-   Canonical block type names
-   `schemaVersion` rules
-   Zod validation shapes for `data`
-   Editor form fields per block
-   Rendering guidance for the public website (optional in v0.2, but
    recommended)

Core philosophy: - **Strict validation** for stored JSON
(`cms_blocks.data`) - **Schema-versioned blocks** to allow safe
evolution without rewrites

------------------------------------------------------------------------

## 1. Registry Contract

Each block type must define:

-   `type: string` (stable identifier)
-   `schemaVersion: number` (integer, starts at 1)
-   `zodSchema: ZodSchema` for `data`
-   `editor` (admin UI form component)
-   `renderer` (public UI component)

Minimum required for v0.2: - `type` - `schemaVersion` - `zodSchema`

------------------------------------------------------------------------

## 2. Shared Field Conventions

### 2.1 Links

Links are represented as:

-   `href`: string (absolute or relative)
-   `label`: string (button/link text)

Zod rules: - `label` length: 1..80 - `href` length: 1..2048 - Allow
`mailto:` and `tel:`

### 2.2 Text

-   `headline`: 1..120
-   `subheadline`: 0..240
-   `title`: 1..120
-   `description`: 0..500

### 2.3 Images (future)

v0.2 does not include a Media plugin. Until then: - Use
`imageUrl?: string` only if needed - Later migrate to `mediaId`
references

------------------------------------------------------------------------

## 3. Block Types (v0.2)

### 3.1 `hero` — Schema v1

**Purpose:** Top section for agency pages

**Data fields** - `headline` (required) - `subheadline` (optional) -
`primaryCta` (optional) - `label` - `href` - `secondaryCta` (optional) -
`label` - `href` - `alignment` (optional): `left | center` - `variant`
(optional): `default | split | minimal` - `background` (optional) -
`mode`: `none | solid | gradient` - `value`: string (css token /
tailwind class / hex)

**Editor fields** - Headline text input - Subheadline textarea - CTA(s)
inputs (label + link) - Alignment dropdown - Variant dropdown -
Background mode + value

**Renderer guidance** - Render headline prominently (H1) - Subheadline
below - CTA buttons

------------------------------------------------------------------------

### 3.2 `richText` — Schema v1

**Purpose:** Flexible content section

**Data fields** - `format`: `markdown` *(v0.2 default)* - `content`
(required): string

**Editor fields** - Large textarea (markdown) - Optional “preview”
toggle (nice-to-have)

**Renderer guidance** - Render markdown to HTML safely - Sanitize output
or use a safe markdown renderer

------------------------------------------------------------------------

### 3.3 `faq` — Schema v1

**Purpose:** Common agency FAQ block

**Data fields** - `title` (optional) - `items` (required): array of
objects - `question` (required) - `answer` (required, markdown)

Validation rules: - `items` length 1..30 - `question` length 1..160 -
`answer` length 1..1200

**Editor fields** - Optional title - Repeating group for items: -
question input - answer textarea (markdown) - Reorder items up/down -
Remove item

**Renderer guidance** - Accordion UI on public site

------------------------------------------------------------------------

### 3.4 `cta` — Schema v1

**Purpose:** Call-to-action panel

**Data fields** - `title` (required) - `description` (optional) -
`button` (required) - `label` - `href` - `style` (optional):
`primary | neutral | outlined`

**Editor fields** - Title input - Description textarea - Button
label/link - Style dropdown

**Renderer guidance** - Card/banner with button

------------------------------------------------------------------------

### 3.5 `features` — Schema v1

**Purpose:** List of service features / differentiators

**Data fields** - `title` (optional) - `subtitle` (optional) - `items`
(required): array of objects - `title` (required) - `description`
(optional) - `iconKey` (optional) string

Validation rules: - `items` length 1..24 - `iconKey` is a string
identifier (mapped to an icon set in UI)

**Editor fields** - Optional title/subtitle - Repeating items
(add/remove/reorder) - Icon key input (optional)

**Renderer guidance** - Grid layout (2–4 columns depending on screen)

------------------------------------------------------------------------

### 3.6 `servicesGrid` — Schema v1 *(optional but recommended for agency apps)*

**Purpose:** Agency services listing with links

**Data fields** - `title` (optional) - `items` (required): array of
objects - `name` (required) - `summary` (optional) - `href` (optional) -
`iconKey` (optional)

Validation rules: - `items` length 1..24

**Editor fields** - Repeating items (add/remove/reorder) - Name,
summary, link, icon key

**Renderer guidance** - Grid of service cards linking to service pages

------------------------------------------------------------------------

## 4. Zod Shape Reference (Implementation Template)

> This section is a reference for the implementation team. Exact code
> can live in `plugins/cms/blocks/registry.ts`.

### 4.1 Common helpers (conceptual)

-   `linkSchema`:
    `{ label: z.string().min(1).max(80), href: z.string().min(1).max(2048) }`
-   `backgroundSchema`:
    `{ mode: z.enum(['none','solid','gradient']), value: z.string().max(128) }`

### 4.2 Block schemas (conceptual)

-   heroV1
-   richTextV1
-   faqV1
-   ctaV1
-   featuresV1
-   servicesGridV1

Rules: - Store exactly validated JSON in DB - On read, validate again
and fail gracefully (log + skip block) if corrupt

------------------------------------------------------------------------

## 5. Schema Versioning & Upgrades

### 5.1 Principles

-   Do not mutate the meaning of an existing schemaVersion
-   Add new optional fields within the same version if
    backward-compatible
-   If changing shape, bump `schemaVersion` and define upgrade behavior

### 5.2 Upgrade strategies

1.  **DB migration** that updates existing JSON rows (for large-scale
    changes)
2.  **Runtime upgrade function** during read (for small changes)
    -   Example: `upgradeHeroV1ToV2(data)`

v0.2 recommendation: - Prefer runtime upgrade for small evolutions - Use
DB migrations when a field rename or major reshape happens

------------------------------------------------------------------------

## 6. Editor UX Standards (Reusable Patterns)

To make CMS “stand out” consistently across apps:

-   All blocks show:
    -   Type label
    -   Name (admin label)
    -   Status (draft/published/archived)
    -   Updated timestamp
-   All block editors:
    -   Validate on submit
    -   Show inline field errors
    -   Have a clear publish/unpublish action
-   Repeating groups (FAQ/features/services):
    -   Add/remove/reorder supported
    -   No silent deletion; confirm remove for non-empty items

------------------------------------------------------------------------

## 7. Public Rendering Guidance (v0.2)

Even if rendering is implemented in the app (not in plugin), the
contract should be:

-   `type` determines which renderer component to use
-   `schemaVersion` selects appropriate renderer (or upgrade then
    render)
-   Unknown block types:
    -   Log warning
    -   Skip block (do not crash page)

------------------------------------------------------------------------

## 8. Definition of Done (Block Schemas v0.2)

-   Registry contains at least: `hero`, `richText`, `faq`, `cta`,
    `features`
-   Each block has:
    -   zod schema
    -   admin editor UI form fields mapped
-   CMS API validates `data` strictly on create/update
-   Public render layer can render all v0.2 blocks

------------------------------------------------------------------------

## 9. Next Extensions (v0.3+)

-   Media references (replace `imageUrl` with `mediaId`)
-   Advanced layout controls (spacing/padding/theme variants)
-   Templates (page presets)
-   Custom block registration from other plugins
-   Revisions & preview tokens
