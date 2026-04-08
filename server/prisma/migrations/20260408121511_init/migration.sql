-- AlterTable
ALTER TABLE "Trackers" ALTER COLUMN "isActive" SET DEFAULT true;

-- AddForeignKey
ALTER TABLE "Campains" ADD CONSTRAINT "Campains_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
