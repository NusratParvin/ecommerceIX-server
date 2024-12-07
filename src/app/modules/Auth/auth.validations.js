"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidationSchemas = void 0;
const zod_1 = require("zod");
const registerUserSchema = zod_1.z.object({
    // name: z.string().min(2, "Name must be at least 2 characters long."),
    name: zod_1.z.string(),
    email: zod_1.z.string().email("Invalid email format."),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long."),
    role: zod_1.z.enum(["USER", "VENDOR"], {
        required_error: "Role is required.",
        invalid_type_error: "Role must be either USER or VENDOR.",
    }),
});
exports.authValidationSchemas = {
    registerUserSchema,
};
