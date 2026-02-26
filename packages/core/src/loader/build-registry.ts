import type { PluginDefinition } from '../types/plugin';
import type { PluginRegistry } from '../types/registry';

/**
 * Builds a merged PluginRegistry from validated plugin definitions.
 *
 * Assumes all definitions have already passed validation
 * (unique IDs, no duplicate paths, etc.). Called internally
 * by `loadPlugins()`.
 *
 * @param plugins - Array of validated plugin definitions
 * @returns The merged PluginRegistry
 */
export function buildRegistry(plugins: PluginDefinition[]): PluginRegistry {
  const registry: PluginRegistry = {
    plugins,
    navItems: [],
    pages: [],
    permissions: [],
    widgets: [],
    hooks: new Map(),
    dbConfigs: new Map(),
    apiRouters: new Map(),
  };

  for (const plugin of plugins) {
    if (plugin.permissions) {
      registry.permissions.push(...plugin.permissions);
    }

    if (plugin.admin) {
      if (plugin.admin.navItems) {
        registry.navItems.push(...plugin.admin.navItems);
      }
      if (plugin.admin.pages) {
        registry.pages.push(...plugin.admin.pages);
      }
      if (plugin.admin.widgets) {
        registry.widgets.push(...plugin.admin.widgets);
      }
    }

    if (plugin.hooks) {
      registry.hooks.set(plugin.id, plugin.hooks);
    }

    if (plugin.db) {
      registry.dbConfigs.set(plugin.id, plugin.db);
    }

    if (plugin.api?.router) {
      registry.apiRouters.set(plugin.id, plugin.api.router);
    }
  }

  return registry;
}
