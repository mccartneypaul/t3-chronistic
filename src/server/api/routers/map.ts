import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@chronistic/server/api/trpc";

export const mapRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.map.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getByWorld: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.map.findMany({
      where: {
        worldId: input,
      },
    });
  }),

  createMap: protectedProcedure
    .input(
      z.object({
        data: z.object({
          name: z.string(),
          filePath: z.string(),
          worldId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create a new map in the database
      const map = await ctx.prisma.map.create(input);
      return map;
    }),

  deleteMap: protectedProcedure
    // TODO: remove children of map before deleting
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const map = await ctx.prisma.map.delete({
        where: {
          id: input,
        },
      });
      return map;
    }),

  patchName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const map = await ctx.prisma.map.update({
        where: { id: input.id },
        data: { name: input.name },
      });
      return map;
    }),
});
