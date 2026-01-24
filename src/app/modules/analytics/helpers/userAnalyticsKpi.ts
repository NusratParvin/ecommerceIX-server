import prisma from "../../../../shared/prisma";

export const getUserStatsKPI = async () => {
  const totalUser = await prisma.user.count();

  const usersInLast30Days = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });
  const usersInPrev30Days = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const changeInUsers = usersInLast30Days - usersInPrev30Days;

  const userGrowth =
    usersInPrev30Days === 0
      ? usersInLast30Days === 0
        ? 0
        : 100
      : Number((changeInUsers / usersInPrev30Days) * 100).toFixed(1);

  console.log(totalUser, userGrowth);
  return {
    totalUser,
    userGrowth,
  };
};
