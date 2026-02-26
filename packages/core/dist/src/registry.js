/**
 * Registry is the single source of truth for all loaded plugins
 * in the current running application instance.
 */
export class LogaRegistry {
    static instance;
    plugins = new Map();
    constructor() { }
    static getInstance() {
        if (!LogaRegistry.instance) {
            LogaRegistry.instance = new LogaRegistry();
        }
        return LogaRegistry.instance;
    }
    /**
     * Register a new plugin into the engine.
     * Throws if plugin ID is already taken (Day 3 requirement).
     */
    register(plugin) {
        if (this.plugins.has(plugin.id)) {
            throw new Error(`Plugin with ID "${plugin.id}" is already registered.`);
        }
        this.plugins.set(plugin.id, plugin);
        console.log(`[LogaCore] Plugin registered: ${plugin.name} (v${plugin.version})`);
    }
    getPlugin(id) {
        return this.plugins.get(id);
    }
    getAll() {
        return Array.from(this.plugins.values());
    }
    /**
     * Helper to extract all navigation items across all plugins.
     * Useful for the Sidebar rendering (Day 4 task).
     */
    getNavigation() {
        return this.getAll()
            .flatMap((p) => p.navigation || [])
            .sort((a, b) => a.label.localeCompare(b.label));
    }
}
//# sourceMappingURL=registry.js.map