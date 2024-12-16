import express from "express";
import { ReviewsControllers } from "./reviews.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.USER),
  ReviewsControllers.submitReview
);

export const ReviewsRouters = router;
