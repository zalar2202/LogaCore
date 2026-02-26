import type { ComponentType } from 'react';

/**
 * A sidebar/navigation item registered by a plugin.
 */
export interface NavItem {
  /** Unique identifier within the plugin */
  id: string;
  /** Display label in the sidebar */
  label: string;
  /** Route path (e.g., `/admin/cms/posts`) */
  href: string;
  /** Icon identifier (e.g., icon name or component key) */
  icon?: string;
  /** Permission keys required to see this item */
  requiredPerms?: string[];
}

/**
 * An admin page rendered inside the admin shell.
 */
export interface AdminPage {
  /** Unique identifier within the plugin */
  id: string;
  /** Route path (e.g., `/admin/cms/posts`) */
  path: string;
  /** React component to render for this page */
  component: ComponentType;
  /** Permission keys required to access this page */
  requiredPerms?: string[];
  /** Optional page title */
  title?: string;
}

/**
 * A dashboard widget registered by a plugin.
 */
export interface DashboardWidget {
  /** Unique identifier within the plugin */
  id: string;
  /** React component to render as the widget */
  component: ComponentType;
  /** Permission keys required to see this widget */
  requiredPerms?: string[];
}
