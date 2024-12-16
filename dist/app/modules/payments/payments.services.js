"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const stripe_1 = require("stripe");
const stripeClient = new stripe_1.Stripe(process.env.PAYMENT_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia",
});
const createPaymentIntent = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentIntent = yield stripeClient.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
    });
    //   console.log(clientSecret: paymentIntent.client_secret );
    return paymentIntent;
});
const confirmPayment = (paymentIntentId, orderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentIntent = yield stripeClient.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
        throw new Error("Payment not successful");
    }
    const transaction = yield prisma_1.default.transaction.create({
        data: {
            orderId,
            userId,
            amount: paymentIntent.amount / 100,
            paymentMethod: "card",
            paymentStatus: "PAID",
            type: client_1.TransactionType.ORDER_PAYMENT,
            stripePaymentIntentId: paymentIntentId,
            description: "Order payment",
        },
    });
    return transaction;
});
exports.PaymentServices = { confirmPayment, createPaymentIntent };
