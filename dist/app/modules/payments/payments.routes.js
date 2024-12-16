"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payments_controllers_1 = require("./payments.controllers");
const router = express_1.default.Router();
// Payment routes
router.post("/create-payment-intent", payments_controllers_1.PaymentsControllers.createPaymentIntent);
router.post("/confirm-payment", payments_controllers_1.PaymentsControllers.confirmPayment);
exports.PaymentsRoutes = router;
