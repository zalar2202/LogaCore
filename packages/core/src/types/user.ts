/**
 * Represents an authenticated user in the system.
 *
 * Minimal shape for v0.1 — will be extended when auth
 * (NextAuth/Auth.js) is wired in Day 7.
 */
export interface User {
  id: string;
  name?: string;
  email?: string;
  /** Permission keys granted to this user (e.g., `'cms.read'`) */
  permissions: string[];
}
