'use client';

import { useAdmin } from '@/components/admin/AdminContext';
import { HelloTRPCDemo } from '@/components/admin/HelloTRPCDemo';

export default function AdminDashboard() {
  const registry = useAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-400">
          Welcome to the LogaCore admin panel.
        </p>
      </div>

      {/* Plugin summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Plugins Loaded"
          value={registry.plugins.length}
        />
        <StatCard
          label="Permissions"
          value={registry.permissions.length}
        />
        <StatCard
          label="Admin Pages"
          value={registry.pages.length}
        />
      </div>

      {/* Plugin list */}
      {registry.plugins.length > 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <h3 className="mb-3 text-sm font-medium text-slate-300">
            Loaded Plugins
          </h3>
          <ul className="space-y-2">
            {registry.plugins.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md bg-slate-800/50 px-3 py-2"
              >
                <span className="text-sm text-slate-200">{p.name}</span>
                <span className="text-xs text-slate-500">v{p.version}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center">
          <p className="text-sm text-slate-500">
            No plugins loaded. Add plugins to{' '}
            <code className="text-slate-400">logacore.config.ts</code> to get
            started.
          </p>
        </div>
      )}

      {/* tRPC demo */}
      <HelloTRPCDemo />

      {/* Dashboard widgets */}
      {registry.widgets.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {registry.widgets.map((w) => (
            <div key={w.id} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <w.component />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-100">{value}</p>
    </div>
  );
}
