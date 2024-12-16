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
exports.CouponsControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const coupons_services_1 = require("./coupons.services");
// Controller to create a coupon
const createCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupons_services_1.CouponsServices.createCouponInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Coupon created successfully!",
        data: coupon,
    });
}));
// Controller to get a coupon by ID
const getCouponById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupons_services_1.CouponsServices.getCouponByIdFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Coupon retrieved successfully",
        data: coupon,
    });
}));
// Controller to fetch all coupons
const getAllCoupons = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield coupons_services_1.CouponsServices.getAllCouponsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All coupons fetched successfully",
        data: coupons,
    });
}));
// Controller to update a coupon
const updateCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const coupon = yield coupons_services_1.CouponsServices.updateCouponInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Coupon updated successfully",
        data: coupon,
    });
}));
// Controller to delete a coupon
const deleteCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield coupons_services_1.CouponsServices.deleteCouponInDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Coupon deleted successfully",
    });
}));
const applyCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    const discount = yield coupons_services_1.CouponsServices.applyCouponIntoDB(code);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Coupon applied successfully",
        data: { discount },
    });
}));
exports.CouponsControllers = {
    getAllCoupons,
    createCoupon,
    getCouponById,
    deleteCoupon,
    updateCoupon,
    applyCoupon,
};
