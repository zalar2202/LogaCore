'use client';

import type { ReactNode } from 'react';
import type { User } from '@logacore/core';
import { AdminShell } from '@/components/admin/AdminShell';
import { TRPCProvider } from '@/lib/trpc/client';
import { registry } from '@/lib/registry';

interface AdminClientLayoutProps {
  user: User | null;
  children: ReactNode;
}

/**
 * Client wrapper for the admin layout.
 *
 * The server-side AdminLayout handles auth + redirect,
 * then passes the resolved user to this client component.
 */
export function AdminClientLayout({
  user,
  children,
}: AdminClientLayoutProps) {
  return (
    <TRPCProvider>
      <AdminShell registry={registry} user={user}>
        {children}
      </AdminShell>
    </TRPCProvider>
  );
}
