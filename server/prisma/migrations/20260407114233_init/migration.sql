/*
  Warnings:

  - Added the required column `duration` to the `Plans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanDurationType" AS ENUM ('DAYS', 'MONTH', 'YEARS');

-- AlterTable
ALTER TABLE "Plans" ADD COLUMN     "duration" "PlanDurationType" NOT NULL;
