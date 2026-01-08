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
exports.OrdersControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const orders_services_1 = require("./orders.services");
const pick_1 = __importDefault(require("../../../helpers/pick"));
const orderFilterableFields = ["shopId", "userId", "searchTerm"];
const paginationFields = ["limit", "page", "sortBy", "sortOrder"];
//   const { userId, items, totalPrice, shippingInfo, paymentIntentId } = req.body;
//   const order = await OrderServices.createOrder(
//     userId,
//     items,
//     totalPrice,
//     shippingInfo,
//     paymentIntentId
//   );
//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     success: true,
//     message: "Order created successfully",
//     data: order,
//   });
// });
const processOrderPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, shopId, items, totalPrice, couponId, shippingInfo, paymentIntentId, } = req.body;
    const result = yield orders_services_1.OrdersServices.processOrderAndPaymentIntoDB(userId, shopId, items, totalPrice, couponId, shippingInfo, paymentIntentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Order and payment processed successfully",
        data: result,
    });
}));
// Get all orders (Admin view)
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("object");
    const filters = (0, pick_1.default)(req.query, orderFilterableFields);
    const options = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
        sortOrder: req.query.sortOrder ? String(req.query.sortOrder) : "desc",
    };
    console.log(filters);
    const result = yield orders_services_1.OrdersServices.getAllOrdersFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All orders retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
// Get orders by shop (for vendors)
const getOrdersByShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    console.log(email);
    // const filters = pick(req.query, orderFilterableFields);
    const filters = (0, pick_1.default)(req.query, ["shopId", "orderId", "searchTerm"]);
    const options = (0, pick_1.default)(req.query, paginationFields);
    const result = yield orders_services_1.OrdersServices.getOrdersByShopFromDB(filters, options, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Orders retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
//details of shop order by id
const getShopOrderDetailsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const userEmail = req.user.email;
    const orderDetails = yield orders_services_1.OrdersServices.getShopOrderDetailsById(orderId, userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Order details retrieved successfully.",
        data: orderDetails,
    });
}));
const getOrdersByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.user.email;
    const filters = (0, pick_1.default)(req.query, orderFilterableFields);
    const options = (0, pick_1.default)(req.query, paginationFields);
    const result = yield orders_services_1.OrdersServices.getOrdersByUserFromDB(filters, options, userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User purchase history retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const getUserOrderDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const userEmail = req.user.email;
    const orderDetails = yield orders_services_1.OrdersServices.getUserOrderDetailsByIdFromDB(orderId, userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Order details retrieved successfully!",
        data: orderDetails,
    });
}));
exports.OrdersControllers = {
    getAllOrders,
    getOrdersByShop,
    getOrdersByUser,
    getShopOrderDetailsById,
    processOrderPayment,
    getUserOrderDetails,
};
