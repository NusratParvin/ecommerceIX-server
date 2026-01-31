import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AnalyticsServices } from "./analytics.services";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAdminDashboardKPIData = catchAsync(
  async (req: Request, res: Response) => {
    const getData = await AnalyticsServices.getAdminDashboardKPIDataFromDB();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin dashboard KPI data fetched successfully",
      data: getData,
    });
  },
);

const getAdminDashboardSalesTrendData = catchAsync(
  async (req: Request, res: Response) => {
    const month = req.query.month as string;
    const year = req.query.year as string;
    const result =
      await AnalyticsServices.getAdminDashboardSalesTrendDataFromDB(
        month,
        year,
      );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Sales trend data fetched successfully",
      data: result,
    });
  },
);

const getAdminDashboardShopPerformanceData = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await AnalyticsServices.getAdminDashboardShopPerformanceDataFromDB();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Shop performance data fetched successfully",
      data: result,
    });
  },
);

const getAdminDashboardCategoryDistributionData = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await AnalyticsServices.getAdminDashboardCategoryDistributionDataFromDB();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Category distribution data fetched successfully",
      data: result,
    });
  },
);

const getAdminDashboardPlatformInsightData = catchAsync(
  async (req: Request, res: Response) => {
    const period = Number(req.query.period as string);
    const result =
      await AnalyticsServices.getAdminDashboardPlatformInsightDataFromDB(
        period,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Platform insight data fetched successfully",
      data: result,
    });
  },
);

export const AnalyticsControllers = {
  getAdminDashboardKPIData,
  getAdminDashboardSalesTrendData,
  getAdminDashboardShopPerformanceData,
  getAdminDashboardCategoryDistributionData,
  getAdminDashboardPlatformInsightData,
};
