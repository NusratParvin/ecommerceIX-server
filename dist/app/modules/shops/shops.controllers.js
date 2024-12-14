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
    console.log(user);
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
const getAllShopsForAll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shops_services_1.ShopServices.getAllShopsForAllFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shops fetched successfully!",
        data: result,
    });
}));
const updateShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.params;
    const data = req.body;
    // const data = req.body;
    const file = req.file;
    console.log(data, file, "con");
    const updatedShop = yield shops_services_1.ShopServices.updateShopIntoDB(shopId, data, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shop updated successfully!",
        data: updatedShop,
    });
}));
const updateShopStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const updatedShop = yield shops_services_1.ShopServices.updateShopStatusIntoDB(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Shop status updated to ${status}`,
        data: updatedShop,
    });
}));
const fetchFollowedShops = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    // console.log(userEmail);
    if (!userEmail) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    const followedShops = yield shops_services_1.ShopServices.getFollowedShops(userEmail);
    return (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Followed shops fetched successfully",
        data: { followedShops },
    });
}));
const followShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.user.email;
    const { shopId } = req.params;
    const result = yield shops_services_1.ShopServices.followShopIntoDB(userEmail, shopId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shop followed successfully!",
        data: result,
    });
}));
const unfollowShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.params;
    const { userEmail } = req.user.email;
    const result = yield shops_services_1.ShopServices.unfollowShopIntoDB(userEmail, shopId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shop unfollowed successfully!",
        data: result,
    });
}));
const getShopDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.params;
    const result = yield shops_services_1.ShopServices.getShopDetailsFromDB(shopId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shop details retrieved successfully!",
        data: result,
    });
}));
exports.ShopControllers = {
    createShop,
    getAllShops,
    getAllShopsForAll,
    getMyShop,
    updateShop,
    updateShopStatus,
    fetchFollowedShops,
    getShopDetails,
    followShop,
    unfollowShop,
};
