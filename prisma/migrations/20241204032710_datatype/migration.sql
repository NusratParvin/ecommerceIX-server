/*
  Warnings:

  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `shop` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `shopFollower` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_userId_fkey";

-- DropForeignKey
ALTER TABLE "orderItem" DROP CONSTRAINT "orderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_shopId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_productId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_userId_fkey";

-- DropForeignKey
ALTER TABLE "shop" DROP CONSTRAINT "shop_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "shopFollower" DROP CONSTRAINT "shopFollower_shopId_fkey";

-- DropForeignKey
ALTER TABLE "shopFollower" DROP CONSTRAINT "shopFollower_userId_fkey";

-- AlterTable
ALTER TABLE "category" DROP CONSTRAINT "category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "category_id_seq";

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "orderItem" ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "product" DROP CONSTRAINT "product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "shopId" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "product_id_seq";

-- AlterTable
ALTER TABLE "review" ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "shop" DROP CONSTRAINT "shop_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "shop_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "shop_id_seq";

-- AlterTable
ALTER TABLE "shopFollower" DROP CONSTRAINT "shopFollower_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "shopId" SET DATA TYPE TEXT,
ADD CONSTRAINT "shopFollower_pkey" PRIMARY KEY ("userId", "shopId");

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_id_seq";

-- AddForeignKey
ALTER TABLE "shop" ADD CONSTRAINT "shop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopFollower" ADD CONSTRAINT "shopFollower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopFollower" ADD CONSTRAINT "shopFollower_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
