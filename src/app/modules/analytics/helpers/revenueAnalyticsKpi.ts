import prisma from "../../../../shared/prisma";

export const getRevenueKPI = async () => {
  const now = new Date();
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const prev30Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const revInLast30Days = await prisma.transaction.aggregate({
    where: {
      type: "ORDER_PAYMENT",
      paymentStatus: "PAID",
      createdAt: { gte: last30Days },
    },
    _sum: { amount: true },
  });

  const revInPrev30Days = await prisma.transaction.aggregate({
    where: {
      type: "ORDER_PAYMENT",
      paymentStatus: "PAID",
      createdAt: { gte: prev30Days, lt: last30Days },
    },
    _sum: { amount: true },
  });

  const revenueLast30 = Number(revInLast30Days._sum.amount ?? 0);
  const revenuePrev30 = Number(revInPrev30Days._sum.amount ?? 0);

  const changeAmount = revenueLast30 - revenuePrev30;

  const changePercent =
    revenuePrev30 === 0
      ? revenueLast30 > 0
        ? 100
        : 0
      : Number(((changeAmount / revenuePrev30) * 100).toFixed(1));

  return {
    revenueLast30,
    revenuePrev30,
    changeAmount,
    changePercent,
  };
};
