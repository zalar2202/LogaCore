-- 005_update_permission_namespaces.sql
-- Description: Renames existing permissions to follow the new strict pluginId.resource.action namespacing convention.
-- This ensures that existing roles (like 'admin') maintain access after the contract hardening.

UPDATE role_permissions SET permission = 'users-roles.roles.manage' WHERE permission = 'roles.manage';
UPDATE role_permissions SET permission = 'users-roles.users.manage' WHERE permission = 'users.manage';
UPDATE role_permissions SET permission = 'users-roles.audit.read' WHERE permission = 'audit.read';
UPDATE role_permissions SET permission = 'hello-world.read' WHERE permission = 'hello.read';
