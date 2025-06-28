import {
  object as zObject,
  string as zString,
  number as zNumber,
} from "zod/v4";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@chronistic/server/api/trpc";

export const constructRouter = createTRPCRouter({
  getById: protectedProcedure.input(zString()).query(({ ctx, input }) => {
    return ctx.prisma.construct.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getByMap: protectedProcedure.input(zString()).query(({ ctx, input }) => {
    return ctx.prisma.construct.findMany({
      where: {
        mapId: input,
      },
    });
  }),

  createConstruct: protectedProcedure
    .input(
      zObject({
        data: zObject({
          name: zString(),
          description: zString(),
          mapId: zString(),
          posX: zNumber(),
          posY: zNumber(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create a new construct in the database
      const construct = await ctx.prisma.construct.create(input);
      return construct;
    }),

  deleteConstruct: protectedProcedure
    .input(zString())
    .mutation(async ({ ctx, input }) => {
      const construct = await ctx.prisma.construct.delete({
        where: {
          id: input,
        },
      });
      return construct;
    }),

  patchDescription: protectedProcedure
    .input(
      zObject({
        id: zString(),
        description: zString(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const construct = await ctx.prisma.construct.update({
        where: { id: input.id },
        data: { description: input.description },
      });
      return construct;
    }),

  patchName: protectedProcedure
    .input(
      zObject({
        id: zString(),
        name: zString(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const construct = await ctx.prisma.construct.update({
        where: { id: input.id },
        data: { name: input.name },
      });
      return construct;
    }),

  patchPosition: protectedProcedure
    .input(
      zObject({
        id: zString(),
        posX: zNumber(),
        posY: zNumber(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const construct = await ctx.prisma.construct.update({
        where: { id: input.id },
        data: { posX: input.posX, posY: input.posY },
      });
      return construct;
    }),
});
