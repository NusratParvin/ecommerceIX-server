import express, { NextFunction, Request, Response } from "express";
import { CategoriesControllers } from "./categories.controllers";
import zodValidate from "../../middlewares/zodValidate";
import { categoryValidationSchemas } from "./categories.validations";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/uploadImageToCloudinary";
import { productValidationSchemas } from "../products/products.validations";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), CategoriesControllers.getCategories);
router.get(
  "/get",

  CategoriesControllers.getCategoriesForAll
);
router.post(
  "/",
  auth(UserRole.ADMIN),
  fileUploader.uploadMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = categoryValidationSchemas.createCategorySchema.parse(
      JSON.parse(req.body.data)
    );
    return CategoriesControllers.createCategory(req, res, next);
  }
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
