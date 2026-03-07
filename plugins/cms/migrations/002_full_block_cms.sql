-- 002_full_block_cms.sql
-- Upgrades the CMS to a block-based structure with pages and reusable components.

CREATE TABLE "cms_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"status" text NOT NULL DEFAULT 'draft',
	"seo_title" text,
	"seo_description" text,
	"author_id" text REFERENCES "users"("id"),
	"created_at" timestamptz DEFAULT now(),
	"updated_at" timestamptz DEFAULT now(),
	"published_at" timestamptz
);

CREATE TABLE "cms_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"type" text NOT NULL,
	"schema_version" integer NOT NULL DEFAULT 1,
	"status" text NOT NULL DEFAULT 'draft',
	"data" jsonb NOT NULL DEFAULT '{}',
	"created_at" timestamptz DEFAULT now(),
	"updated_at" timestamptz DEFAULT now(),
	"published_at" timestamptz,
	"updated_by" text REFERENCES "users"("id")
);

CREATE TABLE "cms_page_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"page_id" uuid NOT NULL REFERENCES "cms_pages"("id") ON DELETE CASCADE,
	"block_id" uuid NOT NULL REFERENCES "cms_blocks"("id"),
	"sort_order" integer NOT NULL,
	"created_at" timestamptz DEFAULT now()
);

-- Indexing for performance
CREATE INDEX "idx_cms_pages_slug" ON "cms_pages" ("slug");
CREATE INDEX "idx_cms_pages_status" ON "cms_pages" ("status");
CREATE INDEX "idx_cms_blocks_type" ON "cms_blocks" ("type");
CREATE INDEX "idx_cms_blocks_status" ON "cms_blocks" ("status");
CREATE INDEX "idx_cms_pb_page_id" ON "cms_page_blocks" ("page_id");
CREATE INDEX "idx_cms_pb_sort" ON "cms_page_blocks" ("page_id", "sort_order");

-- Optional: Migrate existing posts to pages if you want to preserve data
-- For v0.2, we prioritize the new structure.
