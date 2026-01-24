import prisma from "../../../shared/prisma";
import { getOrdersKPI } from "./helpers/orderAnalyticsKpi";
import { getRevenueKPI } from "./helpers/revenueAnalyticsKpi";
import { getShopStatsKPI } from "./helpers/shopAnalyticsKpi";
import { getUserStatsKPI } from "./helpers/userAnalyticsKpi";

const getAdminDashboardKPIDataFromDB = async () => {
  const userStats = await getUserStatsKPI();
  const shopStats = await getShopStatsKPI();
  const orderStats = await getOrdersKPI();
  const revenueStats = await getRevenueKPI();

  return {
    userStats: userStats,
    shopStats: shopStats,
    orderStats: orderStats,
    revenueStats: revenueStats,
  };
};

// const getAdminDashboardSalesTrendDataFromDB = async (
//   monthParam?: string,
//   yearParam?: string,
// ) => {
//   const today = new Date();

//   const year = yearParam ? Number(yearParam) : today.getFullYear();
//   const month = monthParam ? Number(monthParam) - 1 : today.getMonth();
//   console.log(month, year);
//   const startDate = new Date(year, month, 1);
//   const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

//   const transactionData = await prisma.transaction.groupBy({
//     by: "createdAt",
//     where: {
//       createdAt: {
//         gte: startDate,
//         lte: endDate,
//       },
//       paymentStatus: "PAID",
//     },
//     _sum: {
//       amount: true,
//     },
//     _count: {
//       id: true,
//     },
//     orderBy: {
//       createdAt: "asc",
//     },
//   });

//   const labels = transactionData.map((t) =>
//     t.createdAt.toISOString().slice(0, 10),
//   );
//   const data = transactionData.map((t) => t._sum.amount);

//   console.log(labels, data);
//   return { labels, data };
// };

const getAdminDashboardSalesTrendDataFromDB = async (
  monthParam?: string,
  yearParam?: string,
) => {
  const today = new Date();

  const year = yearParam ? Number(yearParam) : today.getFullYear();
  const month = monthParam ? Number(monthParam) - 1 : today.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const labels: string[] = [];
  const data: number[] = [];

  for (let day = 1; day <= endDate.getDate(); day++) {
    const currentDate = new Date(year, month, day);

    labels.push(day.toString());

    const dayStart = new Date(year, month, day, 0, 0, 0, 0);
    const dayEnd = new Date(year, month, day, 23, 59, 59, 999);

    const daySales = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: dayStart, lte: dayEnd },
        paymentStatus: "PAID",
      },
      _sum: { amount: true },
    });

    data.push(Number(daySales._sum.amount) || 0);
  }

  return { labels, data };
};

export const AnalyticsServices = {
  getAdminDashboardKPIDataFromDB,
  getAdminDashboardSalesTrendDataFromDB,
};
