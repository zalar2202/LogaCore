'use client';

import { trpc } from '@logacore/core';
import Link from 'next/link';

export function PagesList() {
    const pages = (trpc as any).cms.listPages.useQuery();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">CMS Pages</h2>
                    <p className="text-slate-400">Manage your website pages and their composition.</p>
                </div>
                <Link
                    href="/admin/cms/pages/new"
                    className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
                >
                    Create Page
                </Link>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 text-slate-300 uppercase text-xs font-medium">
                        <tr>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Slug</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Updated</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {pages.data?.map((page: any) => (
                            <tr key={page.id} className="hover:bg-slate-800/30 text-slate-300">
                                <td className="px-4 py-3 font-medium text-white">{page.title}</td>
                                <td className="px-4 py-3 font-mono text-violet-400">/{page.slug}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${page.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            page.status === 'archived' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                        }`}>
                                        {page.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {new Date(page.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/cms/pages/${page.id}`}
                                        className="text-violet-400 hover:text-violet-300"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {pages.data?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                    No pages found. Create your first page to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
