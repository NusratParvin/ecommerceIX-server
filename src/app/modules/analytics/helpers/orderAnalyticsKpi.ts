import prisma from "../../../../shared/prisma";

export const getOrdersKPI = async () => {
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const prev30Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const ordersInLast30Days = await prisma.order.count({
    where: {
      paymentStatus: "PAID",
      createdAt: { gte: last30Days },
    },
  });

  const ordersInPrev30Days = await prisma.order.count({
    where: {
      paymentStatus: "PAID",
      createdAt: { gte: prev30Days, lt: last30Days },
    },
  });

  const changeAmount = ordersInLast30Days - ordersInPrev30Days;
  const orderGrowth =
    ordersInPrev30Days === 0
      ? ordersInLast30Days > 0
        ? 100
        : 0
      : Number(((changeAmount / ordersInPrev30Days) * 100).toFixed(1));

  return {
    ordersLast30: ordersInLast30Days,
    // ordersPrev30: ordersInPrev30Days,
    // changeAmount,
    orderGrowth,
  };
};
