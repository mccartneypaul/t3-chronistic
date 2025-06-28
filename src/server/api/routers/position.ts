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
import { ApiPosition, mapFromApi } from "@chronistic/stores/position";

export const positionRouter = createTRPCRouter({
  getByMap: protectedProcedure.input(zString()).query(({ ctx, input }) => {
    const result = ctx.prisma.$queryRaw<ApiPosition[]>`
      SELECT 
      id,
      mapId,
      constructId,
      posX,
      posY,
      createdAt,
      updatedAt,
      intervalFromBeginning::text
      FROM Position
      WHERE mapId = ${input};
    `;
    result
      .then((positions) => {
        return positions.map((position) => mapFromApi(position));
      })
      .catch((error) => {
        console.error("Error converting positions:", error);
      });
    return result;
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
      const result = ctx.prisma.$queryRaw<ApiPosition>`
      INSERT INTO Position (
      mapId,
      constructId,
      posX,
      posY,
      intervalFromBeginning
      ) VALUES (
        ${input.data.mapId},
        ${input.data.constructId},
        ${input.data.posX},
        ${input.data.posY},
        ${input.data.intervalFromBeginning}
      )
      RETURNING
      id,
      mapId,
      constructId,
      posX,
      posY,
      createdAt,
      updatedAt,
      intervalFromBeginning::text
    `;
      result
        .then((position) => {
          return mapFromApi(position);
        })
        .catch((error) => {
          console.error("Error converting position:", error);
        });
      return result;
    }),
});
