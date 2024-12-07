import { z } from "zod";

const createShopSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name must be under 50 characters."),
  description: z.string(),
  logo: z.string().url("Invalid logo URL.").optional(),
  email: z.string().email("Invalid email format.").min(1, "Email is required."),
});

const updateShopSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name must be under 50 characters.")
    .optional(),
  description: z.string().optional(),
  logo: z.string().url("Invalid logo URL.").optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE"], {
      required_error: "Status is required.",
      invalid_type_error: "Invalid status value.",
    })
    .optional(),
  email: z
    .string()
    .email("Invalid email format.")
    .min(1, "Email is required.")
    .optional(),
});

export const shopValidationSchemas = {
  createShopSchema,
  updateShopSchema,
};
