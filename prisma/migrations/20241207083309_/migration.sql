/*
  Warnings:

  - The `status` column on the `shop` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('ACTIVE', 'BLACKLISTED', 'RESTRICTED', 'DELETED');

-- AlterTable
ALTER TABLE "shop" DROP COLUMN "status",
ADD COLUMN     "status" "ShopStatus" NOT NULL DEFAULT 'ACTIVE';
