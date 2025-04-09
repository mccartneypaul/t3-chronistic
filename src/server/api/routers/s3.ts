import { createTRPCRouter, publicProcedure } from "@chronistic/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export const s3Router = createTRPCRouter({
  getByKey: publicProcedure.input(z.string()).query(async ({ input }) => {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: input,
    });
    try {
      const data = await client.send(command);
      if (!data.Body) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Image not found",
        });
      }
      return await data.Body.transformToByteArray();
    } catch (error) {
      console.error("Error fetching image from S3:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching image from S3",
        cause: error,
      });
    }
  }),
});
