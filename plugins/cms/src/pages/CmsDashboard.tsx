'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';

export function CmsDashboard() {
    const utils = trpc.useUtils();
    const posts = trpc.cms.listPosts.useQuery();
    const createPost = trpc.cms.createPost.useMutation({
        onSuccess: () => {
            utils.cms.listPosts.invalidate();
            setIsModalOpen(false);
            resetForm();
        }
    });
    const deletePost = trpc.cms.deletePost.useMutation({
        onSuccess: () => {
            utils.cms.listPosts.invalidate();
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        status: 'draft' as 'draft' | 'published'
    });

    // Auto-generate slug from title
    useEffect(() => {
        if (formData.title && !formData.slug) {
            const generatedSlug = formData.title
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title]);

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            content: '',
            status: 'draft'
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPost.mutate(formData);
    };

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            deletePost.mutate({ id });
        }
    };

    return (
        <div className="space-y-6 relative">
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
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Post
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
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
                                    <button
                                        className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                        disabled={deletePost.isPending}
                                        onClick={() => handleDelete(post.id, post.title)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-100 mb-4">Create New Post</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                    placeholder="The Future of LogaCore"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Slug</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                    placeholder="future-of-logacore"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Content</label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                    placeholder="Write your content here..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Status</label>
                                <select
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createPost.isPending}
                                    className="rounded-md bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors disabled:opacity-50"
                                >
                                    {createPost.isPending ? 'Saving...' : 'Create Post'}
                                </button>
                            </div>

                            {createPost.error && (
                                <p className="text-sm text-red-500 mt-2">
                                    Error: {createPost.error.message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
