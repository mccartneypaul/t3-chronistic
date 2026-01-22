import {
  object as zObject,
  string as zString,
  number as zNumber,
} from "zod/v4";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@chronistic/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getById: protectedProcedure.input(zString()).query(({ ctx, input }) => {
    return ctx.prisma.image.findFirst({
      where: {
        id: input,
        userId: ctx.session.user.id,
      },
    });
  }),
  getByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.image.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        filePath: "asc",
      },
    });
  }),
  /// Create a new image in the database
  createImage: protectedProcedure
    .input(
      zObject({
        data: zObject({
          filePath: zString(),
          rawWidth: zNumber(),
          rawHeight: zNumber(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.image.create({
        data: {
          filePath: input.data.filePath,
          rawWidth: input.data.rawWidth,
          rawHeight: input.data.rawHeight,
          userId: ctx.session.user.id,
        },
      });
      return image;
    }),
  /// Delete an image from the database
  deleteImage: protectedProcedure
    .input(
      zObject({
        id: zString(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.image.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
      return image;
    }),
});
