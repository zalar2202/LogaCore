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
//# sourceMappingURL=index.js.map