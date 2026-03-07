'use client';

import { trpc } from '@/lib/trpc/client';

export function CmsDashboard() {
    const posts = trpc.cms.listPosts.useQuery();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                        CMS Dashboard
                    </h2>
                    <p className="text-slate-400">
                        Manage your blog posts and content.
                    </p>
                </div>
                <button
                    className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
                    onClick={() => alert('New Post feature coming soon!')}
                >
                    Create Post
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                    <p className="text-sm font-medium text-slate-400">Total Posts</p>
                    <p className="mt-2 text-3xl font-bold text-slate-100">
                        {posts.data?.length ?? 0}
                    </p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                    <p className="text-sm font-medium text-slate-400">Published</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-400">
                        {posts.data?.filter(p => p.status === 'published').length ?? 0}
                    </p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                    <p className="text-sm font-medium text-slate-400">Drafts</p>
                    <p className="mt-2 text-3xl font-bold text-amber-400">
                        {posts.data?.filter(p => p.status === 'draft').length ?? 0}
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-700 bg-slate-800/50 text-slate-300 uppercase font-medium text-xs">
                        <tr>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {posts.isPending && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                    Loading posts...
                                </td>
                            </tr>
                        )}
                        {posts.data?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                    No posts found. Create your first one above!
                                </td>
                            </tr>
                        )}
                        {posts.data?.map((post) => (
                            <tr key={post.id} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                                <td className="px-4 py-3 font-medium text-slate-200">
                                    {post.title}
                                    <span className="block text-xs font-normal text-slate-500">
                                        /{post.slug}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${post.status === 'published'
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {new Date(post.createdAt!).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-violet-400 hover:text-violet-300 mr-3">Edit</button>
                                    <button className="text-red-400 hover:text-red-300">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
