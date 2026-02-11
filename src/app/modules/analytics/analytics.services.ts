import prisma from "../../../shared/prisma";
import { newShops } from "./helpers/newShops";
import { getOrdersKPI } from "./helpers/orderAnalyticsKpi";
import {
  normalizeForRadarChart,
  prepareShopRadarData,
} from "./helpers/prepareShopPerformanceData";
import { getRevenueKPI } from "./helpers/revenueAnalyticsKpi";
import { getShopStatsKPI } from "./helpers/shopAnalyticsKpi";
import { topCategorySales } from "./helpers/topCategorySales";
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

const getAdminDashboardUserGrowthDataFromDB = async (year: number) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  const users = await prisma.user.findMany({
    where: {
      createdAt: { gte: startOfYear, lte: endOfYear },
    },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const usersByMonth: Record<string, number> = {};

  months.forEach((month) => {
    usersByMonth[month] = 0;
  });

  users.forEach((user) => {
    const findMonth = months[new Date(user.createdAt).getMonth()];

    usersByMonth[findMonth]++;
  });
  // console.log(usersByMonth);
  const data = {
    labels: months,
    data: months.map((month) => usersByMonth[month]),
  };
  // console.log(year);
  return data;
};

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
  // console.log(labels, data);

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

  const backgroundColors = [
    "#60A5FA", // medium blue
    "#34D399", // medium green
    "#FBBF24", // medium amber
    "#A78BFA", // medium purple
    "#F472B6", // medium pink
    "#2DD4BF", // medium teal
    "#FB923C", // medium orange
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

const getAdminDashboardPlatformInsightDataFromDB = async (period = 7) => {
  const givenDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

  const topCategory = await topCategorySales(givenDate);

  const shops = await newShops(givenDate);

  return { topCategory, shops };
};

const getAdminDashboardRecentOrdersDataFromDB = async () => {
  const lastSevenDays = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);

  const recentOrders = await prisma.order.findMany({
    where: { createdAt: { gte: lastSevenDays } },
    orderBy: { createdAt: "desc" },
  });
  console.log(recentOrders, "recent orders", lastSevenDays);
  return recentOrders;
};

const getAdminDashboardRecentReviewsDataFromDB = async () => {
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const recentReviews = await prisma.review.findMany({
    where: { createdAt: { gte: lastMonth } },
    orderBy: { createdAt: "desc" },
  });
  console.log(recentReviews, "recent reviews", lastMonth);
  return recentReviews;
};

export const AnalyticsServices = {
  getAdminDashboardKPIDataFromDB,
  getAdminDashboardUserGrowthDataFromDB,
  getAdminDashboardSalesTrendDataFromDB,
  getAdminDashboardShopPerformanceDataFromDB,
  getAdminDashboardCategoryDistributionDataFromDB,
  getAdminDashboardPlatformInsightDataFromDB,
  getAdminDashboardRecentOrdersDataFromDB,
  getAdminDashboardRecentReviewsDataFromDB,
};
