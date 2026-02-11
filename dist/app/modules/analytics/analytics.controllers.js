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
exports.AnalyticsControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const analytics_services_1 = require("./analytics.services");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const getAdminDashboardKPIData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getData = yield analytics_services_1.AnalyticsServices.getAdminDashboardKPIDataFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin dashboard KPI data fetched successfully",
        data: getData,
    });
}));
const getAdminDashboardUserGrowthData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const timePeriod = Number(req.query.year);
    const result = yield analytics_services_1.AnalyticsServices.getAdminDashboardUserGrowthDataFromDB(timePeriod);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User growth data fetched successfully",
        data: result,
    });
}));
const getAdminDashboardSalesTrendData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const month = req.query.month;
    const year = req.query.year;
    const result = yield analytics_services_1.AnalyticsServices.getAdminDashboardSalesTrendDataFromDB(month, year);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Sales trend data fetched successfully",
        data: result,
    });
}));
const getAdminDashboardShopPerformanceData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_services_1.AnalyticsServices.getAdminDashboardShopPerformanceDataFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shop performance data fetched successfully",
        data: result,
    });
}));
const getAdminDashboardCategoryDistributionData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_services_1.AnalyticsServices.getAdminDashboardCategoryDistributionDataFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category distribution data fetched successfully",
        data: result,
    });
}));
const getAdminDashboardPlatformInsightData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const period = Number(req.query.period);
    const result = yield analytics_services_1.AnalyticsServices.getAdminDashboardPlatformInsightDataFromDB(period);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Platform insight data fetched successfully",
        data: result,
    });
}));
const getAdminDashboardRecentOrdersData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_services_1.AnalyticsServices.getAdminDashboardRecentOrdersDataFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Recent Orders data fetched successfully",
        success: true,
        data: result,
    });
}));
const getAdminDashboardRecentReviewsData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_services_1.AnalyticsServices.getAdminDashboardRecentReviewsDataFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Recent Reviews data fetched successfully",
        success: true,
        data: result,
    });
}));
exports.AnalyticsControllers = {
    getAdminDashboardKPIData,
    getAdminDashboardUserGrowthData,
    getAdminDashboardSalesTrendData,
    getAdminDashboardShopPerformanceData,
    getAdminDashboardCategoryDistributionData,
    getAdminDashboardPlatformInsightData,
    getAdminDashboardRecentOrdersData,
    getAdminDashboardRecentReviewsData,
};
