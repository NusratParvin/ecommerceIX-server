import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReviewsServices } from "./reviews.services";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../../helpers/pick";

const reviewFilterableFields = [
  "rating",
  "user.name",
  "createdAt",
  "product.name",
  "searchTerm",
];

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

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ReviewsServices.getReviewsFromDB(filters, options);
  // console.log(result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews fetched successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const deletedReview = await ReviewsServices.deleteReviewServiceFromDB(
    req.params.id
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review deleted successfully!",
    data: deletedReview,
  });
});

export const ReviewsControllers = { submitReview, getReviews, deleteReview };
