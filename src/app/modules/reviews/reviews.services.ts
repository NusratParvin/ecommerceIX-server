import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/apiErrors";
import { pagination } from "../../../helpers/pagination";

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

const getReviewsFromDB = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options || {});

  const where: any = {};

  if (filters.searchTerm) {
    where.OR = [
      { comment: { contains: filters.searchTerm, mode: "insensitive" } },
      { user: { name: { contains: filters.searchTerm, mode: "insensitive" } } },
      {
        product: {
          name: { contains: filters.searchTerm, mode: "insensitive" },
        },
      },
    ];
  }

  if (filters.rating) {
    where.rating = filters.rating;
  }

  if (filters.productId) {
    where.productId = filters.productId;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  const reviews = await prisma.review.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy || "createdAt"]: sortOrder || "desc" },
    include: {
      user: true,
      product: {
        include: {
          shop: true,
        },
      },
    },
  });

  const totalRecords = await prisma.review.count({ where });

  return {
    meta: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
    data: reviews,
  };
};

const deleteReviewServiceFromDB = async (reviewId: string) => {
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new Error("Review not found!");
  }

  const deletedReview = await prisma.review.update({
    where: { id: reviewId },
    data: { isDeleted: true },
  });

  return deletedReview;
};

export const ReviewsServices = {
  createReview,
  deleteReviewServiceFromDB,
  getReviewsFromDB,
};
