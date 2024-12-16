"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = require("http-status-codes");
const apiErrors_1 = __importDefault(require("../../errors/apiErrors"));
// Service to create a coupon
const createCouponInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, discountAmount, expirationDate } = data;
        const result = yield prisma_1.default.coupon.create({
            data: {
                code,
                discountAmount,
                expirationDate,
            },
        });
        console.log(result);
        return result;
    }
    catch (error) {
        console.error("Error creating coupon:", error);
        // Optionally, rethrow the error or handle it as needed
        throw error;
    }
});
// Service to get a coupon by ID
const getCouponByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: { id },
    });
    if (!coupon) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Coupon not found");
    }
    return coupon;
});
// Service to fetch all coupons
const getAllCouponsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.coupon.findMany({});
});
// Service to update a coupon
const updateCouponInDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, discountAmount, expirationDate } = data;
    // Ensure the expirationDate is in full ISO-8601 format
    const isoExpirationDate = new Date(expirationDate + "T00:00:00Z").toISOString();
    try {
        const result = yield prisma_1.default.coupon.update({
            where: { id },
            data: {
                code,
                discountAmount,
                expirationDate: isoExpirationDate,
            },
        });
        console.log("Updated coupon:", result);
        return result;
    }
    catch (error) {
        console.error("Error updating coupon:", error);
        throw error;
    }
});
// Service to delete a coupon
const deleteCouponInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.coupon.delete({
            where: { id },
        });
    }
    catch (error) {
        console.error("Error deleting coupon:", error);
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error deleting coupon");
    }
});
const applyCouponIntoDB = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: { code },
        // select: { discountAmount: true, expirationDate: true },
    });
    if (!coupon)
        throw new Error("Coupon not found");
    if (new Date() > coupon.expirationDate)
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Coupon has expired");
    return coupon;
});
exports.CouponsServices = {
    getAllCouponsFromDB,
    getCouponByIdFromDB,
    createCouponInDB,
    deleteCouponInDB,
    updateCouponInDB,
    applyCouponIntoDB,
};
