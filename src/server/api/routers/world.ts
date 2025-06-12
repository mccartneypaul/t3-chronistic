import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@chronistic/server/api/trpc";

export const worldRouter = createTRPCRouter({
  // This only returns the first world for the user
  getByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.world.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  // Create a new world in the database
  createWorld: protectedProcedure
    .input(
      z.object({
        data: z.object({
          name: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const world = await ctx.prisma.world.create({
        data: {
          name: input.data.name,
          userId: ctx.session.user.id,
        },
      });
      return world;
    }),
});
