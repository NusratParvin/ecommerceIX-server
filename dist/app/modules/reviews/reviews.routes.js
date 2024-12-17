"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsRouters = void 0;
const express_1 = __importDefault(require("express"));
const reviews_controllers_1 = require("./reviews.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.USER), reviews_controllers_1.ReviewsControllers.submitReview);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), reviews_controllers_1.ReviewsControllers.deleteReview);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), reviews_controllers_1.ReviewsControllers.getReviews);
exports.ReviewsRouters = router;
