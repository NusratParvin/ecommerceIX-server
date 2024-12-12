-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ORDER_PAYMENT', 'SHOP_PAYOUT');

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
