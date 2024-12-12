import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandlers = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("hit here");
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    status: err?.status || StatusCodes.NOT_FOUND,
    message: err?.message || "Something went wrong",
  });
};

export default globalErrorHandlers;
