import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReviewsServices } from "./reviews.services";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const submitReview = catchAsync(async (req: Request, res: Response) => {
  const { productId, rating, comment } = req.body;
  const userEmail = req.user.email;
  const review = await ReviewsServices.createReview({
    productId,
    userEmail,
    rating,
    comment,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review created successfully.",
    data: review,
  });
});

export const ReviewsControllers = { submitReview };
