import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AnalyticsControllers } from "./analytics.controllers";

const router = express.Router();

router.get(
  "/dashboard",
  auth(UserRole.ADMIN),
  AnalyticsControllers.getAdminDashboardKPIData,
);

router.get(
  "/dashboard/sales-trend",
  auth(UserRole.ADMIN),
  AnalyticsControllers.getAdminDashboardSalesTrendData,
);

router.get(
  "/dashboard/shop-performance",
  auth(UserRole.ADMIN),
  AnalyticsControllers.getAdminDashboardShopPerformanceData,
);

router.get(
  "/dashboard/category-distribution",
  auth(UserRole.ADMIN),
  AnalyticsControllers.getAdminDashboardCategoryDistributionData,
);

router.get(
  "/dashboard/platform-insights",
  auth(UserRole.ADMIN),
  AnalyticsControllers.getAdminDashboardPlatformInsightData,
);

router.get(
  "/dashboard/recent-orders",
  auth(UserRole.ADMIN),
  AnalyticsControllers.getAdminDashboardRecentOrdersData,
);

router.get(
  "/dashboard/recent-reviews",
  auth(UserRole.ADMIN),
  AnalyticsControllers.getAdminDashboardRecentReviewsData,
);

export const AnalyticsRoutes = router;
