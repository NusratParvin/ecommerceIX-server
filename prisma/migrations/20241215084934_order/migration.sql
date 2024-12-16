/*
  Warnings:

  - Added the required column `shopId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "shopId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
