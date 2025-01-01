import express from "express";
import { UserControllers } from "./users.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/subscribers ",
  auth(UserRole.ADMIN),
  UserControllers.fetchAllSubscribers
);

router.get("/", auth(UserRole.ADMIN), UserControllers.getAllUsers);
router.get("/get/:userEmail", UserControllers.getUserByEmail);

router.get("/:id", auth(UserRole.ADMIN), UserControllers.getUserById);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  UserControllers.updateUserStatus
);
router.patch("/:id/role", auth(UserRole.ADMIN), UserControllers.updateUserRole);

router.delete("/:id", auth(UserRole.ADMIN), UserControllers.deleteUser);

router.post("/subscribe", UserControllers.addSubscriber);
router.delete("/unsubscribe/:id", UserControllers.removeSubscriber);

export default router;

export const UsersRoutes = router;
