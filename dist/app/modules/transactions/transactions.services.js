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
exports.TransactionServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const pagination_1 = require("../../../helpers/pagination");
const getAllTransactionsForAdminFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.pagination.calculatePagination(options);
    const where = {};
    if (filters.userId && filters.userId !== "null") {
        where.userId = filters.userId;
    }
    if (filters.searchTerm) {
        where.id = { equals: filters.searchTerm };
    }
    console.log("Filters applied:", where);
    const [data, total] = yield Promise.all([
        prisma_1.default.transaction.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                order: true,
                user: true,
            },
        }),
        prisma_1.default.transaction.count({ where }),
    ]);
    console.log("Fetched transactions:", data.length, "out of", total);
    const hasNextPage = skip + data.length < total;
    return {
        meta: { total, page, limit, hasNextPage },
        data,
    };
});
exports.TransactionServices = {
    //   getAllTransactionsFromDB,
    getAllTransactionsForAdminFromDB,
};
