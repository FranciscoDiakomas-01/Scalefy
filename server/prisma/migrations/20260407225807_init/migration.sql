-- AddForeignKey
ALTER TABLE "Clicks" ADD CONSTRAINT "Clicks_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Trackers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_clickId_fkey" FOREIGN KEY ("clickId") REFERENCES "Clicks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
