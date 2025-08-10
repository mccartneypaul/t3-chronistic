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
      SELECT id, "mapId", "constructId", "posX", "posY", "createdAt", "updatedAt", iso_8601_format("intervalFromBeginning") AS "intervalFromBeginning"
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
      INSERT INTO public."Position" ("mapId", "constructId", "posX", "posY", "intervalFromBeginning")
      VALUES (
        ${input.data.mapId},
        ${input.data.constructId},
        ${input.data.posX},
        ${input.data.posY},
        ${input.data.intervalFromBeginning}::interval
      )
      RETURNING id, "mapId", "constructId", "posX", "posY", "createdAt", "updatedAt", iso_8601_format("intervalFromBeginning") AS "intervalFromBeginning"
    `;
    }),
  updatePosition: protectedProcedure
    .input(
      zObject({
        data: zObject({
          id: zString(),
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
      UPDATE public."Position"
      SET
        "mapId" = ${input.data.mapId},
        "constructId" = ${input.data.constructId},
        "posX" = ${input.data.posX},
        "posY" = ${input.data.posY},
        "intervalFromBeginning" = ${input.data.intervalFromBeginning}::interval,
        "updatedAt" = NOW()
      WHERE id = ${input.data.id}
      RETURNING id, "mapId", "constructId", "posX", "posY", "createdAt", "updatedAt", iso_8601_format("intervalFromBeginning") AS "intervalFromBeginning"
    `;
    }),
  upsertPosition: protectedProcedure
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
      INSERT INTO public."Position" ("mapId", "constructId", "posX", "posY", "intervalFromBeginning")
      VALUES (
        ${input.data.mapId},
        ${input.data.constructId},
        ${input.data.posX},
        ${input.data.posY},
        ${input.data.intervalFromBeginning}::interval
      )
      ON CONFLICT ("mapId", "constructId", "intervalFromBeginning")
      DO UPDATE SET
        "posX" = ${input.data.posX},
        "posY" = ${input.data.posY},
        "updatedAt" = NOW()
      RETURNING id, "mapId", "constructId", "posX", "posY", "createdAt", "updatedAt", iso_8601_format("intervalFromBeginning") AS "intervalFromBeginning"
    `;
    }),

  patchIntervalFromBeginning: protectedProcedure
    .input(
      zObject({
        id: zString(),
        intervalFromBeginning: zIso.duration(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$queryRaw<ApiPosition>`
      UPDATE public."Position" 
      SET "intervalFromBeginning" = ${input.intervalFromBeginning}::interval
      WHERE id = ${input.id}
      RETURNING id, "mapId", "constructId", "posX", "posY", "createdAt", "updatedAt", iso_8601_format("intervalFromBeginning") AS "intervalFromBeginning"
    `;
    }),

  deletePosition: protectedProcedure
    .input(zString())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$queryRaw<ApiPosition>`
      DELETE FROM public."Position" 
      WHERE id = ${input}
      RETURNING id, "mapId", "constructId", "posX", "posY", "createdAt", "updatedAt", iso_8601_format("intervalFromBeginning") AS "intervalFromBeginning"
    `;
    }),
});
