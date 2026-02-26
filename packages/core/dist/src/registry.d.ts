import { LogaPlugin } from './types';
/**
 * Registry is the single source of truth for all loaded plugins
 * in the current running application instance.
 */
export declare class LogaRegistry {
    private static instance;
    private plugins;
    private constructor();
    static getInstance(): LogaRegistry;
    /**
     * Register a new plugin into the engine.
     * Throws if plugin ID is already taken (Day 3 requirement).
     */
    register(plugin: LogaPlugin): void;
    getPlugin(id: string): LogaPlugin | undefined;
    getAll(): LogaPlugin[];
    /**
     * Helper to extract all navigation items across all plugins.
     * Useful for the Sidebar rendering (Day 4 task).
     */
    getNavigation(): import("./types").LogaNavItem[];
}
//# sourceMappingURL=registry.d.ts.map