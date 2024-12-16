"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsRouters = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const coupons_controllers_1 = require("./coupons.controllers");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN), coupons_controllers_1.CouponsControllers.createCoupon);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), coupons_controllers_1.CouponsControllers.getCouponById);
router.get("/", coupons_controllers_1.CouponsControllers.getAllCoupons);
router.post("/apply-coupon", coupons_controllers_1.CouponsControllers.applyCoupon);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), coupons_controllers_1.CouponsControllers.updateCoupon);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), coupons_controllers_1.CouponsControllers.deleteCoupon);
exports.CouponsRouters = router;
