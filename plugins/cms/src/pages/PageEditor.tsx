'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@logacore/core';
import { useRouter, useParams } from 'next/navigation';

export function PageEditor() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const utils = (trpc as any).useUtils();

    // Queries
    const pageQuery = (trpc as any).cms.getPage.useQuery(
        { id: params.id as string },
        { enabled: !isNew }
    );
    const allBlocksQuery = (trpc as any).cms.listBlocks.useQuery();

    // Mutations
    const createPage = (trpc as any).cms.createPage.useMutation();
    const updatePage = (trpc as any).cms.updatePage.useMutation();
    const setPageBlocks = (trpc as any).cms.setPageBlocks.useMutation();

    // State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        status: 'draft',
        seoTitle: '',
        seoDescription: '',
    });
    const [pageBlocks, setPageBlocksState] = useState<any[]>([]);

    useEffect(() => {
        if (pageQuery.data) {
            setFormData({
                title: pageQuery.data.title,
                slug: pageQuery.data.slug,
                status: pageQuery.data.status,
                seoTitle: pageQuery.data.seoTitle || '',
                seoDescription: pageQuery.data.seoDescription || '',
            });
            setPageBlocksState(pageQuery.data.blocks || []);
        }
    }, [pageQuery.data]);

    const handleSaveMetadata = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            const res = await createPage.mutateAsync(formData);
            router.push(`/admin/cms/pages/${res.id}`);
        } else {
            await updatePage.mutateAsync({ id: params.id as string, ...formData });
            utils.cms.listPages.invalidate();
        }
    };

    const handleUpdateComposition = async () => {
        if (isNew) return;
        await setPageBlocks.mutateAsync({
            pageId: params.id as string,
            blocksIds: pageBlocks.map(b => b.id)
        });
        pageQuery.refetch();
    };

    const addBlock = (block: any) => {
        if (pageBlocks.find(b => b.id === block.id)) return;
        setPageBlocksState([...pageBlocks, { ...block, sortOrder: pageBlocks.length }]);
    };

    const removeBlock = (id: string) => {
        setPageBlocksState(pageBlocks.filter(b => b.id !== id));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...pageBlocks];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= newBlocks.length) return;

        [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
        setPageBlocksState(newBlocks);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form: Metadata & SEO */}
            <div className="lg:col-span-2 space-y-8">
                <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 backdrop-blur-md">
                    <h3 className="text-xl font-bold text-white mb-6">Page Settings</h3>
                    <form onSubmit={handleSaveMetadata} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Page Title</label>
                                <input
                                    required
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Slug</label>
                                <input
                                    required
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none font-mono"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                />
                            </div>
                        </div>

                        {!isNew && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Status</label>
                                <select
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none capitalize"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        )}

                        <div className="space-y-6 pt-6 border-t border-slate-800">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">SEO Metadata</h4>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-400">SEO Title</label>
                                    <input
                                        className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none"
                                        placeholder="Defaults to Page Title"
                                        value={formData.seoTitle}
                                        onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-400">SEO Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none"
                                        value={formData.seoDescription}
                                        onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="rounded-md bg-violet-600 px-8 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/20"
                            >
                                {isNew ? 'Create Page' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Composition Section */}
                {!isNew && (
                    <section className="rounded-xl border border-slate-700 bg-slate-950 p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white">Page Composition</h3>
                                <p className="text-xs text-slate-500">Add and reorder blocks to build your content.</p>
                            </div>
                            <button
                                onClick={handleUpdateComposition}
                                className="text-xs font-bold text-violet-400 border border-violet-400/30 px-3 py-1.5 rounded-md hover:bg-violet-400/10"
                            >
                                Save Ordering
                            </button>
                        </div>

                        <div className="space-y-3">
                            {pageBlocks.map((block, index) => (
                                <div
                                    key={block.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900 border border-slate-800 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => moveBlock(index, 'up')} className="text-xs hover:text-violet-400 disabled:opacity-0" disabled={index === 0}>▲</button>
                                            <button onClick={() => moveBlock(index, 'down')} className="text-xs hover:text-violet-400 disabled:opacity-0" disabled={index === pageBlocks.length - 1}>▼</button>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{block.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">{block.type}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeBlock(block.id)}
                                        className="text-red-500/50 hover:text-red-500 p-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {pageBlocks.length === 0 && (
                                <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-xl">
                                    <p className="text-slate-600">This page is empty. Use the sidebar to add blocks.</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {/* Sidebar: Available Blocks */}
            <div className="lg:col-span-1 space-y-6">
                <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 sticky top-24">
                    <h3 className="text-lg font-bold text-white mb-4">Available Blocks</h3>
                    <div className="space-y-2 overflow-y-auto max-h-[60vh]">
                        {allBlocksQuery.data?.filter((b: any) => b.status !== 'archived').map((block: any) => {
                            const isOnPage = pageBlocks.find(pb => pb.id === block.id);
                            return (
                                <div
                                    key={block.id}
                                    onClick={() => !isNew && addBlock(block)}
                                    className={`p-3 rounded-lg border text-left transition-all ${isNew ? 'opacity-50 cursor-not-allowed' :
                                        isOnPage ? 'border-violet-500/50 bg-violet-500/5 cursor-default' :
                                            'border-slate-800 bg-slate-800/50 hover:border-slate-600 cursor-pointer'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-medium text-white">{block.name}</p>
                                        {isOnPage && <span className="text-[10px] bg-violet-500 text-white px-1.5 rounded">Used</span>}
                                    </div>
                                    <p className="text-[10px] text-slate-500 uppercase mt-1">{block.type}</p>
                                </div>
                            );
                        })}
                    </div>
                    {isNew && (
                        <p className="text-[10px] text-yellow-400 mt-4 italic">
                            Create the page first to enable composition.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
