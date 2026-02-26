import type { LogaCoreConfig } from '../types/config';

/**
 * Type-enforcement helper for defining a LogaCore app configuration.
 *
 * Identity function that validates the shape at compile time.
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
export function defineConfig(config: LogaCoreConfig): LogaCoreConfig {
  return config;
}
