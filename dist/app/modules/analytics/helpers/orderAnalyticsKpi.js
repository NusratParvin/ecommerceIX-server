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
exports.getOrdersKPI = void 0;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const getOrdersKPI = () => __awaiter(void 0, void 0, void 0, function* () {
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const prev30Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const ordersInLast30Days = yield prisma_1.default.order.count({
        where: {
            paymentStatus: "PAID",
            createdAt: { gte: last30Days },
        },
    });
    const ordersInPrev30Days = yield prisma_1.default.order.count({
        where: {
            paymentStatus: "PAID",
            createdAt: { gte: prev30Days, lt: last30Days },
        },
    });
    const changeAmount = ordersInLast30Days - ordersInPrev30Days;
    const orderGrowth = ordersInPrev30Days === 0
        ? ordersInLast30Days > 0
            ? 100
            : 0
        : Number(((changeAmount / ordersInPrev30Days) * 100).toFixed(1));
    return {
        ordersLast30: ordersInLast30Days,
        // ordersPrev30: ordersInPrev30Days,
        // changeAmount,
        orderGrowth,
    };
});
exports.getOrdersKPI = getOrdersKPI;
