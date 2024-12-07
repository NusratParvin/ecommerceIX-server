"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidationSchemas = void 0;
const zod_1 = require("zod");
const createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required."),
    description: zod_1.z.string().nullable().optional(),
    price: zod_1.z.preprocess((val) => parseFloat(val), zod_1.z.number().min(0)),
    stock: zod_1.z.preprocess((val) => parseInt(val, 10), zod_1.z.number().int().min(0)),
    discount: zod_1.z.preprocess((val) => val !== null && val !== undefined ? parseFloat(val) : undefined, zod_1.z
        .number()
        .min(0, "Discount must be non-negative")
        .max(100, "Discount cannot exceed 100")
        .optional()),
    categoryId: zod_1.z.string().uuid(),
    shopId: zod_1.z.string().uuid(),
    isFlashSale: zod_1.z.boolean(),
    flashSalePrice: zod_1.z.preprocess((val) => (val ? parseFloat(val) : undefined), zod_1.z.number().min(0).optional()),
    flashSaleStartDate: zod_1.z.preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date().optional()),
    flashSaleEndDate: zod_1.z.preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date().optional()),
});
exports.productValidationSchemas = {
    createProductSchema,
};
