"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { api } from "@chronistic/utils/api";
import { useConstructContext } from "@chronistic/providers/construct-store-provider";
import { useImageContext } from "@chronistic/providers/image-store-provider";
import { mapFromApi as mapImageFromApi } from "@chronistic/stores/image";
import Button from "@mui/material/Button";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { getImageSize } from "@chronistic/utils/image";

const FILE_UPLOAD_SIZE_LIMIT =
  Number(process.env.NEXT_PUBLIC_FILE_UPLOAD_SIZE_LIMIT) ?? 50;
const MAX_FILE_SIZE_BYTES = FILE_UPLOAD_SIZE_LIMIT * 1024 * 1024;

// For using the react mui button as a file input
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export interface ConstructSetIconProps {
  constructId: string;
}

export default function ConstructSetIcon(props: ConstructSetIconProps) {
  const patchConstructImage = api.construct.patchImage.useMutation();
  const createImage = api.image.createImage.useMutation();
  const uploadS3Image = api.s3.uploadImage.useMutation();
  const deleteS3Image = api.s3.deleteByKey.useMutation();
  const deleteImage = api.image.deleteImage.useMutation();
  const [uploading, setUploading] = useState<boolean>(false);
  const addImage = useImageContext((state) => state.addImage);
  const setConstruct = useConstructContext((state) => state.setConstruct);
  const setActiveConstruct = useConstructContext(
    (state) => state.setActiveConstruct,
  );

  const activeConstruct = useConstructContext((state) => state.activeConstruct);
  const storeImages = useImageContext((state) => state.images);
  const storeImage = useMemo(
    () => storeImages.filter((img) => img.id === activeConstruct?.imageId)[0],
    [storeImages, activeConstruct?.imageId],
  );

  const { data: constructImage } = api.s3.getByKey.useQuery(
    storeImage?.filePath ?? "",
    {
      enabled: !!storeImage?.filePath && storeImage.filePath.length > 0,
    },
  );

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !files[0]) return;

    const file = files[0];

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(
        `You're trying to upload a file larger than ${FILE_UPLOAD_SIZE_LIMIT}MB. Please try again.`,
      );
      return;
    }

    setUploading(true);

    // Get the image's dimensions
    const { width, height } = (await getImageSize(file)) as {
      width: number;
      height: number;
    };

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Cleanup previous image from S3 if it exists
    if (
      !!storeImage?.filePath &&
      storeImage?.filePath.length > 0 &&
      !!storeImage?.id
    ) {
      await deleteS3Image
        .mutateAsync(storeImage?.filePath)
        .then(() => {
          return patchConstructImage.mutateAsync({
            id: props.constructId,
            imageId: null,
          });
        })
        .then(() => {
          return deleteImage.mutateAsync({ id: storeImage?.id });
        })
        .catch((error) => {
          console.error(
            `Failed to delete previous image ${storeImage?.id}:`,
            error,
          );
        });
    }

    await uploadS3Image
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
            patchConstructImage
              .mutateAsync({
                id: props.constructId,
                imageId: image.id,
              })
              .then((construct) => {
                // Update the store construct with the new image ID
                setConstruct(props.constructId, construct);

                // Update active construct to reflect the new imageId
                setActiveConstruct(props.constructId);
              });
          });
      })
      .catch((error) => {
        console.error(`Failed to upload ${file.name}:`, error);
        throw new Error(`Failed to upload ${file.name}`);
      });

    setUploading(false);
  };

  return (
    <div>
      <Tooltip title={"Upload Construct Image"}>
        <Button
          className="size-16"
          component="label"
          role={undefined}
          variant="outlined"
          tabIndex={-1}
          endIcon={
            <div>
              {constructImage && (
                <Image
                  className={`object-contain`}
                  src={`data:${constructImage?.fileType};base64,${Buffer.from(constructImage?.u8Stream ?? []).toString("base64")}`}
                  priority
                  alt=""
                  quality="100"
                  fill
                />
              )}
            </div>
          }
          sx={{
            padding: "1px",
          }}
          loading={uploading}
        >
          {!constructImage && (
            <>
              <Typography className="text-center text-wrap" variant="body2">
                Add Image
              </Typography>
              <Badge
                badgeContent={"+"}
                color="primary"
                overlap="circular"
                sx={{ top: -25, right: 55 }}
              />
            </>
          )}
          <VisuallyHiddenInput
            type="file"
            accept="image/png, image/jpeg, image/webp, image/jpg"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </Button>
      </Tooltip>
    </div>
  );
}
