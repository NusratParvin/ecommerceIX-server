import { TransactionType } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { Stripe } from "stripe";

const stripeClient = new Stripe(process.env.PAYMENT_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const createPaymentIntent = async (amount: number) => {
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  //   console.log(clientSecret: paymentIntent.client_secret );
  return paymentIntent;
};

const confirmPayment = async (
  paymentIntentId: string,
  orderId: string,
  userId: string
) => {
  const paymentIntent = await stripeClient.paymentIntents.retrieve(
    paymentIntentId
  );

  if (paymentIntent.status !== "succeeded") {
    throw new Error("Payment not successful");
  }

  const transaction = await prisma.transaction.create({
    data: {
      orderId,
      userId,
      amount: paymentIntent.amount / 100,
      paymentMethod: "card",
      paymentStatus: "PAID",
      type: TransactionType.ORDER_PAYMENT,
      stripePaymentIntentId: paymentIntentId,
      description: "Order payment",
    },
  });

  return transaction;
};
export const PaymentServices = { confirmPayment, createPaymentIntent };
