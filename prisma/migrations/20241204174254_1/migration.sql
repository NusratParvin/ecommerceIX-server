/*
  Warnings:

  - You are about to drop the column `inventoryCount` on the `product` table. All the data in the column will be lost.
  - Added the required column `stock` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "inventoryCount",
ADD COLUMN     "stock" INTEGER NOT NULL;
