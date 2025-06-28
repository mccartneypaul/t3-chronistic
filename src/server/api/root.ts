import { createTRPCRouter } from "@chronistic/server/api/trpc";
import { exampleRouter } from "@chronistic/server/api/routers/example";
import { constructRouter } from "@chronistic/server/api/routers/construct";
import { mapRouter } from "@chronistic/server/api/routers/map";
import { s3Router } from "@chronistic/server/api/routers/s3";
import { worldRouter } from "./routers/world";
import { positionRouter } from "./routers/position";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  construct: constructRouter,
  example: exampleRouter,
  map: mapRouter,
  position: positionRouter,
  s3: s3Router,
  world: worldRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
