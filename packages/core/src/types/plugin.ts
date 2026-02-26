import type { NavItem, AdminPage, DashboardWidget } from './admin';
import type { PermissionDefinition } from './permissions';

// ─── Hook Context ──────────────────────────────────────────────

/**
 * Context passed to plugin lifecycle hooks.
 *
 * Will be expanded in future milestones (db client, logger, etc.).
 */
export interface HookContext {
  /** The ID of the plugin receiving the hook call */
  pluginId: string;
  /** The core version currently running */
  coreVersion: string;
}

// ─── Sub-configs ───────────────────────────────────────────────

/**
 * Lifecycle hooks a plugin can respond to.
 */
export interface HooksConfig {
  /** Called when the app boots with the registry loaded */
  onInit?: (ctx: HookContext) => Promise<void>;
  /** Called when migrations complete for the first time */
  onInstall?: (ctx: HookContext) => Promise<void>;
  /** Called when the plugin is enabled */
  onEnable?: (ctx: HookContext) => Promise<void>;
  /** Called when the plugin is disabled */
  onDisable?: (ctx: HookContext) => Promise<void>;
}

/**
 * API integration configuration.
 *
 * The TRouter generic defaults to `unknown` because tRPC is not
 * installed until Day 6. Once tRPC is added, this generic will be
 * narrowed to the actual tRPC router type.
 */
export interface APIConfig<TRouter = unknown> {
  /** tRPC router (namespaced by plugin ID) */
  router?: TRouter;
}

/**
 * Database and migration configuration.
 */
export interface DBConfig {
  /** Path to SQL migration files relative to plugin root. Defaults to `./migrations`. */
  migrationsPath?: string;
  /** Optional seeding function called after migrations */
  seed?: () => Promise<void>;
}

/**
 * Admin UI registration.
 */
export interface AdminConfig {
  /** Sidebar/navigation items */
  navItems?: NavItem[];
  /** Pages rendered inside the admin shell */
  pages?: AdminPage[];
  /** Dashboard widgets */
  widgets?: DashboardWidget[];
}

// ─── Author metadata ──────────────────────────────────────────

/**
 * Plugin author information.
 */
export interface PluginAuthor {
  name: string;
  url?: string;
}

// ─── Plugin Definition ────────────────────────────────────────

/**
 * The complete definition contract for a LogaCore plugin.
 *
 * @template TRouter - Type of the API router. Defaults to `unknown`.
 */
export interface PluginDefinition<TRouter = unknown> {
  // ── Required fields ──

  /** Unique plugin ID (lowercase kebab-case, permanent once set) */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Semantic version string (e.g., `0.1.0`) */
  version: string;
  /** Compatible core version range (e.g., `^0.1.0`) */
  requiredCoreVersion: string;

  // ── Optional metadata ──

  /** Short description for docs/admin plugin lists */
  description?: string;
  /** Author metadata */
  author?: PluginAuthor;
  /** Plugin IDs this plugin depends on */
  dependsOn?: string[];

  // ── Capability configs ──

  /** Permission keys this plugin declares */
  permissions?: PermissionDefinition[];
  /** Admin UI registration (nav items, pages, widgets) */
  admin?: AdminConfig;
  /** API integration (tRPC router) */
  api?: APIConfig<TRouter>;
  /** Database and migration configuration */
  db?: DBConfig;
  /** Lifecycle hooks */
  hooks?: HooksConfig;
}
