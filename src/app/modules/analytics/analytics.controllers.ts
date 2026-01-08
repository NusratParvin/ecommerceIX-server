import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";

const getAdminDashboardData = catchAsync(
  async (req: Request, res: Response) => {}
);

export const AnalyticsControllers = {
  getAdminDashboardData,
};
