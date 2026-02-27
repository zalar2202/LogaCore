'use client';

import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAdmin, useUser } from './AdminContext';

export function Topbar() {
  const registry = useAdmin();
  const user = useUser();
  const pathname = usePathname();

  // Derive page title from registry or fallback to route
  const currentPage = registry.pages.find((p) => pathname === p.path);
  const title = currentPage?.title ?? deriveTitle(pathname);

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-700 bg-slate-900 px-6">
      <h1 className="text-lg font-semibold text-slate-200">{title}</h1>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-slate-400">
              {user.name ?? user.email ?? user.id}
            </span>
            <button
              id="sign-out-button"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-700 transition-colors hover:bg-slate-700 hover:text-white"
            >
              Sign Out
            </button>
          </>
        ) : (
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400 border border-amber-500/30">
            Dev Mode
          </span>
        )}
      </div>
    </header>
  );
}

function deriveTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  const segments = pathname.replace('/admin/', '').split('/');
  return segments
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' / ');
}
