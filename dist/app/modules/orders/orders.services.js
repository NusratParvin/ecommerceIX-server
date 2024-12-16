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
exports.OrderServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const stripe_1 = require("stripe");
const stripeClient = new stripe_1.Stripe(process.env.PAYMENT_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia",
});
// const createOrder = async (
//   userId: string,
//   items: any[],
//   totalPrice: number,
//   shippingInfo: any,
//   paymentIntentId: string
// ) => {
//   const order = await prisma.order.create({
//     data: {
//       userId,
//       totalPrice,
//       paymentStatus: "UNPAID",
//       paymentMethod: "card",
//       shippingInfo,
//       Transaction: {
//         create: {
//           paymentStatus: "UNPAID",
//           type: "ORDER_PAYMENT",
//           stripePaymentIntentId: paymentIntentId,
//           amount: totalPrice,
//           userId,
//         },
//       },
//       items: {
//         create: items.map((item) => ({
//           productId: item.productId,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//       },
//     },
//   });
//   return order;
// };
const getOrderDetailsFromDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.default.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
            Transaction: true,
        },
    });
    if (!order)
        throw new Error("Order not found");
    return order;
});
// const processOrderAndPaymentIntoDB = async (
//   userId: string,
//   items: any[],
//   totalPrice: number,
//   couponId: string,
//   shippingInfo: any,
//   paymentIntentId: string
// ) => {
//   return await prisma.$transaction(async (prisma) => {
//     // Step 1: Confirm Payment with Stripe
//     const paymentIntent = await stripeClient.paymentIntents.retrieve(
//       paymentIntentId
//     );
//     if (paymentIntent.status !== "succeeded") {
//       throw new Error("Payment not successful");
//     }
//     await prisma.coupon.findUniqueOrThrow({ where: { id: couponId } });
//     await prisma.user.findUniqueOrThrow({
//       where: { id: userId, status: ActiveStatus.ACTIVE },
//     });
//     // Step 2: Create Order
//     const order = await prisma.order.create({
//       data: {
//         userId,
//         totalPrice,
//         paymentStatus: "PAID",
//         paymentMethod: "card",
//         couponId,
//         shippingInfo,
//         items: {
//           create: items.map((item) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//           })),
//         },
//       },
//     });
//     // Step 3: Record Transaction
//     const transaction = await prisma.transaction.create({
//       data: {
//         orderId: order.id,
//         userId,
//         amount: totalPrice,
//         paymentMethod: "card",
//         paymentStatus: "PAID",
//         type: "ORDER_PAYMENT",
//         stripePaymentIntentId: paymentIntentId,
//         description: "Payment for order",
//       },
//     });
//     // Step 4: Return the result
//     return {
//       order,
//       transaction,
//     };
//   });
// };
const processOrderAndPaymentIntoDB = (userId, shopId, items, totalPrice, couponId, shippingInfo, paymentIntentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Step 1: Confirm Payment with Stripe
        const paymentIntent = yield stripeClient.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== "succeeded") {
            throw new Error("Payment not successful");
        }
        // Step 2: Validate Coupon (if provided)
        if (couponId) {
            yield prisma.coupon.findUniqueOrThrow({ where: { id: couponId } });
        }
        console.log(userId);
        // Step 3: Validate User
        yield prisma.user.findUniqueOrThrow({
            where: { id: userId, status: client_1.ActiveStatus.ACTIVE },
        });
        yield prisma.shop.findUniqueOrThrow({
            where: { id: shopId, status: client_1.ActiveStatus.ACTIVE },
        });
        // Step 4: Create Order and Order Items
        const order = yield prisma.order.create({
            data: {
                userId,
                totalPrice,
                paymentStatus: "PAID",
                paymentMethod: "card",
                couponId,
                shopId,
                shippingInfo,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { items: true },
        });
        // Step 5: Record Transaction
        const transaction = yield prisma.transaction.create({
            data: {
                orderId: order.id,
                userId,
                amount: totalPrice,
                paymentMethod: "card",
                paymentStatus: "PAID",
                type: "ORDER_PAYMENT",
                stripePaymentIntentId: paymentIntentId,
                description: "Payment for order",
            },
        });
        // Step 6: Return the result
        return {
            order,
            transaction,
        };
    }));
});
exports.OrderServices = {
    getOrderDetailsFromDB,
    // createOrder,
    processOrderAndPaymentIntoDB,
};
