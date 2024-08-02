import { createTRPCRouter } from "@chronistic/server/api/trpc";
import { exampleRouter } from "@chronistic/server/api/routers/example";
import { constructRouter } from "./routers/construct";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  construct: constructRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
