import prisma from "../../../../shared/prisma";

export const getOrderStatsKPI = async () => {
  const activeShops = await prisma.shop.count({
    where: {
      status: "ACTIVE",
    },
  });

  const newShopsInLast30Days = await prisma.shop.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  let newShopsPercentOfTotal = 0;
  activeShops === 0
    ? 0
    : (newShopsPercentOfTotal = Number(
        ((newShopsInLast30Days / activeShops) * 100).toFixed(1)
      ));

  //   console.log(newUsersInLast30Days);
  return {
    activeShops,
    newShopsInLast30Days,
    newShopsPercentOfTotal,
  };
};
