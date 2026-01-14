import prisma from "../../../shared/prisma";
import { getShopStatsKPI } from "./helpers/shopAnalyticsKpi";
import { getUserStatsKPI } from "./helpers/userAnalyticsKpi";

const getAdminDashboardDataFromDB = async () => {
  const userStats = await getUserStatsKPI();
  const shopStats = await getShopStatsKPI();

  return { userStats: userStats, shopStats: shopStats };
};
export const AnalyticsServices = {
  getAdminDashboardDataFromDB,
};
