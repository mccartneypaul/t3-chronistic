import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@chronistic/server/api/trpc";

export const mapRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.map.findFirst({
      where: {
        id: input,
      },
    });
  }),

  createMap: publicProcedure
    .input(
      z.object({
        data: z.object({
          name: z.string(),
          filePath: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create a new map in the database
      const map = await ctx.prisma.map.create(input);
      return map;
    }),

  deleteMap: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const map = await ctx.prisma.map.delete({
        where: {
          id: input,
        },
      });
      return map;
    }),

  patchName: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const map = await ctx.prisma.map.update({
        where: { id: input.id },
        data: { name: input.name },
      });
      return map;
    }),
});
