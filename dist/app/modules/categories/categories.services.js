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
exports.CategoriesServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const apiErrors_1 = __importDefault(require("../../errors/apiErrors"));
const pagination_1 = require("../../../helpers/pagination");
const uploadImageToCloudinary_1 = require("../../../helpers/uploadImageToCloudinary");
const createCategoryIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    // console.log(payload);
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield uploadImageToCloudinary_1.fileUploader.uploadImageToCloudinary(file);
        payload.imageUrl = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const productInfo = Object.assign(Object.assign({}, payload), { imageUrl: payload.imageUrl });
    return yield prisma_1.default.category.create({
        data: productInfo,
    });
});
const getCategoriesFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options || {});
    const where = {};
    if (filters.searchTerm) {
        where.name = { contains: filters.searchTerm, mode: "insensitive" };
    }
    const categories = yield prisma_1.default.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            products: true,
        },
    });
    // Count total records for meta
    const totalRecords = yield prisma_1.default.category.count({ where });
    return {
        meta: {
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
        },
        data: categories,
    };
});
const getCategoriesForAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        include: {
            products: true,
        },
    });
    return categories;
});
const updateCategoryIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.name) {
        const existingCategory = yield prisma_1.default.category.findFirst({
            where: { name: data.name, NOT: { id } },
        });
        if (existingCategory) {
            throw new apiErrors_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Category name '${data.name}' already exists.`);
        }
    }
    // Update the category
    const res = yield prisma_1.default.category.update({
        where: { id },
        data,
    });
    // console.log(res);
    return res;
});
const deleteCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.category.update({
        where: { id },
        data: { isDeleted: true },
    });
});
exports.CategoriesServices = {
    getCategoriesFromDB,
    getCategoriesForAllFromDB,
    createCategoryIntoDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB,
};
