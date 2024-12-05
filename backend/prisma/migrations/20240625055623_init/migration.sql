-- CreateTable
CREATE TABLE "stacks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT 'logo_placeholder.png',
    "href" TEXT NOT NULL,
    "hoverColor" TEXT NOT NULL DEFAULT 'hover:bg-epic-black-light',
    "category" TEXT NOT NULL DEFAULT 'learning',

    CONSTRAINT "stacks_pkey" PRIMARY KEY ("id")
);
