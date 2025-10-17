/*
  Warnings:

  - You are about to drop the column `example` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `referenceSolution` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "example",
DROP COLUMN "referenceSolution",
ADD COLUMN     "examples" JSONB,
ADD COLUMN     "referenceSolutions" JSONB;
