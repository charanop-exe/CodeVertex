/*
  Warnings:

  - Made the column `examples` on table `Problem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `referenceSolutions` on table `Problem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Problem" ALTER COLUMN "examples" SET NOT NULL,
ALTER COLUMN "referenceSolutions" SET NOT NULL;
