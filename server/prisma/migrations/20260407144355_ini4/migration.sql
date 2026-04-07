/*
  Warnings:

  - Added the required column `subtotal` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxType` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tax" INTEGER NOT NULL,
ADD COLUMN     "taxType" TEXT NOT NULL,
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL;
