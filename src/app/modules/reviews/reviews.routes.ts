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

router.delete("/:id", auth(UserRole.ADMIN), ReviewsControllers.deleteReview);
router.get("/", auth(UserRole.ADMIN), ReviewsControllers.getReviews);

export const ReviewsRouters = router;
