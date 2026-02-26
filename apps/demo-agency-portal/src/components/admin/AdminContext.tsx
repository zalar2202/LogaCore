'use client';

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import type { PluginRegistry, User } from '@logacore/core';

interface AdminContextValue {
  registry: PluginRegistry;
  user: User | null;
}

const AdminContext = createContext<AdminContextValue | null>(null);

interface AdminProviderProps {
  registry: PluginRegistry;
  user: User | null;
  children: ReactNode;
}

export function AdminProvider({
  registry,
  user,
  children,
}: AdminProviderProps) {
  return (
    <AdminContext.Provider value={{ registry, user }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): PluginRegistry {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within <AdminProvider>');
  }
  return ctx.registry;
}

export function useUser(): User | null {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useUser must be used within <AdminProvider>');
  }
  return ctx.user;
}
