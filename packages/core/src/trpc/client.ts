import { createTRPCReact } from '@trpc/react-query';

/**
 * LogaCore Generic tRPC Hook
 *
 * Plugins use this to call any procedure in the app's router
 * while maintaining some level of type-safety (if passed).
 */
export const trpc = createTRPCReact<any>();
