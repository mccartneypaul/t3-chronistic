import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@chronistic/server/api/trpc";

export const constructRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.construct.findFirst({
        where: {
        id: input,
        },
    });
  }),

  getByMap: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.construct.findMany({
        where: {
        mapId: input,
        },
    });
  }),
});
