"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_controllers_1 = require("./users.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), users_controllers_1.UserControllers.getAllUsers);
router.get("/get/:userEmail", users_controllers_1.UserControllers.getUserByEmail);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), users_controllers_1.UserControllers.getUserById);
router.patch("/:id/status", (0, auth_1.default)(client_1.UserRole.ADMIN), users_controllers_1.UserControllers.updateUserStatus);
router.patch("/:id/role", (0, auth_1.default)(client_1.UserRole.ADMIN), users_controllers_1.UserControllers.updateUserRole);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), users_controllers_1.UserControllers.deleteUser);
exports.default = router;
exports.UsersRoutes = router;
