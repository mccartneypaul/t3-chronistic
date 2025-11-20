import type { Image } from "@prisma/client";

export interface StoreImage {
  id: string;
  filePath: string;
  rawWidth: number;
  rawHeight: number;
  createdAt: Date;
  updatedAt: Date;
}

export function mapFromApi(Image: Image): StoreImage {
  return {
    ...Image,
  };
}
