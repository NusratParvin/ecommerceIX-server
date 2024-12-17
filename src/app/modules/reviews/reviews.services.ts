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
  return await prisma.$transaction(async (prisma) => {
    // Find user
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

    const aggregateRating = await prisma.review.aggregate({
      where: { productId },
      _avg: {
        rating: true,
      },
    });

    const newAverageRating = aggregateRating._avg.rating || 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: newAverageRating,
      },
    });

    console.log("Review created and product rating updated:", review);
    return review;
  });
};

export const ReviewsServices = { createReview };
