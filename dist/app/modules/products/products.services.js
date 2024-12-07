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
exports.ProductServices = void 0;
const pagination_1 = require("../../../helpers/pagination");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = require("http-status-codes");
const apiErrors_1 = __importDefault(require("../../errors/apiErrors"));
const uploadImageToCloudinary_1 = require("../../../helpers/uploadImageToCloudinary");
const createProductIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const shopExists = yield prisma_1.default.shop.findUnique({
        where: { id: payload.shopId },
    });
    if (!shopExists) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid Shop ID.");
    }
    const categoryExists = yield prisma_1.default.category.findUnique({
        where: { id: payload.categoryId },
    });
    if (!categoryExists) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid Category ID.");
    }
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield uploadImageToCloudinary_1.fileUploader.uploadImageToCloudinary(file);
        payload.imageUrl = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const productInfo = Object.assign(Object.assign({}, payload), { imageUrl: payload.imageUrl });
    // Create the product directly
    return yield prisma_1.default.product.create({
        data: productInfo,
    });
});
const getProductByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.product.findUnique({
        where: { id },
        include: {
            shop: true,
            category: true,
            reviews: true,
        },
    });
});
const updateProductIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    return yield prisma_1.default.product.update({
        where: { id },
        data,
    });
});
const deleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.product.update({
        where: { id },
        data: { isDeleted: true },
    });
});
const getAllProductsFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options);
    const whereClause = Object.assign({ isDeleted: false }, filters);
    const [data, total] = yield Promise.all([
        prisma_1.default.product.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma_1.default.product.count({ where: whereClause }),
    ]);
    return {
        meta: {
            total,
            page,
            limit,
        },
        data,
    };
});
exports.ProductServices = {
    createProductIntoDB,
    getProductByIdFromDB,
    updateProductIntoDB,
    deleteProductFromDB,
    getAllProductsFromDB,
};
