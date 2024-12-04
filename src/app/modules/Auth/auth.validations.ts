import { UserRole } from "@prisma/client";
import { z } from "zod";

const registerUserSchema = z.object({
  // name: z.string().min(2, "Name must be at least 2 characters long."),
  name: z.string(),
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  role: z.enum(["USER", "VENDOR"], {
    required_error: "Role is required.",
    invalid_type_error: "Role must be either USER or VENDOR.",
  }),
});
export const authValidationSchemas = {
  registerUserSchema,
};
