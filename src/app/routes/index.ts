import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { CategoriesRoutes } from "../modules/categories/categories.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/categories", route: CategoriesRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
