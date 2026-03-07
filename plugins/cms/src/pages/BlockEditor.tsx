'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@logacore/core';
import { useRouter, useParams } from 'next/navigation';

const BLOCK_TYPES = [
    { id: 'hero', name: 'Hero (Headline + CTA)' },
    { id: 'richText', name: 'Rich Text (Markdown)' },
    { id: 'faq', name: 'FAQ (Accordion)' },
    { id: 'cta', name: 'Call to Action (Small)' },
];

export function BlockEditor() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const utils = (trpc as any).useUtils();

    const blockQuery = (trpc as any).cms.listBlocks.useQuery(undefined, {
        select: (data: any[]) => data.find(b => b.id === params.id)
    });

    const createBlock = (trpc as any).cms.createBlock.useMutation();
    const updateBlock = (trpc as any).cms.updateBlock.useMutation();

    const [formData, setFormData] = useState({
        name: '',
        type: 'hero',
        status: 'draft',
        data: {} as any,
    });

    useEffect(() => {
        if (blockQuery.data) {
            setFormData({
                name: blockQuery.data.name,
                type: blockQuery.data.type,
                status: blockQuery.data.status,
                data: blockQuery.data.data || {},
            });
        }
    }, [blockQuery.data]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            const res = await createBlock.mutateAsync(formData);
            router.push(`/admin/cms/blocks/${res.id}`);
        } else {
            await updateBlock.mutateAsync({ id: params.id as string, ...formData });
            utils.cms.listBlocks.invalidate();
        }
    };

    const updateDataField = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            data: { ...prev.data, [field]: value }
        }));
    };

    const renderTypeSpecificFields = () => {
        switch (formData.type) {
            case 'hero':
                return (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Headline</label>
                            <input
                                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                                value={formData.data.headline || ''}
                                onChange={e => updateDataField('headline', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea
                                rows={2}
                                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                                value={formData.data.description || ''}
                                onChange={e => updateDataField('description', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">CTA Text</label>
                                <input
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                                    value={formData.data.ctaText || ''}
                                    onChange={e => updateDataField('ctaText', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">CTA Href</label>
                                <input
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                                    value={formData.data.ctaHref || ''}
                                    onChange={e => updateDataField('ctaHref', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'richText':
                return (
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Markdown Content</label>
                        <textarea
                            rows={12}
                            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white font-mono text-sm"
                            value={formData.data.content || ''}
                            onChange={e => updateDataField('content', e.target.value)}
                        />
                    </div>
                );
            case 'faq':
                return (
                    <div className="space-y-4">
                        <p className="text-xs text-yellow-500 mb-2 italic px-2 py-1 bg-yellow-500/5 border border-yellow-500/10 rounded">
                            FAQ management coming soon with structured sub-fields (v0.3). Use RichText for now if needed.
                        </p>
                    </div>
                );
            default:
                return <p className="text-slate-500 text-sm">Select a type to see available data fields.</p>;
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        {isNew ? 'Create New Block' : 'Edit Block Content'}
                    </h2>
                    <p className="text-slate-400">Blocks store their content in a versioned JSON format.</p>
                </div>
            </div>

            <section className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl">
                <form onSubmit={handleSave} className="divide-y divide-slate-800">
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Admin Label</label>
                                <input
                                    required
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none"
                                    placeholder="e.g. Homepage Hero"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Block Type</label>
                                <select
                                    disabled={!isNew}
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none disabled:opacity-50"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {BLOCK_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
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
                    </div>

                    <div className="p-6 bg-slate-950/30">
                        <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-violet-500" />
                            Content Data (JSON)
                        </h4>
                        <div className="space-y-6">
                            {renderTypeSpecificFields()}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-800/10 flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-violet-600 px-8 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
                        >
                            {isNew ? 'Create Block' : 'Update Content'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
