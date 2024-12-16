"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const orders_controllers_1 = require("./orders.controllers");
const router = express_1.default.Router();
// Order routes
// router.post("/", OrdersControllers.createOrder);
router.get("/:id", orders_controllers_1.OrdersControllers.getOrderDetails);
// router.post("/create-payment-intent", OrdersControllers.createPaymentIntent);
router.post("/process-order-payment", orders_controllers_1.OrdersControllers.processOrderPayment);
exports.OrdersRoutes = router;
