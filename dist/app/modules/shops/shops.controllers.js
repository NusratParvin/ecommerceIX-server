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
exports.ShopControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../helpers/pick"));
const shops_services_1 = require("./shops.services");
const createShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shops_services_1.ShopServices.createShopIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Shop created successfully!",
        data: shop,
    });
}));
const getMyShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // console.log(user);
    const shop = yield shops_services_1.ShopServices.getShopByOwnerFromDB(user.email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shop retrieved successfully",
        data: shop,
    });
}));
const getAllShops = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ["searchTerm", "status", "ownerId"]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield shops_services_1.ShopServices.getAllShopsFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shops fetched successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const updateShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.params; // Get shopId from the route parameters
    const data = req.body; // Get update payload from the request body
    const file = req.file; // Get file if provided
    const updatedShop = yield shops_services_1.ShopServices.updateShopIntoDB(shopId, data, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shop updated successfully!",
        data: updatedShop,
    });
}));
exports.ShopControllers = {
    createShop,
    getAllShops,
    getMyShop,
    updateShop,
};
