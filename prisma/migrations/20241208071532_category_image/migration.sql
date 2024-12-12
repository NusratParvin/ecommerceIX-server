/*
  Warnings:

  - Added the required column `imageUrl` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "imageUrl" TEXT NOT NULL;
