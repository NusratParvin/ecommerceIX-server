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
  // auth(UserRole.ADMIN),
  AnalyticsControllers.getAdminDashboardSalesTrendData,
);

export const AnalyticsRoutes = router;
