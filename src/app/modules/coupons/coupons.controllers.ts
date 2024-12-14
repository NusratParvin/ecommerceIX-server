import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CouponsServices } from "./coupons.services";

// Controller to create a coupon
const createCoupon = catchAsync(async (req, res) => {
  const coupon = await CouponsServices.createCouponInDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Coupon created successfully!",
    data: coupon,
  });
});

// Controller to get a coupon by ID
const getCouponById = catchAsync(async (req, res) => {
  const coupon = await CouponsServices.getCouponByIdFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon retrieved successfully",
    data: coupon,
  });
});

// Controller to fetch all coupons
const getAllCoupons = catchAsync(async (req, res) => {
  const coupons = await CouponsServices.getAllCouponsFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All coupons fetched successfully",
    data: coupons,
  });
});

// Controller to update a coupon
const updateCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const coupon = await CouponsServices.updateCouponInDB(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon updated successfully",
    data: coupon,
  });
});

// Controller to delete a coupon
const deleteCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CouponsServices.deleteCouponInDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon deleted successfully",
  });
});

export const CouponsControllers = {
  getAllCoupons,
  createCoupon,
  getCouponById,
  deleteCoupon,
  updateCoupon,
};
