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
exports.UserControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const users_services_1 = require("./users.services");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../helpers/pick"));
// Get all users
const userFilterableFields = ["role", "status", "name", "email", "searchTerm"];
const paginationFields = ["limit", "page", "sortBy", "sortOrder"];
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, userFilterableFields);
    const options = (0, pick_1.default)(req.query, paginationFields);
    const result = yield users_services_1.UserServices.getAllUsersFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Users retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
// Get a single user by ID
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield users_services_1.UserServices.getUserByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User fetched successfully!",
        data: user,
    });
}));
// Update user status
const updateUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const updatedUser = yield users_services_1.UserServices.updateUserStatusIntoDB(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User status updated successfully!",
        data: updatedUser,
    });
}));
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    //   console.log(id, role);
    const updatedUser = yield users_services_1.UserServices.updateUserRoleIntoDB(id, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User role updated successfully!",
        data: updatedUser,
    });
}));
// Delete a user
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield users_services_1.UserServices.deleteUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.NO_CONTENT,
        success: true,
        message: "User deleted successfully!",
    });
}));
exports.UserControllers = {
    getAllUsers,
    deleteUser,
    updateUserStatus,
    updateUserRole,
    getUserById,
};
