/*
  Warnings:

  - You are about to drop the column `hoverColor` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `href` on the `projects` table. All the data in the column will be lost.
  - Added the required column `description` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Category" ADD VALUE 'deeplearning';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "hoverColor",
DROP COLUMN "href",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "hosting" TEXT;
