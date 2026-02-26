import { version } from '@logacore/core';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 animate-pulse mb-4 tracking-tighter">
            LogaCore
          </h1>
          <p className="text-xl text-slate-400/80 mb-8 font-light italic">
            Super App Engine Initialized
          </p>
          <div className="flex gap-4 justify-center items-center">
            <span className="px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-xl text-slate-300">
              v{version}
            </span>
            <span className="px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 backdrop-blur-xl text-emerald-400 animate-pulse">
              System Live
            </span>
          </div>
        </div>
      </div>

      <div className="mt-24 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left text-slate-400">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-slate-700 hover:bg-slate-800/50">
          <h2 className="mb-3 text-2xl font-semibold text-white">Monorepo</h2>
          <p className="m-0 text-sm opacity-50">
            Day 1: Foundation established via pnpm workspaces.
          </p>
        </div>
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-slate-700 hover:bg-slate-800/50">
          <h2 className="mb-3 text-2xl font-semibold text-white">Plugins</h2>
          <p className="m-0 text-sm opacity-50">
            Modular architecture ready for build-time inclusion.
          </p>
        </div>
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-slate-700 hover:bg-slate-800/50">
          <h2 className="mb-3 text-2xl font-semibold text-white">Drizzle</h2>
          <p className="m-0 text-sm opacity-50">
            PostgreSQL 17 optimization with modular schema.
          </p>
        </div>
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-slate-700 hover:bg-slate-800/50">
          <h2 className="mb-3 text-2xl font-semibold text-white">Coolify</h2>
          <p className="m-0 text-sm opacity-50">
            Production ready deployment to logatech.cloud.
          </p>
        </div>
      </div>
    </main>
  );
}
