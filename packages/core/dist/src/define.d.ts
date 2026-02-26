import { LogaPlugin, LogaCoreConfig } from './types';
/**
 * Utility to define a plugin with type-safety and standard metadata.
 * Use this in every /plugins/* package.
 */
export declare function definePlugin(options: LogaPlugin): LogaPlugin;
/**
 * Utility to define the core system configuration.
 * Used at the root app level (e.g. apps/demo-agency-portal/logacore.config.ts)
 */
export declare function defineConfig(config: LogaCoreConfig): LogaCoreConfig;
//# sourceMappingURL=define.d.ts.map