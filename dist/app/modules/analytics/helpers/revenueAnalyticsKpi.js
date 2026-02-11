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
exports.getRevenueKPI = void 0;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const getRevenueKPI = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const now = new Date();
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const prev30Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const revInLast30Days = yield prisma_1.default.transaction.aggregate({
        where: {
            type: "ORDER_PAYMENT",
            paymentStatus: "PAID",
            createdAt: { gte: last30Days },
        },
        _sum: { amount: true },
    });
    const revInPrev30Days = yield prisma_1.default.transaction.aggregate({
        where: {
            type: "ORDER_PAYMENT",
            paymentStatus: "PAID",
            createdAt: { gte: prev30Days, lt: last30Days },
        },
        _sum: { amount: true },
    });
    const revenueLast30 = Number((_a = revInLast30Days._sum.amount) !== null && _a !== void 0 ? _a : 0);
    const revenuePrev30 = Number((_b = revInPrev30Days._sum.amount) !== null && _b !== void 0 ? _b : 0);
    const changeAmount = revenueLast30 - revenuePrev30;
    const changePercent = revenuePrev30 === 0
        ? revenueLast30 > 0
            ? 100
            : 0
        : Number(((changeAmount / revenuePrev30) * 100).toFixed(1));
    return {
        revenueLast30,
        revenuePrev30,
        changeAmount,
        changePercent,
    };
});
exports.getRevenueKPI = getRevenueKPI;
