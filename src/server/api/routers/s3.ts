import {
  createTRPCRouter,
  protectedProcedure,
} from "@chronistic/server/api/trpc";
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

type S3Image = {
  u8Stream: Uint8Array;
  fileType: string;
};

export const s3Router = createTRPCRouter({
  getByKey: protectedProcedure.input(z.string()).query(async ({ input }) => {
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
      const image: S3Image = {
        u8Stream: await data.Body.transformToByteArray(),
        fileType: data.ContentType || "image/jpeg",
      };
      return image;
    } catch (error) {
      console.error("Error fetching image from S3:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching image from S3",
        cause: error,
      });
    }
  }),
  deleteByKey: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: input,
      });
      try {
        await client.send(command);
        return { message: "Image deleted successfully" };
      } catch (error) {
        console.error("Error deleting image from S3:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting image from S3",
          cause: error,
        });
      }
    }),
  uploadImage: protectedProcedure
    .input(
      z.object({
        data: z.object({
          fileName: z.string(),
          fileType: z.string(),
          fileBlob: z.instanceof(Uint8Array).or(z.array(z.number())),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      // Ensure we have a buffer for the data
      const buffer = Buffer.from(input.data.fileBlob);

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: input.data.fileName,
        Body: buffer,
        ContentType: input.data.fileType,
      });
      try {
        const resp = await client.send(command);
        return { message: "Response from AWS: ", resp };
      } catch (error) {
        console.error("Error uploading image to S3:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error uploading image to S3",
          cause: error,
        });
      }
    }),
});
