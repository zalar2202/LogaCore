'use client';

import type { ReactNode } from 'react';
import type { User } from '../types/user';
import { can } from './can';

export interface RequireProps {
  /** The current user, or `null` for dev mode (all access) */
  user: User | null;
  /** Permission key(s) required — all must be satisfied */
  perm: string | string[];
  /** Content to render when permission check fails */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Declarative permission gate component.
 *
 * Renders `children` only if the user has all required permissions.
 * Renders `fallback` (or nothing) when access is denied.
 *
 * @example
 * ```tsx
 * <Require user={user} perm="cms.edit">
 *   <EditButton />
 * </Require>
 * ```
 */
export function Require({
  user,
  perm,
  fallback,
  children,
}: RequireProps): ReactNode {
  const perms = Array.isArray(perm) ? perm : [perm];
  const allowed = perms.every((p) => can(user, p));

  if (!allowed) return fallback ?? null;
  return <>{children}</>;
}
