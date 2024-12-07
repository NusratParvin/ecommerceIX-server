/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `shop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shop" DROP COLUMN "imageUrl",
ADD COLUMN     "logo" TEXT;
