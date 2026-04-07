/*
  Warnings:

  - A unique constraint covering the columns `[maxCapains]` on the table `Plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[maxTrackers]` on the table `Plans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plans_maxCapains_key" ON "Plans"("maxCapains");

-- CreateIndex
CREATE UNIQUE INDEX "Plans_maxTrackers_key" ON "Plans"("maxTrackers");
