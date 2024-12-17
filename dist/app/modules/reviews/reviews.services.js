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
exports.ReviewsServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const apiErrors_1 = __importDefault(require("../../errors/apiErrors"));
const pagination_1 = require("../../../helpers/pagination");
const createReview = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, userEmail, rating, comment, }) {
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Find user
        const user = yield prisma.user.findUnique({
            where: { email: userEmail },
        });
        if (!user)
            throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        const review = yield prisma.review.create({
            data: {
                productId,
                userId: user.id,
                rating,
                comment,
            },
        });
        const aggregateRating = yield prisma.review.aggregate({
            where: { productId },
            _avg: {
                rating: true,
            },
        });
        const newAverageRating = aggregateRating._avg.rating || 0;
        yield prisma.product.update({
            where: { id: productId },
            data: {
                rating: newAverageRating,
            },
        });
        console.log("Review created and product rating updated:", review);
        return review;
    }));
});
const getReviewsFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options || {});
    const where = {};
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
    const reviews = yield prisma_1.default.review.findMany({
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
    const totalRecords = yield prisma_1.default.review.count({ where });
    return {
        meta: {
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
        },
        data: reviews,
    };
});
const deleteReviewServiceFromDB = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingReview = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!existingReview) {
        throw new Error("Review not found!");
    }
    const deletedReview = yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: { isDeleted: true },
    });
    return deletedReview;
});
exports.ReviewsServices = {
    createReview,
    deleteReviewServiceFromDB,
    getReviewsFromDB,
};
