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
exports.topCategorySales = void 0;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const topCategorySales = (givenDate) => __awaiter(void 0, void 0, void 0, function* () {
    const topProducts = yield prisma_1.default.orderItem.groupBy({
        by: ["productId"],
        where: {
            order: { createdAt: { gte: givenDate }, paymentStatus: "PAID" },
        },
        _sum: {
            quantity: true,
            price: true,
        },
        orderBy: { _sum: { price: "desc" } },
    });
    const productSalesData = topProducts.map((p) => ({
        productId: p.productId,
        totalRevenue: p._sum.price || 0,
    }));
    // Get product categories
    const productIds = productSalesData.map((p) => p.productId);
    const products = yield prisma_1.default.product.findMany({
        where: { id: { in: productIds } },
        select: {
            id: true,
            category: { select: { name: true } },
        },
    });
    // Get total sales
    const totalSales = yield prisma_1.default.order.aggregate({
        where: {
            createdAt: { gte: givenDate },
            paymentStatus: "PAID",
        },
        _sum: { totalPrice: true },
    });
    const totalRevenue = totalSales._sum.totalPrice || 1;
    const categoryRevenue = {};
    productSalesData.forEach((sale) => {
        var _a;
        const product = products.find((p) => p.id === sale.productId);
        const categoryName = ((_a = product === null || product === void 0 ? void 0 : product.category) === null || _a === void 0 ? void 0 : _a.name) || "Uncategorized";
        if (!categoryRevenue[categoryName]) {
            categoryRevenue[categoryName] = 0;
        }
        categoryRevenue[categoryName] += sale.totalRevenue;
    });
    let highestCategory = "No Category";
    let highestPercentage = 0;
    for (let categoryName in categoryRevenue) {
        const revenue = categoryRevenue[categoryName];
        const percentage = (revenue / totalRevenue) * 100;
        if (percentage > highestPercentage) {
            highestPercentage = percentage;
            highestCategory = categoryName;
        }
    }
    return {
        name: highestCategory,
        percentage: Math.round(highestPercentage * 10) / 10,
    };
});
exports.topCategorySales = topCategorySales;
