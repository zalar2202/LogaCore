'use client';

import { useState } from 'react';
import { trpc } from '@logacore/core';
import { useAdmin } from '@logacore/core/admin';

export function RoleManagement() {
    const utils = (trpc as any).useUtils();
    const registry = useAdmin();
    const roles = (trpc as any)['users-roles'].listRoles.useQuery();

    // Mutation for role management
    const createRole = (trpc as any)['users-roles'].createRole.useMutation({
        onSuccess: () => {
            utils['users-roles'].listRoles.invalidate();
            setIsModalOpen(false);
            resetForm();
        }
    });

    const updateRole = (trpc as any)['users-roles'].updateRole.useMutation({
        onSuccess: () => {
            utils['users-roles'].listRoles.invalidate();
            setIsModalOpen(false);
            resetForm();
        }
    });

    const deleteRole = (trpc as any)['users-roles'].deleteRole.useMutation({
        onSuccess: () => {
            utils['users-roles'].listRoles.invalidate();
        }
    });

    // State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        permissions: [] as string[]
    });

    const resetForm = () => {
        setFormData({ id: '', name: '', description: '', permissions: [] });
        setEditingId(null);
    };

    const handleEdit = (role: any) => {
        setEditingId(role.id);
        setFormData({
            id: role.id,
            name: role.name,
            description: role.description || '',
            permissions: [] // We'd ideally fetch these in a detail query or keep em in the list
        });
        setIsModalOpen(true);
    };

    const togglePermission = (perm: string) => {
        setFormData((prev: any) => ({
            ...prev,
            permissions: prev.permissions.includes(perm)
                ? prev.permissions.filter((p: any) => p !== perm)
                : [...prev.permissions, perm]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateRole.mutate(formData);
        } else {
            createRole.mutate(formData);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Roles & Permissions</h2>
                    <p className="text-slate-400">Manage system-wide access control roles.</p>
                </div>
                <button
                    className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                >
                    Create Role
                </button>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 text-slate-300 uppercase text-xs font-medium">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {roles.data?.map((role: any) => (
                            <tr key={role.id} className="hover:bg-slate-800/30 text-slate-300">
                                <td className="px-4 py-3 font-mono text-violet-400">{role.id}</td>
                                <td className="px-4 py-3 font-medium text-white">{role.name}</td>
                                <td className="px-4 py-3 text-slate-500">{role.description}</td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        className="text-violet-400 hover:text-violet-300 mr-3"
                                        onClick={() => handleEdit(role)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-400 hover:text-red-300"
                                        onClick={() => {
                                            if (confirm(`Delete role ${role.id}?`)) deleteRole.mutate({ id: role.id });
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-bold text-white mb-6">
                            {editingId ? 'Edit Role' : 'Create New Role'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-400">Role ID</label>
                                    <input
                                        required
                                        disabled={!!editingId}
                                        className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none disabled:opacity-50"
                                        placeholder="e.g. editor"
                                        value={formData.id}
                                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-400">Display Name</label>
                                    <input
                                        required
                                        className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none"
                                        placeholder="e.g. Content Editor"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Description</label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none"
                                    placeholder="What can this role do?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-400">Permissions</label>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {registry.permissions.map(perm => (
                                        <div
                                            key={perm.key}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.permissions.includes(perm.key)
                                                ? 'border-violet-500 bg-violet-500/10'
                                                : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                                                }`}
                                            onClick={() => togglePermission(perm.key)}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.permissions.includes(perm.key) ? 'bg-violet-500 border-violet-500' : 'border-slate-500'
                                                }`}>
                                                {formData.permissions.includes(perm.key) && <span className="text-[10px] text-white">✓</span>}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-white">{perm.name}</p>
                                                <p className="text-[10px] text-slate-400">{perm.key}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createRole.isPending || updateRole.isPending}
                                    className="rounded-md bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors disabled:opacity-50"
                                >
                                    {editingId ? 'Update Role' : 'Create Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
