import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;

  const file = searchParams.get("file");

  // console.log("file", file);
  if (!file) {
    return new Response(
      JSON.stringify({ error: "File query parameter is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file,
  });

  try {
    const data = await client.send(command);
    if (!data.Body) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const body = await data.Body.transformToByteArray();
    const headers = new Headers();
    headers.set("Content-Type", data.ContentType || "image/jpeg");
    return new NextResponse(body, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    return new NextResponse("Error fetching image from S3", { status: 500 });
  }
};
