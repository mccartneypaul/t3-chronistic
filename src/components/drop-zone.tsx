"use client";

import { FileError, FileRejection, useDropzone } from "react-dropzone";
import React, { useState } from "react";

import { api } from "@chronistic/utils/api";
import { useMapContext } from "@chronistic/providers/map-store-provider";
import { mapFromApi as mapMapFromApi } from "@chronistic/stores/map";
import { useImageContext } from "@chronistic/providers/image-store-provider";
import { mapFromApi as mapImageFromApi } from "@chronistic/stores/image";

const FILE_UPLOAD_SIZE_LIMIT =
  Number(process.env.NEXT_PUBLIC_FILE_UPLOAD_SIZE_LIMIT) ?? 50;
const MAX_FILE_SIZE_BYTES = FILE_UPLOAD_SIZE_LIMIT * 1024 * 1024;
const MAX_IMAGE_COUNT = 3;

export interface DropZoneProps {
  worldId: string;
}

export async function getImageSize(blob: Blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = URL.createObjectURL(blob);
  });
}

export default function Dropzone(props: DropZoneProps) {
  const createMap = api.map.createMap.useMutation();
  const createImage = api.image.createImage.useMutation();
  const uploadImage = api.s3.uploadImage.useMutation();
  const [uploading, setUploading] = useState<boolean>(false);
  const addMap = useMapContext((state) => state.addMap);
  const addImage = useImageContext((state) => state.addImage);

  const typeValidator = (file: File): FileError | null => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        code: "size-too-large",
        message: `Image file is larger than ${FILE_UPLOAD_SIZE_LIMIT}MB.`,
      };
    }
    return null;
  };

  const onDrop = async (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[],
  ) => {
    if (rejectedFiles.length > 0) {
      alert(
        `You're trying to upload a file larger than ${FILE_UPLOAD_SIZE_LIMIT}MB. Please try again.`,
      );
      return;
    }

    setUploading(true);

    try {
      for (const file of acceptedFiles) {
        try {
          // Get the image's dimensions
          const { width, height } = (await getImageSize(file)) as {
            width: number;
            height: number;
          };
          console.log(
            `Uploaded image dimensions for ${file.name}: ${width}x${height}`,
          );

          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          await uploadImage
            .mutateAsync({
              data: {
                fileName: file.name,
                fileType: file.type,
                fileBlob: uint8Array,
              },
            })
            .then(() => {
              createImage
                .mutateAsync({
                  data: {
                    filePath: file.name,
                    rawWidth: width,
                    rawHeight: height,
                  },
                })
                .then((image) => {
                  addImage(mapImageFromApi(image));
                  createMap
                    .mutateAsync({
                      data: {
                        name: file.name,
                        worldId: props.worldId,
                        filePath: file.name,
                        imageId: image.id,
                      },
                    })
                    .then((map) => {
                      addMap(mapMapFromApi(map));
                    });
                });
            })
            .catch((error) => {
              console.error(`Failed to upload ${file.name}:`, error);
              throw new Error(`Failed to upload ${file.name}`);
            });

          // Create map entry after successful upload
        } catch (error) {
          alert("Failed to upload images");
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    validator: typeValidator,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/jpg": [],
    },
    maxSize: MAX_FILE_SIZE_BYTES,
    maxFiles: MAX_IMAGE_COUNT,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="h-50 cursor-pointer rounded-lg border-2 border-dashed border-slate-200 p-8 text-center text-slate-100 duration-200 hover:bg-slate-300/85"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            {`Drag and drop some files here, or click to select files (up to ${MAX_IMAGE_COUNT} images, max ${FILE_UPLOAD_SIZE_LIMIT}MB each)`}
          </p>
        )}
      </div>

      {uploading && <p>Uploading...</p>}
    </div>
  );
}
