import { ActiveStatus, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { Stripe } from "stripe";
import { CartItems, ShippingInfoProps } from "./orders.interface";
import { pagination } from "../../../helpers/pagination";
import ApiError from "../../errors/apiErrors";
import { StatusCodes } from "http-status-codes";

const stripeClient = new Stripe(process.env.PAYMENT_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const processOrderAndPaymentIntoDB = async (
  userId: string,
  shopId: string,
  items: CartItems[],
  totalPrice: number,
  couponId: string | null,
  shippingInfo: ShippingInfoProps,
  paymentIntentId: string
) => {
  return await prisma.$transaction(async (prisma) => {
    const paymentIntent = await stripeClient.paymentIntents.retrieve(
      paymentIntentId
    );

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment not successful");
    }

    if (couponId) {
      await prisma.coupon.findUniqueOrThrow({ where: { id: couponId } });
    }
    console.log(userId);
    await prisma.user.findUniqueOrThrow({
      where: { id: userId, status: ActiveStatus.ACTIVE },
    });
    await prisma.shop.findUniqueOrThrow({
      where: { id: shopId, status: ActiveStatus.ACTIVE },
    });

    const order = await prisma.order.create({
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

    const transaction = await prisma.transaction.create({
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
  });
};

const getAllOrdersFromDB = async (
  filters: Record<string, any>,
  options: { page: number; limit: number; sortBy: string; sortOrder: string }
) => {
  const {
    page = 1,
    limit = 10,
    skip,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = pagination.calculatePagination(options);

  const where = {};

  const [data, total] = await Promise.all([
    prisma.order.findMany({
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
    prisma.order.count({ where }),
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
};

//general overview of orders for vendor
const getOrdersByShopFromDB = async (
  filters: Record<string, any>,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  },
  email: string
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      shops: true,
    },
  });

  if (!user || !user.shops.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found for user");
  }

  const shopIds = user.shops.map((shop) => shop.id);

  let where: Prisma.OrderWhereInput = {
    shopId: { in: shopIds },
  };

  if (filters.searchTerm) {
    where = {
      ...where,
      OR: [
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
      ],
    };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
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
    prisma.order.count({ where }),
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
};

const getShopOrderDetailsById = async (orderId: string, userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      shops: true,
    },
  });

  if (!user || user.shops.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No shops found for this user.");
  }

  const shopIds = user.shops.map((shop) => shop.id);

  const order = await prisma.order.findFirst({
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
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Order not found or access denied."
    );
  }

  return order;
};

const getOrdersByUserFromDB = async (
  filters: Record<string, any>,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  },
  userEmail: string
) => {
  const {
    page,
    limit,
    skip,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = pagination.calculatePagination(options);

  const user = await prisma.user.findFirst({ where: { email: userEmail } });
  console.log(userEmail, user);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  let where: Prisma.OrderWhereInput = {
    userId: user.id,
  };

  if (filters.searchTerm) {
    where = {
      ...where,
      AND: [
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
      ],
    };
  }

  const [data, total] = await Promise.all([
    prisma.order.findMany({
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
    prisma.order.count({ where }),
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
};

const getUserOrderDetailsByIdFromDB = async (
  orderId: string,
  userEmail: string
) => {
  const user = await prisma.user.findFirst({
    where: { email: userEmail },
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");
  }
  console.log(orderId, user.id);

  const order = await prisma.order.findFirst({
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
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Order not found or you do not have permission to view this order."
    );
  }

  return order;
};

export const OrdersServices = {
  processOrderAndPaymentIntoDB,
  getAllOrdersFromDB,
  getOrdersByShopFromDB,
  getOrdersByUserFromDB,
  getShopOrderDetailsById,
  getUserOrderDetailsByIdFromDB,
};
