"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopValidationSchemas = void 0;
const zod_1 = require("zod");
const createShopSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required.")
        .max(50, "Name must be under 50 characters."),
    description: zod_1.z.string(),
    logo: zod_1.z.string().url("Invalid logo URL.").optional(),
    email: zod_1.z.string().email("Invalid email format.").min(1, "Email is required."),
});
const updateShopSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required.")
        .max(50, "Name must be under 50 characters.")
        .optional(),
    description: zod_1.z.string().optional(),
    logo: zod_1.z.string().url("Invalid logo URL.").optional(),
    status: zod_1.z
        .enum(["ACTIVE", "INACTIVE"], {
        required_error: "Status is required.",
        invalid_type_error: "Invalid status value.",
    })
        .optional(),
    email: zod_1.z
        .string()
        .email("Invalid email format.")
        .min(1, "Email is required.")
        .optional(),
});
exports.shopValidationSchemas = {
    createShopSchema,
    updateShopSchema,
};
