import type { PluginDefinition } from '../types/plugin';

/**
 * Type-enforcement helper for defining a LogaCore plugin.
 *
 * Identity function that validates the shape at compile time.
 * Runtime validation is performed separately by `validatePlugins()`.
 *
 * @example
 * ```ts
 * import { definePlugin } from '@logacore/core';
 *
 * export const plugin = definePlugin({
 *   id: 'cms',
 *   name: 'CMS',
 *   version: '0.1.0',
 *   requiredCoreVersion: '^0.1.0',
 * });
 * ```
 */
export function definePlugin<TRouter = unknown>(
  definition: PluginDefinition<TRouter>
): PluginDefinition<TRouter> {
  return definition;
}
