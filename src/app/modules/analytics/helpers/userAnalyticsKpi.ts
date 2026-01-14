import prisma from "../../../../shared/prisma";

export const getUserStatsKPI = async () => {
  const totalUser = await prisma.user.count();

  const newUsersInLast30Days = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  let newUsersPercentOfTotal = 0;
  totalUser === 0
    ? 0
    : (newUsersPercentOfTotal = Number(
        ((newUsersInLast30Days / totalUser) * 100).toFixed(1)
      ));

  console.log(totalUser, newUsersInLast30Days, newUsersPercentOfTotal);
  return {
    totalUser,
    newUsersInLast30Days,
    newUsersPercentOfTotal,
  };
};
