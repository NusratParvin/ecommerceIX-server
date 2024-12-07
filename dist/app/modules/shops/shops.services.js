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
exports.ShopServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = require("http-status-codes");
const apiErrors_1 = __importDefault(require("../../errors/apiErrors"));
const client_1 = require("@prisma/client");
const uploadImageToCloudinary_1 = require("../../../helpers/uploadImageToCloudinary");
const pagination_1 = require("../../../helpers/pagination");
const getShopByOwnerFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isOwner = yield prisma_1.default.user.findFirst({
        where: {
            email,
            status: client_1.ActiveStatus.ACTIVE,
        },
    });
    if (!isOwner) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No Vendor Found");
    }
    // const result = await prisma.shop.findFirst({
    //   where: {
    //     ownerId: isOwner.id,
    //   },
    // });
    const result = yield prisma_1.default.shop.findFirst({
        where: {
            ownerId: isOwner.id,
        },
        include: {
            _count: {
                select: { products: true }, // Include product count
            },
        },
    });
    // console.log(result, "prod");
    return Object.assign(Object.assign({}, result), { productCount: result === null || result === void 0 ? void 0 : result._count.products });
});
const createShopIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    // Validate the owner based on the email
    const owner = yield prisma_1.default.user.findUnique({
        where: {
            email: req.body.email,
        },
    });
    if (!owner) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User not authenticated.");
    }
    // Extract the owner ID
    const ownerId = owner.id;
    const isShop = yield prisma_1.default.shop.findFirst({ where: { ownerId } });
    if (isShop)
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You Are not permitted to open more than one shop");
    // Handle file upload (if provided)
    let logo = null;
    const file = req.file;
    if (file) {
        const uploadResult = yield uploadImageToCloudinary_1.fileUploader.uploadImageToCloudinary(file);
        logo = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    // Prepare shop data for creation
    const shopData = {
        name,
        description,
        logo,
        ownerId,
    };
    // console.log("Shop data to be created:", shopData);
    // Create the shop in the database
    const result = yield prisma_1.default.shop.create({
        data: shopData,
    });
    // console.log("Created shop:", result);
    return result;
});
const getAllShopsFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options);
    const where = {};
    if (filters.searchTerm) {
        where.name = { contains: filters.searchTerm, mode: "insensitive" };
    }
    if (filters.status) {
        where.status = filters.status; // Filtering by status if provided
    }
    if (filters.ownerId) {
        where.ownerId = filters.ownerId; // Filtering by owner ID if provided
    }
    const shops = yield prisma_1.default.shop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            owner: {
                select: { id: true, name: true, email: true }, // Include owner details if needed
            },
        },
    });
    // Count total records for meta
    const totalRecords = yield prisma_1.default.shop.count({ where });
    return {
        meta: {
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
        },
        data: shops,
    };
});
const updateShopIntoDB = (shopId, data, file) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the existing shop by ID
    const existingShop = yield prisma_1.default.shop.findUnique({
        where: { id: shopId },
    });
    if (!existingShop) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Shop not found.");
    }
    // Handle file upload if a new logo is provided
    let logo = existingShop.logo; // Default to existing logo
    if (file) {
        const uploadResult = yield uploadImageToCloudinary_1.fileUploader.uploadImageToCloudinary(file);
        logo = (uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url) || null; // Ensure `null` if undefined
    }
    // Prepare updated shop data
    const updatedShopData = Object.assign(Object.assign({}, data), (logo !== null && { logo }));
    // Update the shop in the database
    const updatedShop = yield prisma_1.default.shop.update({
        where: { id: shopId },
        data: updatedShopData,
    });
    return updatedShop;
});
exports.ShopServices = {
    createShopIntoDB,
    updateShopIntoDB,
    getAllShopsFromDB,
    getShopByOwnerFromDB,
};
