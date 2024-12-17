"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const orders_controllers_1 = require("./orders.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
//  Get all orders
router.get("/all-orders", (0, auth_1.default)(client_1.UserRole.ADMIN), orders_controllers_1.OrdersControllers.getAllOrders);
//   Get orders by shopId
router.get("/shop-orders", (0, auth_1.default)(client_1.UserRole.VENDOR), orders_controllers_1.OrdersControllers.getOrdersByShop);
router.get("/:orderId/details", (0, auth_1.default)(client_1.UserRole.VENDOR), orders_controllers_1.OrdersControllers.getShopOrderDetailsById);
//   Get orders by userId (purchase history)
router.get("/user-orders", (0, auth_1.default)(client_1.UserRole.USER), orders_controllers_1.OrdersControllers.getOrdersByUser);
router.get("/purchaseDetails/:orderId", (0, auth_1.default)(client_1.UserRole.USER), orders_controllers_1.OrdersControllers.getUserOrderDetails);
router.post("/process-order-payment", orders_controllers_1.OrdersControllers.processOrderPayment);
exports.OrdersRoutes = router;
