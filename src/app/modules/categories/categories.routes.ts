import express from "express";
import { CategoriesControllers } from "./categories.controllers";
import zodValidate from "../../middlewares/zodValidate";
import { categoryValidationSchemas } from "./categories.validations";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), CategoriesControllers.getCategories);
router.post(
  "/",
  auth(UserRole.ADMIN),
  //   zodValidate(categoryValidationSchemas.createCategorySchema),

  CategoriesControllers.createCategory
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),

  zodValidate(categoryValidationSchemas.updateCategorySchema),
  CategoriesControllers.updateCategory
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  CategoriesControllers.deleteCategory
);

export const CategoriesRoutes = router;
