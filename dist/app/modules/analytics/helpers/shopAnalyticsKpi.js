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
exports.getShopStatsKPI = void 0;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const getShopStatsKPI = () => __awaiter(void 0, void 0, void 0, function* () {
    const activeShops = yield prisma_1.default.shop.count({
        where: {
            status: "ACTIVE",
        },
    });
    const shopsInLast30Days = yield prisma_1.default.shop.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        },
    });
    const shopsInPrev30Days = yield prisma_1.default.shop.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // ✅ 60 days ago
                lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // ✅ up to 30 days ago
            },
        },
    });
    const changeInShops = shopsInLast30Days - shopsInPrev30Days;
    const shopGrowth = shopsInPrev30Days === 0
        ? shopsInLast30Days === 0
            ? 0
            : 100
        : Number(((changeInShops / shopsInPrev30Days) * 100).toFixed(1));
    return {
        activeShops,
        shopGrowth,
    };
});
exports.getShopStatsKPI = getShopStatsKPI;
