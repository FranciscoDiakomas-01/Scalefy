/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Plans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plans_title_key" ON "Plans"("title");
