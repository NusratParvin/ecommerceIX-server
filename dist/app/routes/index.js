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
const users_routes_1 = require("../modules/users/users.routes");
const coupons_routes_1 = require("../modules/coupons/coupons.routes");
const payments_routes_1 = require("../modules/payments/payments.routes");
const orders_routes_1 = require("../modules/orders/orders.routes");
const transactions_routes_1 = require("../modules/transactions/transactions.routes");
const reviews_routes_1 = require("../modules/reviews/reviews.routes");
const subscribers_routes_1 = require("../modules/subscribers/subscribers.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    { path: "/auth", route: auth_routes_1.AuthRoutes },
    { path: "/categories", route: categories_routes_1.CategoriesRoutes },
    { path: "/products", route: products_routes_1.ProductRoutes },
    { path: "/shops", route: shops_routes_1.ShopsRouters },
    { path: "/users", route: users_routes_1.UsersRoutes },
    { path: "/coupons", route: coupons_routes_1.CouponsRouters },
    { path: "/payments", route: payments_routes_1.PaymentsRoutes },
    { path: "/orders", route: orders_routes_1.OrdersRoutes },
    { path: "/transactions", route: transactions_routes_1.TransactionRoutes },
    { path: "/reviews", route: reviews_routes_1.ReviewsRouters },
    { path: "/subscribers", route: subscribers_routes_1.SubscriberRoutes },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
