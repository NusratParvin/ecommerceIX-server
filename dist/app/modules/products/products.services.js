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
            OrderItem: true,
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profilePhoto: true,
                        },
                    },
                },
            },
        },
    });
});
const getProductsByCategoryIdFromDB = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findMany({
        where: { categoryId },
        include: {
            shop: true,
            reviews: true,
        },
    });
    // console.log(result, categoryId, "categoryyyyyyyyyyy");
    return result;
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
//   const { page, limit, skip } = pagination.calculatePagination(options);
//   // console.log("Filters received:", filters);
//   const where: Record<string, any> = {
//     isDeleted: false,
//     status: "ACTIVE",
//     stock: { gt: 0 },
//   };
//   if (filters.search) {
//     where.OR = [
//       { name: { contains: filters.search, mode: "insensitive" } },
//       { description: { contains: filters.search, mode: "insensitive" } },
//     ];
//   }
//   if (filters.category) {
//     where.categoryId = filters.category;
//   }
//   if (filters.shop) {
//     where.shopId = filters.shop;
//   }
//   if (filters.minPrice !== null || filters.maxPrice !== null) {
//     where.price = {};
//     console.log("sabdsfnsmNasmnnmdnsfdmssbdamndbm");
//     if (filters.minPrice !== null) where.price.gte = filters.minPrice;
//     if (filters.maxPrice !== null) where.price.lte = filters.maxPrice;
//   }
//   if (filters.rating !== null) {
//     where.rating = {};
//     if (filters.rating !== null) where.rating.lte = filters.rating;
//   }
//   console.log("Final Prisma `where` clause:", where);
//   const [data, total] = await Promise.all([
//     prisma.product.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy: {
//         [options.sortBy || "createdAt"]: options.sortOrder || "desc",
//       },
//       include: {
//         shop: true,
//         category: true,
//         OrderItem: true,
//         reviews: true,
//       },
//     }),
//     prisma.product.count({ where }),
//   ]);
//   const hasNextPage = skip + data.length < total;
//   console.log("Total products:", total, "Has next page:", hasNextPage);
//   return {
//     meta: {
//       total,
//       page,
//       limit,
//       hasNextPage,
//     },
//     data,
//   };
// };
// const getAllProductsFromDB = async (
//   filters: Record<string, any>,
//   options: {
//     page?: number;
//     limit?: number;
//     sortBy?: string;
//     sortOrder?: string;
//   }
// ) => {
//   const { page = 1, limit = 8 } = options;
//   const skip = (page - 1) * limit;
//   const where: Record<string, any> = {
//     isDeleted: false,
//     status: "ACTIVE",
//     stock: { gt: 0 },
//   };
//   if (filters.search) {
//     where.OR = [
//       { name: { contains: filters.search, mode: "insensitive" } },
//       { description: { contains: filters.search, mode: "insensitive" } },
//     ];
//   }
//   if (filters.category) {
//     where.categoryId = filters.category;
//   }
//   if (filters.shop) {
//     where.shopId = filters.shop;
//   }
//   const products = await prisma.product.findMany({
//     where,
//     skip,
//     take: limit,
//     orderBy: {
//       [options.sortBy || "createdAt"]: options.sortOrder || "desc",
//     },
//   });
//   // Further filter products if necessary
//   const filteredProducts = products.filter((product) => {
//     const effectivePrice =
//       product.flashSalePrice ||
//       (product.discount
//         ? product.price * (1 - product.discount / 100)
//         : product.price);
//     return (
//       (!filters.minPrice || effectivePrice >= filters.minPrice) &&
//       (!filters.maxPrice || effectivePrice <= filters.maxPrice)
//     );
//   });
//   const total = await prisma.product.count({ where });
//   const hasNextPage = skip + limit < total;
//   return {
//     meta: {
//       total,
//       page,
//       limit,
//       hasNextPage,
//     },
//     data: filteredProducts,
//   };
// };
// const getAllProductsFromDB = async (
//   filters: Record<string, any>,
//   options: {
//     page?: number;
//     limit?: number;
//     sortBy?: string;
//     sortOrder?: string;
//   }
// ) => {
//   const { page, limit, skip } = pagination.calculatePagination(options);
//   // Simplified initial where clause
//   const where: Record<string, any> = {
//     isDeleted: false,
//     status: "ACTIVE",
//     stock: { gt: 0 },
//   };
//   // Include search filters
//   if (filters.search) {
//     where.OR = [
//       { name: { contains: filters.search, mode: "insensitive" } },
//       { description: { contains: filters.search, mode: "insensitive" } },
//     ];
//   }
//   if (filters.category) {
//     where.categoryId = filters.category;
//   }
//   if (filters.shop) {
//     where.shopId = filters.shop;
//   }
//   if (filters.rating) {
//     where.rating = { lte: filters.rating };
//   }
//    const products = await prisma.product.findMany({
//     where,
//     skip,
//     take: limit,
//     orderBy: {
//       [options.sortBy || "createdAt"]: options.sortOrder || "desc",
//     },
//     include: {
//       shop: true,
//       category: true,
//       OrderItem: true,
//       reviews: true,
//     },
//   });
//   // Further filter products based on complex price logic
//   const filteredProducts = products.filter((product) => {
//     const effectivePrice =
//       product.flashSalePrice ||
//       (product.discount
//         ? product.price * (1 - product.discount / 100)
//         : product.price);
//     return (
//       (!filters.minPrice || effectivePrice >= filters.minPrice) &&
//       (!filters.maxPrice || effectivePrice <= filters.maxPrice)
//     );
//   });
//   const total = filteredProducts.length;
//   const hasNextPage = skip + limit < total;
//   return {
//     meta: {
//       total,
//       page,
//       limit,
//       hasNextPage,
//     },
//     data: filteredProducts,
//   };
// };
const getAllProductsFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 8 } = options;
    const skip = (page - 1) * limit;
    const where = {
        isDeleted: false,
        status: "ACTIVE",
        stock: { gt: 0 },
    };
    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
        ];
    }
    if (filters.category) {
        where.categoryId = filters.category;
    }
    if (filters.shop) {
        where.shopId = filters.shop;
    }
    const products = yield prisma_1.default.product.findMany({
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
    });
    // Further filter products if necessary
    const filteredProducts = products.filter((product) => {
        const effectivePrice = product.flashSalePrice ||
            (product.discount
                ? product.price * (1 - product.discount / 100)
                : product.price);
        return ((!filters.minPrice || effectivePrice >= filters.minPrice) &&
            (!filters.maxPrice || effectivePrice <= filters.maxPrice));
    });
    const total = yield prisma_1.default.product.count({ where });
    const hasNextPage = skip + limit < total;
    return {
        meta: {
            total,
            page,
            limit,
            hasNextPage,
        },
        data: filteredProducts,
    };
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
const getAllProductsForVendorFromDB = (filters, options, email) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options);
    const user = yield prisma_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user)
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    const shop = yield prisma_1.default.shop.findFirst({
        where: {
            ownerId: user.id,
        },
    });
    if (!shop)
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Shop not found");
    console.log(email, shop);
    // const where: any = {};
    const where = {
        shopId: shop.id,
    };
    if (filters.searchTerm) {
        where.name = { contains: filters.searchTerm, mode: "insensitive" };
    }
    // Add shopId filter if provided
    // if (filters.shopId) {
    //   where.shopId = filters.shopId;
    // }
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
const getFlashSaleProductsFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options);
    const where = {
        isDeleted: false,
        status: "ACTIVE",
        stock: { gt: 0 },
        isFlashSale: true,
        flashSaleEndDate: { gte: new Date() },
    };
    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
        ];
    }
    if (filters.category) {
        where.categoryId = filters.category;
    }
    if (filters.shop) {
        where.shopId = filters.shop;
    }
    if (filters.maxPrice !== null) {
        where.flashSalePrice = { lte: filters.maxPrice };
    }
    console.log("Prisma `where` clause for fetch:", JSON.stringify(where, null, 2));
    const products = yield prisma_1.default.product.findMany({
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
    });
    const total = yield prisma_1.default.product.count({ where });
    const hasNextPage = skip + products.length < total;
    console.log("Total products:", total, "Current Fetch:", products.length, "Has next page:", hasNextPage);
    return {
        meta: {
            total,
            page,
            limit,
            hasNextPage,
        },
        data: products,
    };
});
exports.ProductServices = {
    createProductIntoDB,
    getProductByIdFromDB,
    getProductsByCategoryIdFromDB,
    updateProductIntoDB,
    updateProductStatusIntoDB,
    deleteProductFromDB,
    getAllProductsFromDB,
    getAllProductsForAdminFromDB,
    getAllProductsForVendorFromDB,
    getFlashSaleProductsFromDB,
};
