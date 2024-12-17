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
exports.ReviewsControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const reviews_services_1 = require("./reviews.services");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../../helpers/pick"));
const reviewFilterableFields = [
    "rating",
    "user.name",
    "createdAt",
    "product.name",
    "searchTerm",
];
const submitReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, rating, comment } = req.body;
    const userEmail = req.user.email;
    const review = yield reviews_services_1.ReviewsServices.createReview({
        productId,
        userEmail,
        rating,
        comment,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Review created successfully.",
        data: review,
    });
}));
const getReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, reviewFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield reviews_services_1.ReviewsServices.getReviewsFromDB(filters, options);
    // console.log(result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Reviews fetched successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedReview = yield reviews_services_1.ReviewsServices.deleteReviewServiceFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Review deleted successfully!",
        data: deletedReview,
    });
}));
exports.ReviewsControllers = { submitReview, getReviews, deleteReview };
