/*
  Warnings:

  - You are about to drop the column `amount` on the `Plans` table. All the data in the column will be lost.
  - Added the required column `price` to the `Plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plans" DROP COLUMN "amount",
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;
