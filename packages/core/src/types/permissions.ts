/**
 * A permission declared by a plugin.
 *
 * Key format: `<plugin-id>.<action>` (e.g., `cms.read`, `invoices.create`)
 */
export interface PermissionDefinition {
  /** Permission key in format `<plugin-id>.<action>` */
  key: string;
  /** Human-readable name for display in admin UI */
  name: string;
  /** Optional description of what this permission grants */
  description?: string;
}
