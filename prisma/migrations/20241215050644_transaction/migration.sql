/*
  Warnings:

  - Added the required column `stripePaymentIntentId` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "stripePaymentIntentId" TEXT NOT NULL;
