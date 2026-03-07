'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { canAll } from '@logacore/core';
import { useAdmin, useUser } from '@logacore/core/admin';

export function Sidebar() {
  const registry = useAdmin();
  const user = useUser();
  const pathname = usePathname();

  const visibleItems = registry.navItems.filter((item) =>
    canAll(user, item.requiredPerms ?? [])
  );

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-700 bg-slate-900">
      {/* Branding */}
      <div className="flex h-14 items-center gap-2 border-b border-slate-700 px-4">
        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
          LogaCore
        </span>
        <span className="text-xs text-slate-500">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <Link
          href="/admin"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${pathname === '/admin'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
        >
          Dashboard
        </Link>

        {visibleItems.length > 0 && (
          <div className="mt-4 space-y-1">
            {visibleItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${pathname.startsWith(item.href)
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-3">
        <p className="text-xs text-slate-500">
          {registry.plugins.length} plugin
          {registry.plugins.length !== 1 ? 's' : ''} loaded
        </p>
      </div>
    </aside>
  );
}
