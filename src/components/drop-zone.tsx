"use client";

import { FileError, FileRejection, useDropzone } from "react-dropzone";
import React, { useState } from "react";

import { api } from "@chronistic/utils/api";
import { useMapContext } from "@chronistic/providers/map-store-provider";
import { mapFromApi } from "@chronistic/stores/map";

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_IMAGE_COUNT = 3;

export interface DropZoneProps {
  worldId: string;
}

export default function Dropzone(props: DropZoneProps) {
  const createMap = api.map.createMap.useMutation();
  const uploadImage = api.s3.uploadImage.useMutation();
  const [uploading, setUploading] = useState<boolean>(false);
  const addMap = useMapContext((state) => state.addMap);

  const typeValidator = (file: File): FileError | null => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        code: "size-too-large",
        message: `Image file is larger than ${MAX_FILE_SIZE_MB}MB.`,
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
        `You're trying to upload a file larger than ${MAX_FILE_SIZE_MB}MB. Please try again.`,
      );
      return;
    }

    setUploading(true);

    try {
      for (const file of acceptedFiles) {
        try {
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
              createMap
                .mutateAsync({
                  data: {
                    name: file.name,
                    worldId: props.worldId,
                    filePath: file.name,
                  },
                })
                .then((map) => {
                  addMap(mapFromApi(map));
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
            {`Drag and drop some files here, or click to select files (up to ${MAX_IMAGE_COUNT} images, max ${MAX_FILE_SIZE_MB}MB each)`}
          </p>
        )}
      </div>

      {uploading && <p>Uploading...</p>}
    </div>
  );
}
