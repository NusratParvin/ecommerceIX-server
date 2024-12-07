/*
  Warnings:

  - The primary key for the `coupon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `orderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_couponId_fkey";

-- DropForeignKey
ALTER TABLE "orderItem" DROP CONSTRAINT "orderItem_orderId_fkey";

-- AlterTable
ALTER TABLE "coupon" DROP CONSTRAINT "coupon_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "coupon_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "coupon_id_seq";

-- AlterTable
ALTER TABLE "order" DROP CONSTRAINT "order_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "couponId" SET DATA TYPE TEXT,
ADD CONSTRAINT "order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "order_id_seq";

-- AlterTable
ALTER TABLE "orderItem" DROP CONSTRAINT "orderItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "orderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "orderItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "orderItem_id_seq";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
