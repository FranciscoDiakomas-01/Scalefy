-- DropIndex
DROP INDEX "Campains_userId_title_key";

-- AlterTable
ALTER TABLE "Campains" ALTER COLUMN "isActive" SET DEFAULT true;
