"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/Auth/auth.routes");
const categories_routes_1 = require("../modules/categories/categories.routes");
const products_routes_1 = require("../modules/products/products.routes");
const shops_routes_1 = require("../modules/shops/shops.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    { path: "/auth", route: auth_routes_1.AuthRoutes },
    { path: "/categories", route: categories_routes_1.CategoriesRoutes },
    { path: "/products", route: products_routes_1.ProductRoutes },
    { path: "/shops", route: shops_routes_1.ShopsRouters },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
