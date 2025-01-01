import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { SubscriberControllers } from "./subscribers.controllers";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  SubscriberControllers.fetchAllSubscribers
);

router.post("/", SubscriberControllers.addSubscriber);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  SubscriberControllers.removeSubscriber
);

export default router;

export const SubscriberRoutes = router;
