-- 002_add_permissions_column.sql
-- Description: Adds the `permissions` JSONB column to the users table 
-- if it doesn't already exist. This column stores direct permissions
-- assigned to a user (separate from RBAC role-based permissions).

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'permissions'
    ) THEN
        ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '[]'::jsonb;
    END IF;
END
$$;
