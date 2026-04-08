/*
  Warnings:

  - You are about to drop the column `maxCapains` on the `Plans` table. All the data in the column will be lost.
  - You are about to drop the column `maxTrackers` on the `Plans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plans" DROP COLUMN "maxCapains",
DROP COLUMN "maxTrackers";
