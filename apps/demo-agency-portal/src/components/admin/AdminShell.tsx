'use client';

import type { ReactNode } from 'react';
import type { PluginRegistry, User } from '@logacore/core';
import { AdminProvider } from './AdminContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AdminShellProps {
  registry: PluginRegistry;
  user: User | null;
  children: ReactNode;
}

export function AdminShell({ registry, user, children }: AdminShellProps) {
  return (
    <AdminProvider registry={registry} user={user}>
      <div className="flex h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}
