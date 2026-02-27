import { initTRPC, TRPCError } from '@trpc/server';
import type { TRPCContext } from './context';

/**
 * tRPC instance initialized with the LogaCore context shape.
 *
 * This is the single source of truth for all tRPC building blocks
 * (router, procedure, middleware). Plugins and apps import
 * derived utilities from core, never this `t` instance directly.
 */
const t = initTRPC.context<TRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const middleware = t.middleware;

export { TRPCError };
