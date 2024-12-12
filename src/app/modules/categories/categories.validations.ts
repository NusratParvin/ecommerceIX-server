import { z } from "zod";

const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name must be under 50 characters."),
  image: z.any(),
});

const updateCategorySchema = z.object({
  name: z.string().optional(),
  isDeleted: z.boolean().optional(),
  image: z.string().optional(),
});

export const categoryValidationSchemas = {
  createCategorySchema,
  updateCategorySchema,
};
