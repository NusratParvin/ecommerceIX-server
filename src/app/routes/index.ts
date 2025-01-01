import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { CategoriesRoutes } from "../modules/categories/categories.routes";
import { ProductRoutes } from "../modules/products/products.routes";
import { ShopsRouters } from "../modules/shops/shops.routes";
import { UsersRoutes } from "../modules/users/users.routes";
import { CouponsRouters } from "../modules/coupons/coupons.routes";
import { PaymentsRoutes } from "../modules/payments/payments.routes";
import { OrdersRoutes } from "../modules/orders/orders.routes";
import { TransactionRoutes } from "../modules/transactions/transactions.routes";
import { ReviewsRouters } from "../modules/reviews/reviews.routes";
import { SubscriberRoutes } from "../modules/subscribers/subscribers.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/categories", route: CategoriesRoutes },
  { path: "/products", route: ProductRoutes },
  { path: "/shops", route: ShopsRouters },
  { path: "/users", route: UsersRoutes },
  { path: "/coupons", route: CouponsRouters },
  { path: "/payments", route: PaymentsRoutes },
  { path: "/orders", route: OrdersRoutes },
  { path: "/transactions", route: TransactionRoutes },
  { path: "/reviews", route: ReviewsRouters },
  { path: "/subscribers", route: SubscriberRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
