export interface LogaPermission {
    action: string;
    subject: string;
    description?: string;
}
export interface LogaNavItem {
    id: string;
    label: string;
    path: string;
    icon?: string;
    parent?: string;
    permission?: string;
}
export interface LogaPlugin {
    id: string;
    name: string;
    version: string;
    description?: string;
    permissions?: LogaPermission[];
    navigation?: LogaNavItem[];
    config?: (config: any) => void;
    onInit?: () => void | Promise<void>;
}
export interface LogaCoreConfig {
    plugins: LogaPlugin[];
    auth?: {
        providers: any[];
    };
}
//# sourceMappingURL=types.d.ts.map