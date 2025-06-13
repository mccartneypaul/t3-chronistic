import type { Map } from "@prisma/client";

export interface StoreMap {
  id: string;
  name: string;
  filePath: string;
  worldId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function mapFromApi(Map: Map): StoreMap {
  return {
    ...Map,
  };
}
