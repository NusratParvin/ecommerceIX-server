import express, { NextFunction, Request, Response } from "express";
import { AuthControllers } from "./auth.controllers";
import { authValidationSchemas } from "./auth.validations";
import zodValidate from "../../middlewares/zodValidate";
import { fileUploader } from "../../../helpers/uploadImageToCloudinary";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/login", AuthControllers.loginUser);
router.post(
  "/register",
  fileUploader.uploadMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = authValidationSchemas.registerUserSchema.parse(
      JSON.parse(req.body.data)
    );
    return AuthControllers.registerUser(req, res, next);
  }
);

router.post(
  "/forgot-password",
  // auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.USER),
  AuthControllers.forgotPassword
);

router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.USER),
  AuthControllers.changePassword
);

router.post(
  "/reset-password",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.USER),
  AuthControllers.resetPassword
);
export const AuthRoutes = router;
