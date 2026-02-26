'use client';

export function HelloPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Hello World</h2>
        <p className="mt-1 text-sm text-slate-400">
          This page is rendered by the{' '}
          <code className="text-violet-400">@logacore/plugin-hello-world</code>{' '}
          plugin.
        </p>
      </div>

      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6">
        <h3 className="text-lg font-semibold text-emerald-400">
          Plugin System Working
        </h3>
        <p className="mt-2 text-sm text-slate-300">
          If you can see this page, the full plugin pipeline is proven:
        </p>
        <ul className="mt-3 space-y-1 text-sm text-slate-400">
          <li>
            definePlugin() registered this plugin
          </li>
          <li>
            loadPlugins() validated and built the registry
          </li>
          <li>
            Sidebar shows the nav item from this plugin
          </li>
          <li>
            Route resolver matched /admin/hello-world to this component
          </li>
          <li>
            RBAC gate checked the hello.read permission
          </li>
        </ul>
      </div>
    </div>
  );
}
