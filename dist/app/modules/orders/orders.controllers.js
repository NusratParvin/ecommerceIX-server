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
// const createOrder = catchAsync(async (req, res) => {
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
const getOrderDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield orders_services_1.OrderServices.getOrderDetailsFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Order details retrieved successfully",
        data: order,
    });
}));
const processOrderPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, shopId, items, totalPrice, couponId, shippingInfo, paymentIntentId, } = req.body;
    const result = yield orders_services_1.OrderServices.processOrderAndPaymentIntoDB(userId, shopId, items, totalPrice, couponId, shippingInfo, paymentIntentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Order and payment processed successfully",
        data: result,
    });
}));
exports.OrdersControllers = {
    getOrderDetails,
    // createOrder,
    processOrderPayment,
};
