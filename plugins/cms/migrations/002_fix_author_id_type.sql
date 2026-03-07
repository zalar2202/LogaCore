-- 002_fix_author_id_type.sql
-- Description: Converts author_id from UUID to TEXT to match core users table.

ALTER TABLE cms_posts 
  ALTER COLUMN author_id TYPE TEXT;
