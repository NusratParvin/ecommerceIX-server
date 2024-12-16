import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/apiErrors";

interface CreateReviewParams {
  productId: string;
  userEmail: string;
  rating: number;
  comment?: string;
}

const createReview = async ({
  productId,
  userEmail,
  rating,
  comment,
}: CreateReviewParams) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  const review = await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      rating,
      comment,
    },
  });
  console.log(review);
  return review;
};

export const ReviewsServices = { createReview };
