'use client';

import type { ReactNode } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { TRPCProvider } from '@/lib/trpc/client';
import { registry } from '@/lib/registry';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <TRPCProvider>
      <AdminShell registry={registry} user={null}>
        {children}
      </AdminShell>
    </TRPCProvider>
  );
}
