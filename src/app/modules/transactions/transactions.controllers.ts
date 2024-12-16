import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../helpers/pick";
import { TransactionServices } from "./transactions.services";

const transactionFilterableFields = [
  "orderId",
  "paymentMethod",
  "paymentStatus",
  "userId",
  "type",
  "searchTerm",
];

const paginationFields = ["page", "limit", "sortBy", "sortOrder"];

const getAllTransactionsForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, transactionFilterableFields);
    const options = pick(req.query, paginationFields);

    const paginationOptions = {
      page: options.page ? Number(options.page) : 1,
      limit: options.limit ? Number(options.limit) : 10,
      sortBy: options.sortBy ? String(options.sortBy) : "createdAt",
      sortOrder: options.sortOrder ? String(options.sortOrder) : "desc",
    };

    const result = await TransactionServices.getAllTransactionsForAdminFromDB(
      filters,
      paginationOptions
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Transactions retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const TransactionControllers = {
  getAllTransactionsForAdmin,
};
