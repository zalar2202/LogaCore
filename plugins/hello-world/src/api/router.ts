import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  requirePerm,
} from '@logacore/core/trpc';

/**
 * Hello World plugin tRPC router.
 *
 * Demonstrates:
 * - Zod input validation
 * - Permission enforcement via requirePerm()
 * - A simple query procedure
 */
export const helloWorldRouter = createTRPCRouter({
  greet: protectedProcedure
    .use(requirePerm('hello-world.read'))
    .input(
      z.object({
        name: z.string().min(1).max(100),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.name}! Welcome to LogaCore.`,
      };
    }),
});
