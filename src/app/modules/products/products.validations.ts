import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().nullable().optional(),
  price: z.preprocess((val) => parseFloat(val as string), z.number().min(0)),
  stock: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().int().min(0)
  ),
  discount: z.preprocess(
    (val) =>
      val !== null && val !== undefined ? parseFloat(val as string) : undefined,
    z
      .number()
      .min(0, "Discount must be non-negative")
      .max(100, "Discount cannot exceed 100")
      .optional()
  ),
  categoryId: z.string().uuid(),
  shopId: z.string().uuid(),
  isFlashSale: z.boolean(),
  flashSalePrice: z.preprocess(
    (val) => (val ? parseFloat(val as string) : undefined),
    z.number().min(0).optional()
  ),
  flashSaleStartDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  flashSaleEndDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
});

export const productValidationSchemas = {
  createProductSchema,
};
