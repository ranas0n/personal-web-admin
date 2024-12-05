/*
  Warnings:

  - You are about to drop the column `hoverColor` on the `stacks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stacks" DROP COLUMN "hoverColor",
ALTER COLUMN "href" DROP NOT NULL;

-- CreateTable
CREATE TABLE "project_stacks" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "stackId" INTEGER NOT NULL,

    CONSTRAINT "project_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_stacks_projectId_stackId_key" ON "project_stacks"("projectId", "stackId");

-- AddForeignKey
ALTER TABLE "project_stacks" ADD CONSTRAINT "project_stacks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("proj_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_stacks" ADD CONSTRAINT "project_stacks_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "stacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
