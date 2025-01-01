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
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const apiErrors_1 = __importDefault(require("../../errors/apiErrors"));
const http_status_codes_1 = require("http-status-codes");
const pagination_1 = require("../../../helpers/pagination");
const prisma = new client_1.PrismaClient();
// Get all users
const getAllUsersFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options);
    const where = {};
    // Handle search term for filtering by name or email
    if (filters.searchTerm) {
        where.OR = [
            { name: { contains: filters.searchTerm, mode: "insensitive" } },
            { email: { contains: filters.searchTerm, mode: "insensitive" } },
        ];
    }
    // Additional filters
    if (filters.role) {
        where.role = filters.role;
    }
    if (filters.status) {
        where.status = filters.status;
    }
    // Fetch data and count
    const users = yield prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy || "createdAt"]: sortOrder || "asc" },
        include: {
            shops: true,
            orders: true,
            reviews: true,
            followedShops: true,
        },
    });
    const total = yield prisma.user.count({ where });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: users,
    };
});
// Get a single user by ID
const getUserByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { id },
        include: {
            shops: true,
            orders: true,
            reviews: true,
            followedShops: true,
        },
    });
    if (!user)
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    return user;
});
// Get a single user by Email
const getUserByEmailFromDB = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findFirst({
        where: { email: userEmail },
        include: {
            shops: true,
            orders: true,
            reviews: true,
            followedShops: true,
        },
    });
    if (!user)
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    return user;
});
const updateUserStatusIntoDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const updatedUser = yield prisma.user.update({
        where: { id },
        data: { status },
    });
    return updatedUser;
});
const updateUserRoleIntoDB = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log(id, role);
    const user = yield prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const updatedUser = yield prisma.user.update({
        where: { id },
        data: { role },
    });
    return updatedUser;
});
// Delete a user permanently
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    yield prisma.user.update({
        where: { id },
        data: { status: client_1.ActiveStatus.DELETED },
    });
});
const subscribeToNewsletter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSubscriber = yield prisma.newsletter.findUnique({
        where: { email },
    });
    if (existingSubscriber) {
        throw new Error("This email is already subscribed.");
    }
    return yield prisma.newsletter.create({
        data: { email },
    });
});
const getAllSubscribers = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("in news");
    return yield prisma.newsletter.findMany({
        where: { isSubscribed: true },
        orderBy: { createdAt: "desc" },
    });
});
const unsubscribeFromNewsletter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.newsletter.update({
        where: { id },
        data: { isSubscribed: false },
    });
});
exports.UserServices = {
    getUserByIdFromDB,
    getUserByEmailFromDB,
    getAllUsersFromDB,
    updateUserStatusIntoDB,
    updateUserRoleIntoDB,
    deleteUserFromDB,
    subscribeToNewsletter,
    getAllSubscribers,
    unsubscribeFromNewsletter,
};
