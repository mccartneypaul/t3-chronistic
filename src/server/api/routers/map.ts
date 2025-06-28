import { object as zObject, string as zString } from "zod/v4";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@chronistic/server/api/trpc";

export const mapRouter = createTRPCRouter({
  getById: protectedProcedure.input(zString()).query(({ ctx, input }) => {
    return ctx.prisma.map.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getByWorld: protectedProcedure.input(zString()).query(({ ctx, input }) => {
    return ctx.prisma.map.findMany({
      where: {
        worldId: input,
      },
    });
  }),

  createMap: protectedProcedure
    .input(
      zObject({
        data: zObject({
          name: zString(),
          filePath: zString(),
          worldId: zString(),
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
    .input(zString())
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
      zObject({
        id: zString(),
        name: zString(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const map = await ctx.prisma.map.update({
        where: { id: input.id },
        data: { name: input.name },
      });
      return map;
    }),

  getByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.map.findMany({
      where: {
        world: {
          userId: ctx.session.user.id,
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
});
