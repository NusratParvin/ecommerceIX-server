"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const newShops_1 = require("./helpers/newShops");
const orderAnalyticsKpi_1 = require("./helpers/orderAnalyticsKpi");
const prepareShopPerformanceData_1 = require("./helpers/prepareShopPerformanceData");
const revenueAnalyticsKpi_1 = require("./helpers/revenueAnalyticsKpi");
const shopAnalyticsKpi_1 = require("./helpers/shopAnalyticsKpi");
const topCategorySales_1 = require("./helpers/topCategorySales");
const userAnalyticsKpi_1 = require("./helpers/userAnalyticsKpi");
const getAdminDashboardKPIDataFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const userStats = yield (0, userAnalyticsKpi_1.getUserStatsKPI)();
    const shopStats = yield (0, shopAnalyticsKpi_1.getShopStatsKPI)();
    const orderStats = yield (0, orderAnalyticsKpi_1.getOrdersKPI)();
    const revenueStats = yield (0, revenueAnalyticsKpi_1.getRevenueKPI)();
    return {
        userStats: userStats,
        shopStats: shopStats,
        orderStats: orderStats,
        revenueStats: revenueStats,
    };
});
const getAdminDashboardUserGrowthDataFromDB = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    const users = yield prisma_1.default.user.findMany({
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
    const usersByMonth = {};
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
});
const getAdminDashboardSalesTrendDataFromDB = (monthParam, yearParam) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const year = yearParam ? Number(yearParam) : today.getFullYear();
    const month = monthParam ? Number(monthParam) - 1 : today.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const labels = [];
    const data = [];
    for (let day = 1; day <= endDate.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        labels.push(day.toString());
        const dayStart = new Date(year, month, day, 0, 0, 0, 0);
        const dayEnd = new Date(year, month, day, 23, 59, 59, 999);
        const daySales = yield prisma_1.default.transaction.aggregate({
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
});
const getAdminDashboardShopPerformanceDataFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const shopsData = yield prisma_1.default.shop.findMany({
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
    const normalizedData = (0, prepareShopPerformanceData_1.normalizeForRadarChart)(shopPerformance);
    const chartData = (0, prepareShopPerformanceData_1.prepareShopRadarData)(normalizedData);
    return chartData;
});
const getAdminDashboardCategoryDistributionDataFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
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
    const labels = [];
    const data = [];
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
});
const getAdminDashboardPlatformInsightDataFromDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (period = 7) {
    const givenDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    const topCategory = yield (0, topCategorySales_1.topCategorySales)(givenDate);
    const shops = yield (0, newShops_1.newShops)(givenDate);
    return { topCategory, shops };
});
const getAdminDashboardRecentOrdersDataFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastSevenDays = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    const recentOrders = yield prisma_1.default.order.findMany({
        where: { createdAt: { gte: lastSevenDays } },
        orderBy: { createdAt: "desc" },
    });
    console.log(recentOrders, "recent orders", lastSevenDays);
    return recentOrders;
});
const getAdminDashboardRecentReviewsDataFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentReviews = yield prisma_1.default.review.findMany({
        where: { createdAt: { gte: lastMonth } },
        orderBy: { createdAt: "desc" },
    });
    console.log(recentReviews, "recent reviews", lastMonth);
    return recentReviews;
});
exports.AnalyticsServices = {
    getAdminDashboardKPIDataFromDB,
    getAdminDashboardUserGrowthDataFromDB,
    getAdminDashboardSalesTrendDataFromDB,
    getAdminDashboardShopPerformanceDataFromDB,
    getAdminDashboardCategoryDistributionDataFromDB,
    getAdminDashboardPlatformInsightDataFromDB,
    getAdminDashboardRecentOrdersDataFromDB,
    getAdminDashboardRecentReviewsDataFromDB,
};
