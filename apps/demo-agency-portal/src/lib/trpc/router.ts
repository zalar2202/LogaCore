import { createTRPCRouter } from '@logacore/core/trpc';
import { helloWorldRouter } from '@logacore/plugin-hello-world/api';

/**
 * App-level tRPC router.
 *
 * Each plugin router is mounted under its plugin ID.
 * This explicit composition preserves full TypeScript inference
 * for client-side autocomplete.
 */
export const appRouter = createTRPCRouter({
  'hello-world': helloWorldRouter,
});

export type AppRouter = typeof appRouter;
