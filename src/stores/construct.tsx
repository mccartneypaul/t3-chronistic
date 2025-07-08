import type { Construct } from "@prisma/client";

export interface StoreConstruct {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export function mapFromApi(Construct: Construct): StoreConstruct {
  return {
    ...Construct,
  };
}
