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
exports.OrdersServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const stripe_1 = require("stripe");
const pagination_1 = require("../../../helpers/pagination");
const apiErrors_1 = __importDefault(require("../../errors/apiErrors"));
const http_status_codes_1 = require("http-status-codes");
const stripeClient = new stripe_1.Stripe(process.env.PAYMENT_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia",
});
const processOrderAndPaymentIntoDB = (userId, shopId, items, totalPrice, couponId, shippingInfo, paymentIntentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const paymentIntent = yield stripeClient.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== "succeeded") {
            throw new Error("Payment not successful");
        }
        if (couponId) {
            yield prisma.coupon.findUniqueOrThrow({ where: { id: couponId } });
        }
        console.log(userId);
        yield prisma.user.findUniqueOrThrow({
            where: { id: userId, status: client_1.ActiveStatus.ACTIVE },
        });
        yield prisma.shop.findUniqueOrThrow({
            where: { id: shopId, status: client_1.ActiveStatus.ACTIVE },
        });
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
        return {
            order,
            transaction,
        };
    }));
});
const getAllOrdersFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, skip, sortBy = "createdAt", sortOrder = "desc", } = pagination_1.pagination.calculatePagination(options);
    const where = {};
    const [data, total] = yield Promise.all([
        prisma_1.default.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                shop: true,
                user: true,
                items: true,
                coupon: true,
            },
        }),
        prisma_1.default.order.count({ where }),
    ]);
    const hasNextPage = skip + data.length < total;
    console.log(data, total, hasNextPage, "order admin");
    return {
        meta: {
            total,
            page,
            limit,
            hasNextPage,
        },
        data,
    };
});
//general overview of orders for vendor
const getOrdersByShopFromDB = (filters, options, email) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options);
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
        include: {
            shops: true,
        },
    });
    if (!user || !user.shops.length) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Shop not found for user");
    }
    const shopIds = user.shops.map((shop) => shop.id);
    let where = {
        shopId: { in: shopIds },
    };
    if (filters.searchTerm) {
        where = Object.assign(Object.assign({}, where), { OR: [
                {
                    id: { contains: filters.searchTerm, mode: "insensitive" },
                },
                {
                    items: {
                        some: {
                            product: {
                                OR: [
                                    {
                                        name: { contains: filters.searchTerm, mode: "insensitive" },
                                    },
                                    {
                                        category: {
                                            name: {
                                                contains: filters.searchTerm,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            ] });
    }
    const [orders, total] = yield Promise.all([
        prisma_1.default.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy || "createdAt"]: sortOrder || "desc" },
            include: {
                user: true,
                shop: true,
                coupon: true,
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma_1.default.order.count({ where }),
    ]);
    const hasNextPage = skip + orders.length < total;
    return {
        meta: {
            total,
            page,
            limit,
            hasNextPage,
        },
        data: orders,
    };
});
const getShopOrderDetailsById = (orderId, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
        include: {
            shops: true,
        },
    });
    if (!user || user.shops.length === 0) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No shops found for this user.");
    }
    const shopIds = user.shops.map((shop) => shop.id);
    const order = yield prisma_1.default.order.findFirst({
        where: {
            id: orderId,
            shopId: { in: shopIds },
        },
        include: {
            // shop: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            coupon: true,
            items: {
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
            Transaction: true,
        },
    });
    if (!order) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Order not found or access denied.");
    }
    return order;
});
const getOrdersByUserFromDB = (filters, options, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy = "createdAt", sortOrder = "desc", } = pagination_1.pagination.calculatePagination(options);
    const user = yield prisma_1.default.user.findFirst({ where: { email: userEmail } });
    console.log(userEmail, user);
    if (!user) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    let where = {
        userId: user.id,
    };
    if (filters.searchTerm) {
        where = Object.assign(Object.assign({}, where), { AND: [
                {
                    OR: [
                        { id: { contains: filters.searchTerm, mode: "insensitive" } },
                        {
                            shop: {
                                name: { contains: filters.searchTerm, mode: "insensitive" },
                            },
                        },
                        {
                            items: {
                                some: {
                                    product: {
                                        name: { contains: filters.searchTerm, mode: "insensitive" },
                                    },
                                },
                            },
                        },
                    ],
                },
            ] });
    }
    const [data, total] = yield Promise.all([
        prisma_1.default.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                shop: true,
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                coupon: true,
            },
        }),
        prisma_1.default.order.count({ where }),
    ]);
    const hasNextPage = skip + data.length < total;
    return {
        meta: {
            total,
            page,
            limit,
            hasNextPage,
        },
        data,
    };
});
const getUserOrderDetailsByIdFromDB = (orderId, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { email: userEmail },
    });
    if (!user) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found.");
    }
    console.log(orderId, user.id);
    const order = yield prisma_1.default.order.findFirst({
        where: {
            id: orderId,
            // userId: user.id,
        },
        include: {
            shop: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                },
            },
            coupon: true,
            items: {
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
            Transaction: {
                where: {
                    userId: user.id,
                },
            },
        },
    });
    if (!order) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Order not found or you do not have permission to view this order.");
    }
    return order;
});
exports.OrdersServices = {
    processOrderAndPaymentIntoDB,
    getAllOrdersFromDB,
    getOrdersByShopFromDB,
    getOrdersByUserFromDB,
    getShopOrderDetailsById,
    getUserOrderDetailsByIdFromDB,
};
