-- CreateEnum
CREATE TYPE "Category" AS ENUM ('web', 'machinelearning', 'dataanalysis', 'iot', 'desktop', 'mobile');

-- CreateTable
CREATE TABLE "projects" (
    "proj_id" SERIAL NOT NULL,
    "proj_name" TEXT NOT NULL,
    "proj_img" TEXT NOT NULL DEFAULT 'logo_placeholder.png',
    "href" TEXT NOT NULL,
    "hoverColor" TEXT NOT NULL DEFAULT 'hover:bg-epic-black-light',
    "category" "Category" NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("proj_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "post_id" SERIAL NOT NULL,
    "post_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id")
);
