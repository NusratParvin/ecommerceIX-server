import express from "express";
import { OrdersControllers } from "./orders.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
//  Get all orders
router.get("/all-orders", auth(UserRole.ADMIN), OrdersControllers.getAllOrders);

//   Get orders by shopId
router.get(
  "/shop-orders",
  auth(UserRole.VENDOR),
  OrdersControllers.getOrdersByShop
);
router.get(
  "/:orderId/details",
  auth(UserRole.VENDOR),
  OrdersControllers.getShopOrderDetailsById
);

//   Get orders by userId (purchase history)
router.get(
  "/user-orders",
  auth(UserRole.USER),
  OrdersControllers.getOrdersByUser
);
router.get(
  "/purchaseDetails/:orderId",
  auth(UserRole.USER),
  OrdersControllers.getUserOrderDetails
);

router.post("/process-order-payment", OrdersControllers.processOrderPayment);

export const OrdersRoutes = router;
