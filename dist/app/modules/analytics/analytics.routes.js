"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const analytics_controllers_1 = require("./analytics.controllers");
const router = express_1.default.Router();
router.get("/dashboard", (0, auth_1.default)(client_1.UserRole.ADMIN), analytics_controllers_1.AnalyticsControllers.getAdminDashboardKPIData);
router.get("/dashboard/user-growth", 
// auth(UserRole.ADMIN),
analytics_controllers_1.AnalyticsControllers.getAdminDashboardUserGrowthData);
router.get("/dashboard/sales-trend", (0, auth_1.default)(client_1.UserRole.ADMIN), analytics_controllers_1.AnalyticsControllers.getAdminDashboardSalesTrendData);
router.get("/dashboard/shop-performance", (0, auth_1.default)(client_1.UserRole.ADMIN), analytics_controllers_1.AnalyticsControllers.getAdminDashboardShopPerformanceData);
router.get("/dashboard/category-distribution", (0, auth_1.default)(client_1.UserRole.ADMIN), analytics_controllers_1.AnalyticsControllers.getAdminDashboardCategoryDistributionData);
router.get("/dashboard/platform-insights", (0, auth_1.default)(client_1.UserRole.ADMIN), analytics_controllers_1.AnalyticsControllers.getAdminDashboardPlatformInsightData);
router.get("/dashboard/recent-orders", (0, auth_1.default)(client_1.UserRole.ADMIN), analytics_controllers_1.AnalyticsControllers.getAdminDashboardRecentOrdersData);
router.get("/dashboard/recent-reviews", (0, auth_1.default)(client_1.UserRole.ADMIN), analytics_controllers_1.AnalyticsControllers.getAdminDashboardRecentReviewsData);
exports.AnalyticsRoutes = router;
