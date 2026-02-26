import type { PluginDefinition } from './plugin';

/**
 * Application-level LogaCore configuration.
 *
 * Defined in `logacore.config.ts` per app using `defineConfig()`.
 */
export interface LogaCoreConfig {
  /**
   * Plugin definitions to include in the build.
   *
   * Import plugins and pass them directly for type-safe,
   * bundler-friendly, explicit configuration.
   *
   * @example
   * ```ts
   * import { defineConfig } from '@logacore/core';
   * import { plugin as cms } from '@logacore/plugin-cms';
   *
   * export default defineConfig({
   *   plugins: [cms],
   * });
   * ```
   */
  plugins: PluginDefinition[];
}
