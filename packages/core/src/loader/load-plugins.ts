import type { LogaCoreConfig } from '../types/config';
import type { PluginRegistry } from '../types/registry';
import { validatePlugins } from '../validation/validate-plugins';
import { buildRegistry } from './build-registry';

/**
 * Loads and validates all plugins from the given configuration,
 * then builds and returns the merged PluginRegistry.
 *
 * 1. Extracts plugin definitions from the config
 * 2. Runs all validation checks (fails fast with actionable errors)
 * 3. Builds the merged registry
 *
 * @param config - The LogaCore app configuration from `logacore.config.ts`
 * @returns The merged PluginRegistry
 * @throws {PluginValidationError} If any validation check fails
 *
 * @example
 * ```ts
 * import { loadPlugins, defineConfig } from '@logacore/core';
 * import { plugin as cms } from '@logacore/plugin-cms';
 *
 * const config = defineConfig({ plugins: [cms] });
 * const registry = loadPlugins(config);
 * ```
 */
export function loadPlugins(config: LogaCoreConfig): PluginRegistry {
  const { plugins } = config;

  validatePlugins(plugins);

  return buildRegistry(plugins);
}
