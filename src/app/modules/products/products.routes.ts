import express, { NextFunction, Request, Response } from "express";
import { ProductControllers } from "./products.controllers";
import { fileUploader } from "../../../helpers/uploadImageToCloudinary";
import { productValidationSchemas } from "./products.validations";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// router.post("/", ProductControllers.createProduct);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  fileUploader.uploadMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = productValidationSchemas.createProductSchema.parse(
      JSON.parse(req.body.data)
    );
    return ProductControllers.createProduct(req, res, next);
  }
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  fileUploader.uploadMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);

    return ProductControllers.updateProduct(req, res, next);
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  ProductControllers.updateProductStatus
);

router.get(
  "/get",
  auth(UserRole.ADMIN),
  ProductControllers.getAllProductsForAdmin
);
router.get("/:id", ProductControllers.getProductById);
router.delete("/:id", ProductControllers.deleteProduct);
router.get("/", ProductControllers.getAllProducts);

export const ProductRoutes = router;
