-- 001_initial_rbac.sql
-- Description: Creates roles, role_permissions, and user_roles tables.

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);

-- Seed initial roles
INSERT INTO roles (id, name, description) 
VALUES 
  ('admin', 'Administrator', 'Full access to all system features'),
  ('editor', 'Editor', 'Can manage content but not system settings')
ON CONFLICT (id) DO NOTHING;

-- Seed admin permissions (wildcard)
INSERT INTO role_permissions (role_id, permission)
VALUES ('admin', '*')
ON CONFLICT DO NOTHING;
