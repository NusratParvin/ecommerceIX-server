"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopsRouters = void 0;
const express_1 = __importDefault(require("express"));
const uploadImageToCloudinary_1 = require("../../../helpers/uploadImageToCloudinary");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const shops_controllers_1 = require("./shops.controllers");
const shops_validations_1 = require("./shops.validations");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.VENDOR), uploadImageToCloudinary_1.fileUploader.uploadMulter.single("file"), (req, res, next) => {
    req.body = shops_validations_1.shopValidationSchemas.createShopSchema.parse(JSON.parse(req.body.data));
    return shops_controllers_1.ShopControllers.createShop(req, res, next);
});
// router.patch(
//   "/:shopId",
//   auth(UserRole.VENDOR),
//   fileUploader.uploadMulter.single("file"),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = shopValidationSchemas.updateShopSchema.parse(
//       JSON.parse(req.body.data)
//     );
//     return ShopControllers.updateShop(req, res, next);
//   }
// );
router.patch("/:shopId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), uploadImageToCloudinary_1.fileUploader.uploadMulter.single("file"), // Handle file uploads
(req, res, next) => {
    // Parse the `data` field in FormData
    req.body = req.body.data ? JSON.parse(req.body.data) : {};
    return shops_controllers_1.ShopControllers.updateShop(req, res, next);
});
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), shops_controllers_1.ShopControllers.getAllShops);
router.get("/getShops", shops_controllers_1.ShopControllers.getAllShopsForAll);
router.patch("/:id/status", shops_controllers_1.ShopControllers.updateShopStatus);
router.get("/myShop", (0, auth_1.default)(client_1.UserRole.VENDOR), shops_controllers_1.ShopControllers.getMyShop);
router.get("/followedShops", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER, client_1.UserRole.VENDOR), shops_controllers_1.ShopControllers.fetchFollowedShops);
router.get("/:shopId", shops_controllers_1.ShopControllers.getShopDetails);
router.post("/follow/:shopId", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), shops_controllers_1.ShopControllers.followShop);
router.post("/unfollow/:shopId", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), shops_controllers_1.ShopControllers.unfollowShop);
exports.ShopsRouters = router;
