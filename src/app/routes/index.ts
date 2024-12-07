import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { CategoriesRoutes } from "../modules/categories/categories.routes";
import { ProductRoutes } from "../modules/products/products.routes";
import { ShopsRouters } from "../modules/shops/shops.routes";
import { UsersRoutes } from "../modules/users/users.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/categories", route: CategoriesRoutes },
  { path: "/products", route: ProductRoutes },
  { path: "/shops", route: ShopsRouters },
  { path: "/users", route: UsersRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
