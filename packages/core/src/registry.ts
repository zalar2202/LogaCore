import { LogaPlugin } from './types';

/**
 * Registry is the single source of truth for all loaded plugins
 * in the current running application instance.
 */
export class LogaRegistry {
    private static instance: LogaRegistry;
    private plugins: Map<string, LogaPlugin> = new Map();

    private constructor() { }

    public static getInstance(): LogaRegistry {
        if (!LogaRegistry.instance) {
            LogaRegistry.instance = new LogaRegistry();
        }
        return LogaRegistry.instance;
    }

    /**
     * Register a new plugin into the engine.
     * Throws if plugin ID is already taken (Day 3 requirement).
     */
    public register(plugin: LogaPlugin) {
        if (this.plugins.has(plugin.id)) {
            throw new Error(`Plugin with ID "${plugin.id}" is already registered.`);
        }
        this.plugins.set(plugin.id, plugin);
        console.log(`[LogaCore] Plugin registered: ${plugin.name} (v${plugin.version})`);
    }

    public getPlugin(id: string): LogaPlugin | undefined {
        return this.plugins.get(id);
    }

    public getAll(): LogaPlugin[] {
        return Array.from(this.plugins.values());
    }

    /**
     * Helper to extract all navigation items across all plugins.
     * Useful for the Sidebar rendering (Day 4 task).
     */
    public getNavigation() {
        return this.getAll()
            .flatMap((p) => p.navigation || [])
            .sort((a, b) => a.label.localeCompare(b.label));
    }
}
