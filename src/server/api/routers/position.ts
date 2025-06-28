import {
  object as zObject,
  string as zString,
  number as zNumber,
  iso as zIso,
} from "zod/v4";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@chronistic/server/api/trpc";
import { ApiPosition } from "@chronistic/stores/position";

export const positionRouter = createTRPCRouter({
  getByMap: protectedProcedure.input(zString()).query(({ ctx, input }) => {
    return ctx.prisma.$queryRaw<ApiPosition[]>`
      SELECT id, "mapId", "constructId", "posX", "posY", "createdAt", "updatedAt", "intervalFromBeginning"::text
      FROM public."Position"
      WHERE "mapId" = ${input};
    `;
  }),

  createPosition: protectedProcedure
    .input(
      zObject({
        data: zObject({
          mapId: zString(),
          constructId: zString(),
          posX: zNumber(),
          posY: zNumber(),
          intervalFromBeginning: zIso.duration(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$queryRaw<ApiPosition>`
      INSERT INTO public."Position" ("mapId", "constructId", "posX", "posY", "createdAt", "updatedAt", "intervalFromBeginning")
      VALUES (
        ${input.data.mapId},
        ${input.data.constructId},
        ${input.data.posX},
        ${input.data.posY},
        ${input.data.intervalFromBeginning}
      )
      RETURNING id, "mapId", "constructId", "posX", "posY", "createdAt", "updatedAt", "intervalFromBeginning"::text
    `;
    }),
});
