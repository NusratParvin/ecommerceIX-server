import prisma from "../../../../shared/prisma";

export const newShops = async (givenDate: Date) => {
  const shops = await prisma.shop.findMany({
    where: {
      createdAt: {
        gte: givenDate,
      },
      status: "ACTIVE",
    },
  });

  return shops.length;
};
