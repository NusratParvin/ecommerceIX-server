import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/apiErrors";
import { Coupon } from "@prisma/client";

// Service to create a coupon
const createCouponInDB = async (data: Coupon) => {
  try {
    const { code, discountAmount, expirationDate } = data;
    const result = await prisma.coupon.create({
      data: {
        code,
        discountAmount,
        expirationDate,
      },
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error creating coupon:", error);
    // Optionally, rethrow the error or handle it as needed
    throw error;
  }
};

// Service to get a coupon by ID
const getCouponByIdFromDB = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
  });
  if (!coupon) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Coupon not found");
  }
  return coupon;
};

// Service to fetch all coupons
const getAllCouponsFromDB = async () => {
  return await prisma.coupon.findMany({});
};

// Service to update a coupon
const updateCouponInDB = async (id: string, data: Partial<Coupon>) => {
  const { code, discountAmount, expirationDate } = data;

  // Ensure the expirationDate is in full ISO-8601 format
  const isoExpirationDate = new Date(
    expirationDate + "T00:00:00Z"
  ).toISOString();

  try {
    const result = await prisma.coupon.update({
      where: { id },
      data: {
        code,
        discountAmount,
        expirationDate: isoExpirationDate,
      },
    });
    console.log("Updated coupon:", result);
    return result;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

// Service to delete a coupon
const deleteCouponInDB = async (id: string) => {
  try {
    await prisma.coupon.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error deleting coupon"
    );
  }
};

const applyCouponIntoDB = async (code: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code },
    // select: { discountAmount: true, expirationDate: true },
  });

  if (!coupon) throw new Error("Coupon not found");
  if (new Date() > coupon.expirationDate)
    throw new ApiError(StatusCodes.BAD_REQUEST, "Coupon has expired");

  return coupon;
};

export const CouponsServices = {
  getAllCouponsFromDB,
  getCouponByIdFromDB,
  createCouponInDB,
  deleteCouponInDB,
  updateCouponInDB,
  applyCouponIntoDB,
};
