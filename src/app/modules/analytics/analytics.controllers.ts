import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AnalyticsServices } from "./analytics.services";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAdminDashboardData = catchAsync(
  async (req: Request, res: Response) => {
    const getData = await AnalyticsServices.getAdminDashboardDataFromDB();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "completed",
      data: getData,
    });
  }
);

export const AnalyticsControllers = {
  getAdminDashboardData,
};
