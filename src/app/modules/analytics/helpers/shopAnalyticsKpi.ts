import prisma from "../../../../shared/prisma";

export const getShopStatsKPI = async () => {
  const activeShops = await prisma.shop.count({
    where: {
      status: "ACTIVE",
    },
  });

  const shopsInLast30Days = await prisma.shop.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const shopsInPrev30Days = await prisma.shop.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // ✅ 60 days ago
        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // ✅ up to 30 days ago
      },
    },
  });

  const changeInShops = shopsInLast30Days - shopsInPrev30Days;

  const shopGrowth =
    shopsInPrev30Days === 0
      ? shopsInLast30Days === 0
        ? 0
        : 100
      : Number(((changeInShops / shopsInPrev30Days) * 100).toFixed(1));

  return {
    activeShops,

    shopGrowth,
  };
};
