-- 003_bootstrap_admin.sql
-- Description: Assigns the 'admin' role to the first user in the system 
-- if no admins exist yet. This ensures the first person to sign up 
-- can actually manage the system.

DO $$
DECLARE
    first_user_id TEXT;
BEGIN
    -- 1. Check if any admin already exists
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE role_id = 'admin') THEN
        -- 2. Find the first user (usually the one who just signed up)
        SELECT id INTO first_user_id FROM users ORDER BY created_at ASC LIMIT 1;
        
        -- 3. If a user exists, make them an admin
        IF first_user_id IS NOT NULL THEN
            INSERT INTO user_roles (user_id, role_id) 
            VALUES (first_user_id, 'admin')
            ON CONFLICT DO NOTHING;
            
            RAISE NOTICE 'Bootstrapped user % as admin', first_user_id;
        END IF;
    END IF;
END $$;
