"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidationSchemas = void 0;
const zod_1 = require("zod");
const createCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required.")
        .max(50, "Name must be under 50 characters."),
});
const updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.categoryValidationSchemas = {
    createCategorySchema,
    updateCategorySchema,
};
