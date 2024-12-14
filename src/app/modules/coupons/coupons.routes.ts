import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CouponsControllers } from "./coupons.controllers";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), CouponsControllers.createCoupon);
router.get("/:id", auth(UserRole.ADMIN), CouponsControllers.getCouponById);
router.get("/", auth(UserRole.ADMIN), CouponsControllers.getAllCoupons);

router.patch("/:id", auth(UserRole.ADMIN), CouponsControllers.updateCoupon);
router.delete("/:id", auth(UserRole.ADMIN), CouponsControllers.deleteCoupon);

export const CouponsRouters = router;
