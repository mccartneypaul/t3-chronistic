/*
  Warnings:

  - Added the required column `imageId` to the `Construct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Construct" ADD COLUMN     "imageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "imageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Position" ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now(),
ALTER COLUMN "intervalFromBeginning" SET DEFAULT '0 seconds'::interval;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "rawWidth" INTEGER NOT NULL,
    "rawHeight" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Construct" ADD CONSTRAINT "Construct_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate the image references to the image table
INSERT INTO "Image" ("id", "filePath", "rawWidth", "rawHeight", "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    "filePath",
    0,
    0,
    NOW(),
    NOW()
FROM "Map";
