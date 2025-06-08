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
});
