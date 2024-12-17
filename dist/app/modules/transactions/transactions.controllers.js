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
exports.TransactionControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../helpers/pick"));
const transactions_services_1 = require("./transactions.services");
const transactionFilterableFields = [
    "orderId",
    "paymentMethod",
    "paymentStatus",
    "userId",
    "type",
    "searchTerm",
];
const paginationFields = ["page", "limit", "sortBy", "sortOrder"];
const getAllTransactionsForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, transactionFilterableFields);
    const options = (0, pick_1.default)(req.query, paginationFields);
    const paginationOptions = {
        page: options.page ? Number(options.page) : 1,
        limit: options.limit ? Number(options.limit) : 10,
        sortBy: options.sortBy ? String(options.sortBy) : "createdAt",
        sortOrder: options.sortOrder ? String(options.sortOrder) : "desc",
    };
    const result = yield transactions_services_1.TransactionServices.getAllTransactionsForAdminFromDB(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Transactions retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
exports.TransactionControllers = {
    getAllTransactionsForAdmin,
};
