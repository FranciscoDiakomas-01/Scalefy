/*
  Warnings:

  - Added the required column `provider` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GetaWay" AS ENUM ('REFERENCE');

-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "getawayId" TEXT,
ADD COLUMN     "provider" "GetaWay" NOT NULL;
