import type { PluginDefinition } from '../types/plugin';
import { version as coreVersion } from '../version';

// ─── Validation Error ──────────────────────────────────────────

/**
 * Error thrown when plugin validation fails.
 * Provides a clear, actionable message.
 */
export class PluginValidationError extends Error {
  constructor(message: string) {
    super(`[LogaCore] Plugin validation failed: ${message}`);
    this.name = 'PluginValidationError';
  }
}

// ─── Individual Validators ─────────────────────────────────────

/**
 * Ensures all plugin IDs are unique.
 */
function validateUniqueIds(plugins: PluginDefinition[]): void {
  const seen = new Set<string>();
  for (const plugin of plugins) {
    if (seen.has(plugin.id)) {
      throw new PluginValidationError(
        `Duplicate plugin ID "${plugin.id}". Each plugin must have a unique ID.`
      );
    }
    seen.add(plugin.id);
  }
}

/**
 * Ensures all plugins have a non-empty requiredCoreVersion field.
 *
 * NOTE: Full semver range check is arriving in v0.2.1.
 * For now, we enforce that it must match the major/minor of the core.
 */
function validateCoreVersions(plugins: PluginDefinition[]): void {
  for (const plugin of plugins) {
    if (!plugin.requiredCoreVersion) {
      throw new PluginValidationError(
        `Plugin "${plugin.id}" is missing "requiredCoreVersion". ` +
        `Every plugin must declare a compatible core version range.`
      );
    }

    // Simple check: for v0.x.y, if it starts with ^ or ~, we strip and check prefix
    const range = plugin.requiredCoreVersion.replace(/[\^~]/, '');
    const [cMajor, cMinor] = coreVersion.split('.');
    const [pMajor, pMinor] = range.split('.');

    if (cMajor !== pMajor || cMinor !== pMinor) {
      throw new PluginValidationError(
        `Plugin "${plugin.id}" requires core version "${plugin.requiredCoreVersion}", ` +
        `but the current core version is "${coreVersion}". ` +
        `Please update the plugin or core to match.`
      );
    }
  }
}

/**
 * Ensures all dependsOn references resolve to loaded plugins.
 */
function validateDependencies(plugins: PluginDefinition[]): void {
  const loadedIds = new Set(plugins.map((p) => p.id));
  for (const plugin of plugins) {
    const deps = plugin.dependsOn ?? [];
    for (const dep of deps) {
      if (!loadedIds.has(dep)) {
        throw new PluginValidationError(
          `Plugin "${plugin.id}" depends on "${dep}", ` +
          `but "${dep}" is not included in the loaded plugins. ` +
          `Add "${dep}" to your logacore.config.ts or remove the dependency.`
        );
      }
    }
  }
}

/**
 * Ensures no two plugins register admin pages at the same path.
 */
function validateAdminPaths(plugins: PluginDefinition[]): void {
  const seen = new Map<string, string>(); // path -> plugin id
  for (const plugin of plugins) {
    const pages = plugin.admin?.pages ?? [];
    for (const page of pages) {
      const existing = seen.get(page.path);
      if (existing) {
        throw new PluginValidationError(
          `Duplicate admin path "${page.path}" registered by ` +
          `plugin "${plugin.id}" (already claimed by "${existing}"). ` +
          `Each admin page path must be unique across all plugins.`
        );
      }
      seen.set(page.path, plugin.id);
    }
  }
}

/**
 * Ensures all permissions follow the `pluginId.action` naming convention.
 * This prevents cross-plugin permission collisions.
 */
function validatePermissionNamespacing(plugins: PluginDefinition[]): void {
  for (const plugin of plugins) {
    const perms = plugin.permissions ?? [];
    for (const perm of perms) {
      const prefix = `${plugin.id}.`;
      // Exception: core permissions if we wanted them, but for now we enforce strict namespacing
      if (!perm.key.startsWith(prefix) && perm.key !== '*') {
        throw new PluginValidationError(
          `Plugin "${plugin.id}" declared invalid permission key "${perm.key}". ` +
          `Permissions must be namespaced with the plugin ID (e.g., "${plugin.id}.read").`
        );
      }
    }
  }
}

/**
 * Ensures no two plugins declare the same permission key.
 */
function validateUniquePermissions(plugins: PluginDefinition[]): void {
  const seen = new Map<string, string>(); // key -> plugin id
  for (const plugin of plugins) {
    const perms = plugin.permissions ?? [];
    for (const perm of perms) {
      const existing = seen.get(perm.key);
      if (existing) {
        throw new PluginValidationError(
          `Duplicate permission key "${perm.key}" declared by ` +
          `plugin "${plugin.id}" (already declared by "${existing}"). ` +
          `Permission keys must be unique across all plugins.`
        );
      }
      seen.set(perm.key, plugin.id);
    }
  }
}

// ─── Aggregate Validator ───────────────────────────────────────

/**
 * Runs all validation checks on the given plugin definitions.
 *
 * Throws `PluginValidationError` on the first failure with a
 * clear, actionable error message.
 *
 * @param plugins - Array of plugin definitions to validate
 */
export function validatePlugins(plugins: PluginDefinition[]): void {
  validateUniqueIds(plugins);
  validateCoreVersions(plugins);
  validateDependencies(plugins);
  validateAdminPaths(plugins);
  validatePermissionNamespacing(plugins);
  validateUniquePermissions(plugins);
}
