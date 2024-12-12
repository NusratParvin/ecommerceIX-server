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
    let imageUrl = payload.imageUrl;
    const file = req.file;
    // console.log(file);
    if (file != null) {
        const uploadToCloudinary = yield uploadImageToCloudinary_1.fileUploader.uploadImageToCloudinary(file);
        imageUrl = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    // Prepare product data
    const productInfo = Object.assign(Object.assign({}, payload), { imageUrl });
    console.log(productInfo);
    // Create product in the database
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
const updateProductIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const productExists = yield prisma_1.default.product.findUnique({
        where: { id: id },
    });
    console.log(productExists);
    if (!productExists) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid Shop ID.");
    }
    let imageUrl = payload.imageUrl;
    const file = req.file;
    if (file != null) {
        const uploadToCloudinary = yield uploadImageToCloudinary_1.fileUploader.uploadImageToCloudinary(file);
        imageUrl = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    // Prepare product data
    const productInfo = Object.assign(Object.assign({}, payload), { imageUrl });
    console.log(productInfo);
    return yield prisma_1.default.product.update({
        where: { id },
        data: productInfo,
    });
});
const updateProductStatusIntoDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(object);
    return prisma_1.default.product.update({
        where: { id },
        data: { status },
    });
});
const deleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.product.update({
        where: { id },
        data: { isDeleted: true },
    });
});
// const getAllProductsFromDB = async (
//   filters: Record<string, any>,
//   options: {
//     page?: number;
//     limit?: number;
//     sortBy?: string;
//     sortOrder?: string;
//   }
// ) => {
//   const { page, limit, skip, sortBy, sortOrder } =
//     pagination.calculatePagination(options);
//   // console.log("first");
//   const where: any = {
//     isDeleted: false,
//     status: "ACTIVE",
//     stock: { gt: 0 },
//   };
//   // Add search term filtering if applicable
//   if (filters.searchTerm) {
//     where.name = { contains: filters.searchTerm, mode: "insensitive" };
//   }
//   // Add other filters dynamically if necessary
//   if (filters.minPrice) {
//     where.price = { gte: filters.minPrice };
//   }
//   if (filters.maxPrice) {
//     where.price = { ...(where.price || {}), lte: filters.maxPrice };
//   }
//   if (filters.category) {
//     where.categoryId = filters.category;
//   }
//   if (filters.searchTerm) {
//     where.name = { contains: filters.searchTerm, mode: "insensitive" };
//   }
//   // Fetch data and total count
//   const [data, total] = await Promise.all([
//     prisma.product.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy: { [sortBy || "createdAt"]: sortOrder || "asc" },
//       include: {
//         shop: true,
//         category: true,
//       },
//     }),
//     prisma.product.count({
//       where: where,
//     }),
//   ]);
//   return {
//     meta: {
//       total,
//       page,
//       limit,
//     },
//     data,
//   };
// };
const getAllProductsFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    // Calculate pagination details
    const { page, limit, skip } = pagination_1.pagination.calculatePagination(options);
    console.log("Filters received:", filters);
    // Define base `where` clause for Prisma
    const where = {
        isDeleted: false,
        status: "ACTIVE",
        stock: { gt: 0 },
    };
    // Apply search filter
    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
        ];
    }
    // Apply category filter
    if (filters.category) {
        where.categoryId = filters.category;
    }
    // Apply shop filter
    if (filters.shop) {
        where.shopId = filters.shop;
    }
    // Apply price range filter
    if (filters.minPrice !== null || filters.maxPrice !== null) {
        where.price = {};
        if (filters.minPrice !== null)
            where.price.gte = filters.minPrice;
        if (filters.maxPrice !== null)
            where.price.lte = filters.maxPrice;
    }
    console.log("Final Prisma `where` clause:", where);
    try {
        // Fetch products and total count in parallel
        const [data, total] = yield Promise.all([
            prisma_1.default.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [options.sortBy || "createdAt"]: options.sortOrder || "desc",
                },
                include: {
                    shop: true,
                    category: true,
                    OrderItem: true,
                    reviews: true,
                },
            }),
            prisma_1.default.product.count({ where }),
        ]);
        const hasNextPage = skip + data.length < total;
        console.log("Total products:", total, "Has next page:", hasNextPage);
        return {
            meta: {
                total,
                page,
                limit,
                hasNextPage,
            },
            data,
        };
    }
    catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products from the database");
    }
});
const getAllProductsForAdminFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options);
    const where = {};
    if (filters.searchTerm) {
        where.name = { contains: filters.searchTerm, mode: "insensitive" };
    }
    const [data, total] = yield Promise.all([
        prisma_1.default.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy || "createdAt"]: sortOrder || "asc" },
            include: {
                shop: true,
                category: true,
                OrderItem: true,
                reviews: true,
            },
        }),
        prisma_1.default.product.count({ where: where }),
    ]);
    return {
        meta: { total, page, limit },
        data,
    };
});
const getAllProductsForVendorFromDB = (filters, options, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options);
    const shop = yield prisma_1.default.shop.findFirst({
        where: {
            ownerId: id,
        },
    });
    const where = {};
    if (filters.searchTerm) {
        where.name = { contains: filters.searchTerm, mode: "insensitive" };
    }
    // Add shopId filter if provided
    if (filters.shopId) {
        where.shopId = filters.shopId;
    }
    // Add shop status filter if provided
    // if (filters.shopStatus) {
    //   where.shop = { status: ShopStatus.ACTIVE };
    // }
    // console.log("hit");
    const [data, total] = yield Promise.all([
        prisma_1.default.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy || "createdAt"]: sortOrder || "asc" },
            include: {
                shop: true,
                category: true,
                OrderItem: true,
                reviews: true,
            },
        }),
        prisma_1.default.product.count({ where: where }),
    ]);
    return {
        meta: { total, page, limit },
        data,
    };
});
exports.ProductServices = {
    createProductIntoDB,
    getProductByIdFromDB,
    updateProductIntoDB,
    updateProductStatusIntoDB,
    deleteProductFromDB,
    getAllProductsFromDB,
    getAllProductsForAdminFromDB,
    getAllProductsForVendorFromDB,
};
