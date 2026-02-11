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
exports.calculateProductPrice = void 0;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const calculateProductPrice = (items, shopId, coupon) => __awaiter(void 0, void 0, void 0, function* () {
    const productsIds = items.map((item) => item.productId);
    const products = yield prisma_1.default.product.findMany({
        where: {
            id: {
                in: productsIds,
            },
            shopId,
            isDeleted: false,
        },
    });
    const now = new Date();
    let subTotal = 0;
    const itemsBeforeCoupon = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            throw new Error(`Product ${item.productId} not found`);
        }
        let price = product.price;
        const isFlashSaleActive = (product === null || product === void 0 ? void 0 : product.isFlashSale) &&
            product.flashSalePrice &&
            (!product.flashSaleStartDate || now >= product.flashSaleStartDate) &&
            (!product.flashSaleEndDate || now <= product.flashSaleEndDate);
        if (isFlashSaleActive && product.flashSalePrice) {
            price = product.flashSalePrice;
            if (price < 0)
                price = 0;
        }
        else if ((product === null || product === void 0 ? void 0 : product.discount) && (product === null || product === void 0 ? void 0 : product.discount) > 0) {
            price = product.price * (1 - product.discount / 100);
        }
        price = Math.round(price * 100) / 100;
        const itemTotal = price * item.quantity;
        subTotal += itemTotal;
        return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: price,
            itemTotal,
        };
    });
    subTotal = Math.round(subTotal * 100) / 100;
    let couponDiscount = 0;
    let finalTotal = subTotal;
    let finalItems = itemsBeforeCoupon.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.unitPrice,
    }));
    if (coupon) {
        couponDiscount = coupon.discountAmount || 0;
        finalTotal = subTotal - couponDiscount;
        finalTotal = Math.round(finalTotal * 100) / 100;
        finalItems = itemsBeforeCoupon.map((item) => {
            let finalPrice = item.unitPrice;
            if (couponDiscount > 0) {
                const share = (item.itemTotal / subTotal) * couponDiscount;
                finalPrice = item.unitPrice - share / item.quantity;
                finalPrice = Math.round(finalPrice * 100) / 100;
            }
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: finalPrice,
            };
        });
    }
    return {
        items: finalItems,
        subTotal,
        couponDiscount,
        finalTotal,
    };
});
exports.calculateProductPrice = calculateProductPrice;
