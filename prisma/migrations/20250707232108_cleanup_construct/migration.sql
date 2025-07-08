/*
  Warnings:

  - You are about to drop the column `mapId` on the `Construct` table. All the data in the column will be lost.
  - You are about to drop the column `posX` on the `Construct` table. All the data in the column will be lost.
  - You are about to drop the column `posY` on the `Construct` table. All the data in the column will be lost.
  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mapId,constructId,intervalFromBeginning]` on the table `Position` will be added. If there are existing duplicate values, this will fail.

*/

CREATE FUNCTION iso_8601_format(i INTERVAL)
    RETURNS TEXT
    AS $$
        BEGIN
            SET LOCAL intervalstyle = 'iso_8601';
            RETURN i::TEXT;
        END;
    $$ LANGUAGE plpgsql;

-- DropForeignKey
ALTER TABLE "Construct" DROP CONSTRAINT "Construct_mapId_fkey";

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "intervalFromBeginning" interval NOT NULL DEFAULT '0 seconds'::interval,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();

-- CreateIndex
CREATE UNIQUE INDEX "Position_mapId_constructId_intervalFromBeginning_key" ON "Position"("mapId", "constructId", "intervalFromBeginning");

-- Migrate from storing position data in the Construct table to a new Position table
INSERT INTO "Position" ("id", "mapId", "constructId", "posX", "posY", "intervalFromBeginning", "createdAt", "updatedAt")
  SELECT gen_random_uuid(), "mapId", "id", "posX", "posY", MAKE_INTERVAL(), now(), now()
  FROM "Construct";

-- AlterTable
ALTER TABLE "Construct" DROP COLUMN "mapId",
DROP COLUMN "posX",
DROP COLUMN "posY";

-- DropTable
DROP TABLE "Example";
