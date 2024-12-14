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
exports.ProductControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../helpers/pick"));
const products_services_1 = require("./products.services");
const productFilterableFields = [
    "name",
    "categoryId",
    "shopId",
    "isFlashSale",
    "searchTerm",
];
const paginationFields = ["limit", "page", "sortBy", "sortOrder"];
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // // console.log("object");
    // const file = req.file;
    // const payload = req.body;
    const result = yield products_services_1.ProductServices.createProductIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Product created successfully!",
        data: result,
    });
}));
const getProductById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield products_services_1.ProductServices.getProductByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product retrieved successfully!",
        data: result,
    });
}));
const getProductsByCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const result = yield products_services_1.ProductServices.getProductsByCategoryIdFromDB(categoryId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Products retrieved successfully!",
        data: result,
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // console.log(id, "jhsdjhkjfhjk");
    const result = yield products_services_1.ProductServices.updateProductIntoDB(id, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product updated successfully!",
        data: result,
    });
}));
const updateProductStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    // console.log(id, status, "hhfghfghfg");
    const result = yield products_services_1.ProductServices.updateProductStatusIntoDB(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product updated successfully!",
        data: result,
    });
}));
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield products_services_1.ProductServices.deleteProductFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product deleted successfully!",
        data: result,
    });
}));
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : null,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : null,
        rating: req.query.rating ? Number(req.query.rating) : null,
        category: req.query.category === "null" ? null : req.query.category,
        shop: req.query.shop === "null" ? null : req.query.shop,
        search: req.query.search ? String(req.query.search) : "",
    };
    const options = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 8,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
        sortOrder: req.query.sortOrder ? String(req.query.sortOrder) : "desc",
    };
    console.log("Filters:", filters);
    console.log("Options:", options);
    const result = yield products_services_1.ProductServices.getAllProductsFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Products retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const getAllProductsForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, productFilterableFields);
    const options = (0, pick_1.default)(req.query, paginationFields);
    const result = yield products_services_1.ProductServices.getAllProductsForAdminFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Products retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const getAllProductsForVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    console.log(email);
    const filters = (0, pick_1.default)(req.query, productFilterableFields);
    const options = (0, pick_1.default)(req.query, paginationFields);
    const result = yield products_services_1.ProductServices.getAllProductsForVendorFromDB(filters, options, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Products retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const getFlashSaleProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("in flash");
    const filters = {
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : null,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : null,
        category: req.query.category === "null" ? null : req.query.category,
        shop: req.query.shop === "null" ? null : req.query.shop,
        search: req.query.search ? String(req.query.search) : "",
    };
    const options = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 8,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
        sortOrder: req.query.sortOrder ? String(req.query.sortOrder) : "desc",
    };
    console.log("Filters flash:", filters);
    console.log("Options:", options);
    const result = yield products_services_1.ProductServices.getFlashSaleProductsFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Flash sale Products retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
exports.ProductControllers = {
    getAllProducts,
    getFlashSaleProducts,
    createProduct,
    getProductById,
    getProductsByCategory,
    getAllProductsForAdmin,
    getAllProductsForVendor,
    updateProduct,
    updateProductStatus,
    deleteProduct,
};
