// import {
//   S3Client,
//   GetObjectCommand,
//   DeleteObjectCommand,
//   PutObjectCommand,
// } from "@aws-sdk/client-s3";
// import { NextApiRequest } from "next";
// import { revalidatePath } from "next/cache";
// import { NextResponse, type NextRequest } from "next/server";

// const client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
//   },
// });

// // Get based on key
// export const GET = async (request: NextRequest) => {
//   const { searchParams } = request.nextUrl;

//   const file = searchParams.get("file");

//   // console.log("file", file);
//   if (!file) {
//     return new Response(
//       JSON.stringify({ error: "File query parameter is required" }),
//       { status: 400, headers: { "Content-Type": "application/json" } },
//     );
//   }

//   const command = new GetObjectCommand({
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: file,
//   });

//   try {
//     const data = await client.send(command);
//     if (!data.Body) {
//       return new NextResponse("Image not found", { status: 404 });
//     }

//     const body = await data.Body.transformToByteArray();
//     const headers = new Headers();
//     headers.set("Content-Type", data.ContentType || "image/jpeg");
//     return new NextResponse(body, { status: 200, headers });
//   } catch (error) {
//     console.error("Error fetching image from S3:", error);
//     return new NextResponse("Error fetching image from S3", { status: 500 });
//   }
// };

// // export async function getAllObjectsSignedUrls({
// //   Bucket,
// // }: S3ParamsPayload): Promise<{ key: string; url: string }[]> {
// //   const s3 = new S3Client({
// //     region: process.env.AWS_REGION,
// //     credentials: {
// //       accessKeyId: process.env.AWS_ACCESS_KEY!,
// //       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
// //     },
// //   });

// //   try {
// //     // List all objects in the bucket
// //     const listCommand = new ListObjectsV2Command({ Bucket });
// //     const listObjectsOutput: ListObjectsV2CommandOutput =
// //       await s3.send(listCommand);

// //     const signedUrls = await Promise.all(
// //       (listObjectsOutput.Contents || []).map(async (object) => {
// //         if (object.Key) {
// //           const getObjectCommand = new GetObjectCommand({
// //             Bucket,
// //             Key: object.Key,
// //           });
// //           const url = await getSignedUrl(s3, getObjectCommand, {
// //             expiresIn: 3600,
// //           });
// //           return { key: object.Key, url };
// //         }
// //         return null;
// //       }),
// //     );

// //     // Filter out any null results (in case an object didn't have a Key for some reason)
// //     return signedUrls.filter(
// //       (item): item is { key: string; url: string } => item !== null,
// //     );
// //   } catch (error) {
// //     console.error("Error retrieving objects from S3:", error);
// //     throw new Error("Failed to retrieve objects from S3.");
// //   }
// // }

// export const DELETE = async (request: NextRequest) => {
//   const { searchParams } = request.nextUrl;
//   const file = searchParams.get("file");

//   if (!file) {
//     return new Response(
//       JSON.stringify({ error: "File query parameter is required" }),
//       { status: 400, headers: { "Content-Type": "application/json" } },
//     );
//   }

//   const command = new DeleteObjectCommand({
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: file,
//   });

//   console.log(command);

//   try {
//     const res = await client.send(command);
//     revalidatePath("/");

//     console.log(res);
//     return res;
//   } catch (error) {
//     console.error("Error deleting image from S3:", error);
//     throw new Error("Failed to delete image from S3.");
//   }
// };

// export const POST = async (request: NextApiRequest) => {
//   const { data } = await request.body.json();

//   try {
//     const files = data.getAll("file") as File[];

//     const response = await Promise.all(
//       files.map(async (file) => {
//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         const fileUploadParams = {
//           Bucket: process.env.AWS_BUCKET_NAME,
//           Key: file.name,
//           Body: buffer,
//           ContentType: file.type,
//         };

//         const imageParam = new PutObjectCommand(fileUploadParams);
//         await client.send(imageParam);
//       }),
//     );

//     revalidatePath("/");
//     return response;
//   } catch (error) {
//     console.error("Error uploading image to S3:", error);
//     throw new Error("Failed to upload image to S3.");
//   }
// };
