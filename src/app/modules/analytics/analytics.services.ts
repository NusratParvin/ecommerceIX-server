import catchAsync from "../../../shared/catchAsync";
import prisma from "../../../shared/prisma";
import { getOrdersKPI } from "./helpers/orderAnalyticsKpi";
import {
  normalizeForRadarChart,
  prepareShopRadarData,
} from "./helpers/prepareShopPerformanceData";
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

const getAdminDashboardShopPerformanceDataFromDB = async () => {
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const shopsData = await prisma.shop.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      logo: true,
      Order: {
        where: {
          paymentStatus: "PAID",
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          createdAt: true,
          items: {
            select: {
              price: true,
              quantity: true,
            },
          },
        },
      },

      products: {
        where: {
          isDeleted: false,
          status: "ACTIVE",
        },

        select: {
          id: true,
          name: true,
          rating: true,
        },
      },
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });

  const shopPerformance = shopsData.map((shop) => {
    //followers count for radar chart
    const followers = shop._count.followers;

    //product count for radar chart
    const productsCount = shop.products.length;

    //orders count for radar chart
    const ordersCount = shop.Order.length;

    //avg rating for radar chart
    const totalRating = shop.products.reduce((sum, product) => {
      return sum + (product.rating || 0);
    }, 0);
    const avgRating = productsCount > 0 ? totalRating / productsCount : 0;

    //total sales for radar chart
    const totalSales = shop.Order.reduce((sumOfOrder, order) => {
      const totalOrderSales = order.items.reduce((sumOfItems, item) => {
        return sumOfItems + item.price * item.quantity;
      }, 0);
      return sumOfOrder + totalOrderSales;
    }, 0);

    const result = {
      id: shop.id,
      name: shop.name,
      logo: shop.logo,
      metrics: {
        followers: followers,
        products: productsCount,
        orders: ordersCount,
        avgRating: avgRating,
        totalSales: totalSales,
      },
    };
    return result;
  });

  const normalizedData = normalizeForRadarChart(shopPerformance);

  const chartData = prepareShopRadarData(normalizedData);

  return chartData;
};

const getAdminDashboardCategoryDistributionDataFromDB = async () => {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
    include: {
      _count: {
        select: {
          products: {
            where: {
              isDeleted: false,
              status: "ACTIVE",
            },
          },
        },
      },
    },
    orderBy: {
      products: {
        _count: "desc",
      },
    },
  });

  const labels: string[] = [];
  const data: number[] = [];

  // Simple colors array
  const backgroundColors = [
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // amber
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#14B8A6", // teal
    "#F97316", // orange
  ];

  categories.forEach((category, index) => {
    labels.push(category.name);
    data.push(category._count.products);
  });

  return {
    labels,
    data,
    // Optional: include colors
    backgroundColor: backgroundColors.slice(0, labels.length),
  };
};

export const AnalyticsServices = {
  getAdminDashboardKPIDataFromDB,
  getAdminDashboardSalesTrendDataFromDB,
  getAdminDashboardShopPerformanceDataFromDB,
  getAdminDashboardCategoryDistributionDataFromDB,
};
