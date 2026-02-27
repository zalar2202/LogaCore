# LogaCore v0.2 — CMS Admin UI Patterns

**Document:** `LogaCore_v0.2_CMS_Admin_UI_Patterns.md`  
**Status:** Draft  
**Version:** v0.2  
**Plugin ID:** `cms`  
**Applies to:** Admin shell UI patterns for Pages & Blocks management

------------------------------------------------------------------------

## 0. Purpose

This document standardizes the CMS admin UI so it is:

-   Consistent across apps
-   Fast to implement (repeatable patterns)
-   Safe (RBAC-aware, publish-confirmations, deletion safeguards)
-   Extensible for future CMS Pro features (revisions, media, templates)

These UI patterns should be treated as the reference design for other
admin plugins as well.

------------------------------------------------------------------------

## 1. Global UX Principles

### 1.1 Consistency

-   Same page structure for list/detail pages
-   Same action button placement (Create, Publish, Delete)
-   Same terminology across all CMS screens (Page, Block, Draft,
    Published, Archived)

### 1.2 Safety

-   Destructive actions require confirmation
-   Publish/unpublish actions require confirmation (lightweight)
-   Prevent deleting referenced blocks; prefer archive

### 1.3 RBAC Visibility

-   Hide actions the user cannot do
-   Still enforce permissions server-side (UI is not security)

### 1.4 Performance baseline

-   Lists are paginated
-   Search is debounced
-   Avoid loading block JSON payloads in lists unless needed

------------------------------------------------------------------------

## 2. Navigation & Information Architecture

### 2.1 Sidebar nav group

**CMS** - Pages - Blocks

Optional later: - Settings

### 2.2 Breadcrumb standard

-   `Admin / CMS / Pages`
-   `Admin / CMS / Pages / <Page Title>`
-   `Admin / CMS / Blocks`
-   `Admin / CMS / Blocks / <Block Name>`

------------------------------------------------------------------------

## 3. List Page Pattern (Pages & Blocks)

### 3.1 Layout template

1.  **Header row**
    -   Title (e.g. “Pages”)
    -   Subtext (optional) explaining purpose
    -   Primary CTA button (“Create Page” / “Create Block”) if allowed
2.  **Toolbar row**
    -   Search input (title/slug/name)
    -   Status filter (Draft/Published/Archived/All)
    -   Type filter (Blocks only)
    -   Sort dropdown (Updated desc default)
    -   Optional: bulk actions (future)
3.  **Table/List**
    -   Rows with quick actions
    -   Status badges
    -   Updated timestamp
    -   Published timestamp where relevant
4.  **Pagination**
    -   Next/prev
    -   Page size (optional)

### 3.2 Empty state

If no items exist: - Message: “No pages yet” / “No blocks yet” - CTA
button if user has create permission - If user cannot create: show
read-only guidance

### 3.3 Search and filter behavior

-   Search is debounced (300–500ms)
-   Filters are reflected in URL query params
-   “All” status shows everything including archived (optional toggle)

### 3.4 Row quick actions (RBAC)

Show icons or compact buttons: - Edit (requires view at minimum; editing
requires edit) - Publish/Unpublish (requires publish) - Archive
(requires edit or publish; decide policy) - Delete (requires delete;
show only if allowed and safe)

------------------------------------------------------------------------

## 4. Page Editor Pattern

### 4.1 Page editor layout

Two-column layout recommended:

**Main column** - Title - Slug - SEO fields (collapsible section) -
Composition (block list + reorder + add)

**Side column (sticky)** - Status (draft/published/archived) - Publish
controls - Last updated metadata - Destructive actions (Archive/Delete)
separated visually

### 4.2 Title & slug behavior

-   Title required, slug required
-   Slug auto-generates from title on create until user manually edits
    slug
-   Server validates slug uniqueness and format
-   On slug conflict: inline error + suggested alternative

### 4.3 Save model (v0.2)

Simple and reliable: - Explicit “Save Draft” button (or “Save”) -
Optional autosave later (v0.3+) - After save: - toast “Saved” - updated
timestamp refreshes

### 4.4 Publish flow

-   Publish button visible only with `cms.publish`
-   On publish click:
    -   Confirm modal: “Publish this page?”
    -   Optional checklist warnings:
        -   No blocks attached
        -   Has draft-only blocks attached (see 4.6)
-   Publish action sets:
    -   page status = published
    -   publishedAt = now

### 4.5 Unpublish flow

-   Confirm modal: “Unpublish this page?”
-   Sets status draft and clears publishedAt

### 4.6 Block publishing interaction

Rules for v0.2 (recommended): - Public rendering returns only
**published blocks** - Therefore a published page with draft blocks will
render missing sections

UI guidance: - Composition list shows block status badges - When
publishing a page: - warn if any referenced blocks are not published -
offer quick links to publish those blocks

(Alternative policy: allow public rendering to include draft blocks for
published pages — NOT recommended.)

------------------------------------------------------------------------

## 5. Block Editor Pattern

### 5.1 Block editor layout

Same two-column approach:

**Main column** - Block Name (admin label) - Type (read-only after
create) - Type-specific editor form - Optional preview (future)

**Side column** - Status badge - Publish/unpublish controls - Schema
version (read-only) - Delete/archive section

### 5.2 Type selection on create

-   On “Create Block”, user selects type first
-   Then editor shows appropriate form fields
-   Show short description per type (Hero, FAQ, etc.)

### 5.3 Type-specific validation

-   Validate with zod schema on submit
-   Inline field errors
-   Prevent save if invalid

### 5.4 Publish flow

-   Confirm modal: “Publish this block?”
-   Sets:
    -   block status = published
    -   publishedAt = now

### 5.5 Deletion behavior (safety)

Recommended v0.2: - If block is referenced by any page, do **not** allow
delete - show “This block is used on X pages. Archive instead.” - If
unused, allow delete with confirmation

Archive behavior: - Sets status archived - Archived blocks are not
returned to public rendering - Keep them visible in admin with Archived
filter

------------------------------------------------------------------------

## 6. Composition Editor (Block Picker + Reorder)

### 6.1 Composition list (on Page editor)

-   Shows ordered blocks for the page
-   Each row includes:
    -   drag handle (or up/down buttons)
    -   block name
    -   type badge
    -   status badge
    -   quick link to open block in new tab
    -   remove button (with confirm if needed)

### 6.2 Add block flow

Two options: 1. **Add existing block** - Opens modal with
searchable/paginated list - Filters by type/status - Select and add

2.  **Create new block**
    -   Opens modal wizard:
        -   select type
        -   minimal editor
        -   save
        -   auto-add to composition

v0.2 recommendation: - Implement “Add existing” first - Add “Create in
modal” if time permits

### 6.3 Reorder behavior

-   Prefer drag-and-drop if the UI toolkit supports it well
-   Otherwise use up/down controls
-   Persist reorder using a single transactional API call:
    -   `cms.page.blocks.set(pageId, orderedBlockIds)`

### 6.4 Remove behavior

-   Removing from page does not delete the block
-   Remove confirmation only if block is published (optional)
-   After remove, composition updates immediately

------------------------------------------------------------------------

## 7. Error Handling & Messaging

### 7.1 Standard errors

-   Slug already exists
-   Permission denied
-   Item not found
-   Validation failed

### 7.2 UX rules

-   Field-level errors inline
-   Global errors as toast/banner
-   Permission denied shows a friendly “You don’t have access to this
    action” message

### 7.3 Not-found behavior

-   If page/block deleted or inaccessible:
    -   show “Not found” screen
    -   provide link back to list

------------------------------------------------------------------------

## 8. URL & State Conventions

-   List filters stored in URL query params:
    -   `?q=...&status=published&type=hero&page=2`
-   Editor pages use stable IDs:
    -   `/admin/cms/pages/<id>`
    -   `/admin/cms/blocks/<id>`
-   Do not store large editor state in URL

------------------------------------------------------------------------

## 9. Reusable Components (Suggested)

These components should ideally live in a shared admin UI package to
help other plugins:

-   `AdminPageHeader` (title + action slots)
-   `AdminToolbar` (search + filters + sort)
-   `StatusBadge`
-   `ConfirmDialog`
-   `EmptyState`
-   `PaginatedTable`
-   `TwoColumnEditorLayout`
-   `BlockPickerModal`
-   `ReorderableList`

------------------------------------------------------------------------

## 10. Definition of Done (Admin UI Patterns)

CMS admin UI is considered aligned with v0.2 when:

-   Pages list supports search, status filter, pagination
-   Blocks list supports search, status filter, type filter, pagination
-   Page editor supports title/slug/SEO + composition editing
-   Block editor supports type-specific editing and publishing
-   Publish/unpublish flows exist with confirmation
-   Deletion/archiving rules are safe and enforced
-   RBAC visibility is implemented and server-side guards exist

------------------------------------------------------------------------

## 11. Future UI Extensions (v0.3+)

-   Inline previews (page preview links)
-   Autosave drafts
-   Revisions timeline
-   Block templates/presets
-   Media picker integration
-   Bulk actions (archive/delete)
-   Page templates and cloning
