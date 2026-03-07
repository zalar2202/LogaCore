import type { User } from '../types/user';

/**
 * Checks if a user has a specific permission.
 *
 * When `user` is `null` (dev mode / no auth wired), returns `true`
 * to allow full access during development.
 *
 * @param user - The authenticated user, or `null` for dev mode
 * @param perm - Permission key to check (e.g., `'cms.read'`)
 * @returns `true` if the user has the permission
 */
export function can(user: User | null, perm: string): boolean {
  if (user === null) return true;
  if (user.permissions.includes('*')) return true;
  return user.permissions.includes(perm);
}

/**
 * Checks if a user has ALL of the specified permissions.
 *
 * When `user` is `null` (dev mode), returns `true`.
 * When `perms` is empty, returns `true`.
 *
 * @param user - The authenticated user, or `null` for dev mode
 * @param perms - Array of permission keys to check
 * @returns `true` if the user has every listed permission
 */
export function canAll(user: User | null, perms: string[]): boolean {
  if (user === null) return true;
  if (user.permissions.includes('*')) return true;
  return perms.every((perm) => user.permissions.includes(perm));
}
