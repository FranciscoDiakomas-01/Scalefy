/*
  Warnings:

  - A unique constraint covering the columns `[getawayId]` on the table `Subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `getawayId` on table `Subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Subscriptions" ALTER COLUMN "getawayId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_getawayId_key" ON "Subscriptions"("getawayId");
