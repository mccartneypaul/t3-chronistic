import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@chronistic/server/api/trpc";

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

  createConstruct: publicProcedure
    .input(
      z.object({
        data: z.object({
          name: z.string(),
          description: z.string(),
          mapId: z.string(),
          posX: z.number(),
          posY: z.number(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create a new construct in the database
      const construct = await ctx.prisma.construct.create(input);
      return construct;
    }),

  deleteConstruct: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const construct = await ctx.prisma.construct.delete({
        where: {
          id: input,
        },
      });
      return construct;
    }),

  patchDescription: publicProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const construct = await ctx.prisma.construct.update({
        where: { id: input.id },
        data: { description: input.description },
      });
      return construct;
    }),

  patchName: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const construct = await ctx.prisma.construct.update({
        where: { id: input.id },
        data: { name: input.name },
      });
      return construct;
    }),

  patchPosition: publicProcedure
    .input(
      z.object({
        id: z.string(),
        posX: z.number(),
        posY: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const construct = await ctx.prisma.construct.update({
        where: { id: input.id },
        data: { posX: input.posX, posY: input.posY },
      });
      return construct;
    }),
});
