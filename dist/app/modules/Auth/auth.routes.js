"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("./auth.controllers");
const auth_validations_1 = require("./auth.validations");
const uploadImageToCloudinary_1 = require("../../../helpers/uploadImageToCloudinary");
const router = express_1.default.Router();
router.post("/login", auth_controllers_1.AuthControllers.loginUser);
router.post("/register", uploadImageToCloudinary_1.fileUploader.uploadMulter.single("file"), (req, res, next) => {
    req.body = auth_validations_1.authValidationSchemas.registerUserSchema.parse(JSON.parse(req.body.data));
    return auth_controllers_1.AuthControllers.registerUser(req, res, next);
});
exports.AuthRoutes = router;
