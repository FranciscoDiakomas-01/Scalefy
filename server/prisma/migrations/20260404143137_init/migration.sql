/*
  Warnings:

  - You are about to drop the column `getawaysInfo` on the `Subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `Subscriptions` table. All the data in the column will be lost.
  - Added the required column `planId` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriptions" DROP COLUMN "getawaysInfo",
DROP COLUMN "plan",
ADD COLUMN     "entity" TEXT,
ADD COLUMN     "paylink" TEXT,
ADD COLUMN     "planId" TEXT NOT NULL,
ADD COLUMN     "refernece" TEXT;

-- DropEnum
DROP TYPE "Plans";

-- CreateTable
CREATE TABLE "Plans" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "features" TEXT[],
    "amount" DECIMAL(10,2) NOT NULL,
    "maxCapains" INTEGER NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
