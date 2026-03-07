'use client';

import { trpc } from '@logacore/core';
import Link from 'next/link';
import { useState } from 'react';

export function BlocksList() {
    const blocks = (trpc as any).cms.listBlocks.useQuery();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Content Blocks</h2>
                    <p className="text-slate-400">Reusable components you can drop onto any page.</p>
                </div>
                <Link
                    href="/admin/cms/blocks/new"
                    className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
                >
                    Create Block
                </Link>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 text-slate-300 uppercase text-xs font-medium">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {blocks.data?.map((block: any) => (
                            <tr key={block.id} className="hover:bg-slate-800/30 text-slate-300">
                                <td className="px-4 py-3 font-mono text-violet-400/70 text-xs">
                                    {block.id.slice(0, 8)}...
                                </td>
                                <td className="px-4 py-3 font-medium text-white">{block.name}</td>
                                <td className="px-4 py-3 capitalize">
                                    <span className="text-slate-500">{block.type}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${block.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                        }`}>
                                        {block.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/cms/blocks/${block.id}`}
                                        className="text-violet-400 hover:text-violet-300"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
