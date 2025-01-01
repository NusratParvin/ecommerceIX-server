"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriberRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const subscribers_controllers_1 = require("./subscribers.controllers");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), subscribers_controllers_1.SubscriberControllers.fetchAllSubscribers);
router.post("/", subscribers_controllers_1.SubscriberControllers.addSubscriber);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), subscribers_controllers_1.SubscriberControllers.removeSubscriber);
exports.default = router;
exports.SubscriberRoutes = router;
