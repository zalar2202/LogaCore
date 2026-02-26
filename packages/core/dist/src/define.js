/**
 * Utility to define a plugin with type-safety and standard metadata.
 * Use this in every /plugins/* package.
 */
export function definePlugin(options) {
    return {
        ...options,
        // We can add default properties here if needed later
    };
}
/**
 * Utility to define the core system configuration.
 * Used at the root app level (e.g. apps/demo-agency-portal/logacore.config.ts)
 */
export function defineConfig(config) {
    return config;
}
//# sourceMappingURL=define.js.map