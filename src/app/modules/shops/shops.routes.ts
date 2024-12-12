import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpers/uploadImageToCloudinary";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ShopControllers } from "./shops.controllers";
import { shopValidationSchemas } from "./shops.validations";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.VENDOR),
  fileUploader.uploadMulter.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = shopValidationSchemas.createShopSchema.parse(
      JSON.parse(req.body.data)
    );
    return ShopControllers.createShop(req, res, next);
  }
);

// router.patch(
//   "/:shopId",
//   auth(UserRole.VENDOR),
//   fileUploader.uploadMulter.single("file"),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = shopValidationSchemas.updateShopSchema.parse(
//       JSON.parse(req.body.data)
//     );

//     return ShopControllers.updateShop(req, res, next);
//   }
// );

router.patch(
  "/:shopId",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  fileUploader.uploadMulter.single("file"), // Handle file uploads
  (req: Request, res: Response, next: NextFunction) => {
    // Parse the `data` field in FormData
    req.body = req.body.data ? JSON.parse(req.body.data) : {};
    return ShopControllers.updateShop(req, res, next);
  }
);

router.get("/", auth(UserRole.ADMIN), ShopControllers.getAllShops);
router.get("/getShops", ShopControllers.getAllShopsForAll);
router.patch("/:id/status", ShopControllers.updateShopStatus);

router.get("/myShop", auth(UserRole.VENDOR), ShopControllers.getMyShop);
router.get(
  "/followedShops",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.VENDOR),
  ShopControllers.fetchFollowedShops
);

export const ShopsRouters = router;
