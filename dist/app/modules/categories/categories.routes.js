"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const categories_controllers_1 = require("./categories.controllers");
const zodValidate_1 = __importDefault(require("../../middlewares/zodValidate"));
const categories_validations_1 = require("./categories.validations");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const uploadImageToCloudinary_1 = require("../../../helpers/uploadImageToCloudinary");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), categories_controllers_1.CategoriesControllers.getCategories);
router.get("/get", categories_controllers_1.CategoriesControllers.getCategoriesForAll);
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN), uploadImageToCloudinary_1.fileUploader.uploadMulter.single("file"), (req, res, next) => {
    req.body = categories_validations_1.categoryValidationSchemas.createCategorySchema.parse(JSON.parse(req.body.data));
    return categories_controllers_1.CategoriesControllers.createCategory(req, res, next);
});
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, zodValidate_1.default)(categories_validations_1.categoryValidationSchemas.updateCategorySchema), categories_controllers_1.CategoriesControllers.updateCategory);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), categories_controllers_1.CategoriesControllers.deleteCategory);
exports.CategoriesRoutes = router;
