"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const products_controllers_1 = require("./products.controllers");
const uploadImageToCloudinary_1 = require("../../../helpers/uploadImageToCloudinary");
const products_validations_1 = require("./products.validations");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// router.post("/", ProductControllers.createProduct);
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), uploadImageToCloudinary_1.fileUploader.uploadMulter.single("file"), (req, res, next) => {
    req.body = products_validations_1.productValidationSchemas.createProductSchema.parse(JSON.parse(req.body.data));
    return products_controllers_1.ProductControllers.createProduct(req, res, next);
});
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), uploadImageToCloudinary_1.fileUploader.uploadMulter.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return products_controllers_1.ProductControllers.updateProduct(req, res, next);
});
router.patch("/:id/status", (0, auth_1.default)(client_1.UserRole.ADMIN), products_controllers_1.ProductControllers.updateProductStatus);
router.get("/get", (0, auth_1.default)(client_1.UserRole.ADMIN), products_controllers_1.ProductControllers.getAllProductsForAdmin);
router.get("/vendor", (0, auth_1.default)(client_1.UserRole.VENDOR), products_controllers_1.ProductControllers.getAllProductsForVendor);
router.get("/flash-Sale", products_controllers_1.ProductControllers.getFlashSaleProducts);
router.get("/category/:categoryId", products_controllers_1.ProductControllers.getProductsByCategory);
router.get("/:id", products_controllers_1.ProductControllers.getProductById);
router.delete("/:id", products_controllers_1.ProductControllers.deleteProduct);
router.get("/", products_controllers_1.ProductControllers.getAllProducts);
exports.ProductRoutes = router;
