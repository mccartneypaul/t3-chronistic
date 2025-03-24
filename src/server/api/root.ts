import { createTRPCRouter } from "@chronistic/server/api/trpc";
import { exampleRouter } from "@chronistic/server/api/routers/example";
import { constructRouter } from "@chronistic/server/api/routers/construct";
import { mapRouter } from "@chronistic/server/api/routers/map";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  construct: constructRouter,
  map: mapRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
