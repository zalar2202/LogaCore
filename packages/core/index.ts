// ─── Version ───────────────────────────────────────────────────
export { version } from './src/version';

// ─── Helper Functions ──────────────────────────────────────────
export { definePlugin } from './src/plugin';
export { defineConfig } from './src/config';

// ─── Plugin Loader ─────────────────────────────────────────────
export { loadPlugins } from './src/loader';

// ─── Validation ────────────────────────────────────────────────
export { validatePlugins, PluginValidationError } from './src/validation';

// ─── RBAC ─────────────────────────────────────────────────────
export { can, canAll } from './src/rbac';
export { Require } from './src/rbac';

// ─── Types ─────────────────────────────────────────────────────
export type {
  PluginDefinition,
  PluginAuthor,
  HookContext,
  HooksConfig,
  APIConfig,
  DBConfig,
  AdminConfig,
} from './src/types/plugin';

export type {
  NavItem,
  AdminPage,
  DashboardWidget,
} from './src/types/admin';

export type { PermissionDefinition } from './src/types/permissions';

export type { User } from './src/types/user';

export type { LogaCoreConfig } from './src/types/config';

export type { PluginRegistry } from './src/types/registry';
