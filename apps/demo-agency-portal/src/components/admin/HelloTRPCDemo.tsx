'use client';

import { trpc } from '@/lib/trpc/client';

export function HelloTRPCDemo() {
  const greeting = trpc['hello-world'].greet.useQuery({
    name: 'LogaCore',
  });

  return (
    <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 p-6">
      <h3 className="text-lg font-semibold text-violet-400">
        tRPC Integration
      </h3>
      <p className="mt-2 text-sm text-slate-300">
        Live query to{' '}
        <code className="text-violet-300">hello-world.greet</code>:
      </p>
      <div className="mt-3 rounded-md bg-slate-800/50 px-4 py-3">
        {greeting.isPending && (
          <p className="text-sm text-slate-500">Loading...</p>
        )}
        {greeting.error && (
          <p className="text-sm text-red-400">
            Error: {greeting.error.message}
          </p>
        )}
        {greeting.data && (
          <p className="text-sm font-medium text-emerald-400">
            {greeting.data.greeting}
          </p>
        )}
      </div>
    </div>
  );
}
