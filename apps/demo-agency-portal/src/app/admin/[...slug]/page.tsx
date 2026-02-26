'use client';

import { useParams } from 'next/navigation';
import { canAll } from '@logacore/core';
import { useAdmin, useUser } from '@/components/admin/AdminContext';

export default function AdminCatchAll() {
  const params = useParams<{ slug: string[] }>();
  const registry = useAdmin();
  const user = useUser();

  const slug = params.slug ?? [];
  const path = `/admin/${slug.join('/')}`;

  const page = registry.pages.find((p) => p.path === path);

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-slate-300">
          Page Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          No plugin has registered a page at{' '}
          <code className="text-slate-400">{path}</code>
        </p>
      </div>
    );
  }

  const hasPerms = canAll(user, page.requiredPerms ?? []);

  if (!hasPerms) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-red-400">Access Denied</h2>
        <p className="mt-2 text-sm text-slate-500">
          You do not have the required permissions to view this page.
        </p>
      </div>
    );
  }

  const PageComponent = page.component;
  return <PageComponent />;
}
