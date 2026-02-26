import type { NavItem, AdminPage, DashboardWidget } from './admin';
import type { PermissionDefinition } from './permissions';
import type { DBConfig, HooksConfig, PluginDefinition } from './plugin';

/**
 * The merged registry built from all loaded plugins.
 *
 * Created by `loadPlugins()` after validation passes.
 * This is the single source of truth for what the platform contains.
 */
export interface PluginRegistry {
  /** All loaded plugin definitions (for introspection/admin UI) */
  readonly plugins: readonly PluginDefinition[];
  /** All navigation items from all plugins */
  navItems: NavItem[];
  /** All admin pages from all plugins */
  pages: AdminPage[];
  /** All declared permissions from all plugins */
  permissions: PermissionDefinition[];
  /** All dashboard widgets from all plugins */
  widgets: DashboardWidget[];
  /** Hooks keyed by plugin ID */
  hooks: Map<string, HooksConfig>;
  /** Database configs keyed by plugin ID */
  dbConfigs: Map<string, DBConfig>;
  /** API routers keyed by plugin ID */
  apiRouters: Map<string, unknown>;
}
