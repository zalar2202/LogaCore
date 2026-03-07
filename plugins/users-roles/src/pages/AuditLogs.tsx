'use client';

import { trpc } from '@logacore/core';

export function AuditLogs() {
    const logs = (trpc as any)['users-roles'].listAuditLogs.useQuery();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">System Audit Logs</h2>
                    <p className="text-slate-400">Track all administrative actions across the platform.</p>
                </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 text-slate-300 uppercase text-xs font-medium border-b border-slate-700">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Plugin</th>
                            <th className="px-4 py-3">Target</th>
                            <th className="px-4 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {logs.isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-slate-500 italic">
                                    Loading audit trail...
                                </td>
                            </tr>
                        ) : logs.data?.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-slate-500 italic">
                                    No audit entries found.
                                </td>
                            </tr>
                        ) : (
                            logs.data?.map((log: any) => (
                                <tr key={log.id} className="hover:bg-slate-800/30 text-slate-300 transition-colors">
                                    <td className="px-4 py-3 text-xs text-slate-400">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white text-xs">{log.user?.name || 'Unknown'}</span>
                                            <span className="text-[10px] text-slate-500">{log.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-violet-300 border border-violet-500/20">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                                        {log.pluginId}
                                    </td>
                                    <td className="px-4 py-3 text-[11px] text-slate-500 font-mono uppercase">
                                        {log.targetId || '-'}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500 truncate max-w-[200px]">
                                        {JSON.stringify(log.data)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
