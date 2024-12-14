"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtToken_1 = require("../../../helpers/jwtToken");
const config_1 = __importDefault(require("../../../config"));
const uploadImageToCloudinary_1 = require("../../../helpers/uploadImageToCloudinary");
const http_status_codes_1 = require("http-status-codes");
const apiErrors_1 = __importDefault(require("../../errors/apiErrors"));
const sendEmail_1 = require("../../../helpers/sendEmail");
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield prisma_1.default.user.findUniqueOrThrow({
            where: { email: payload.email, status: client_1.ActiveStatus.ACTIVE },
        });
        const passwordCheck = yield bcrypt_1.default.compare(payload.password, userExists.password);
        if (!passwordCheck) {
            throw new Error("Password incorrect!");
        }
        const accessToken = jwtToken_1.jwtToken.generateToken({
            email: userExists.email,
            role: userExists.role,
            name: userExists.name,
            profilePhoto: userExists.profilePhoto,
        }, config_1.default.jwt.access_token_secret, config_1.default.jwt.access_token_expires_in);
        const refreshToken = jwtToken_1.jwtToken.generateToken({
            email: userExists.email,
            role: userExists.role,
            name: userExists.name,
            profilePhoto: userExists.profilePhoto,
        }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
        return {
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Invalid credential!");
    }
});
const registerUserIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield prisma_1.default.user.findUnique({
        where: { email: req.body.email, status: client_1.ActiveStatus.ACTIVE },
    });
    if (userExists) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Email is already in use.");
    }
    // Handle file upload
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield uploadImageToCloudinary_1.fileUploader.uploadImageToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    // Hash the password
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12);
    req.body.password = hashedPassword;
    // Create the user in the database
    const user = yield prisma_1.default.user.create({
        data: req.body,
        // data: {
        //   ...req.body,
        //   needsPasswordChange: true,
        // },
    });
    // Generate token if the user is a VENDOR
    let token;
    if (user.role === "VENDOR") {
        token = jwtToken_1.jwtToken.generateToken({
            email: user.email,
            role: user.role,
            name: user.name,
            profilePhoto: user.profilePhoto,
        }, config_1.default.jwt.access_token_secret, config_1.default.jwt.access_token_expires_in);
    }
    return { user, token };
});
const forgotPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email }) {
    console.log(email);
    const user = yield prisma_1.default.user.findFirst({
        where: {
            email: email,
            status: "ACTIVE",
        },
    });
    console.log(user);
    if (!user) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "This user is not found!");
    }
    const resetToken = jwtToken_1.jwtToken.generateToken({
        email: user.email,
        role: user.role,
        name: user.name,
        profilePhoto: user.profilePhoto,
    }, config_1.default.jwt.access_token_secret, "10m");
    const resetUILink = `${config_1.default.reset_pass_ui_link}/reset-password?id=${user.id}&token=${resetToken}`;
    yield (0, sendEmail_1.sendEmail)(user.email, resetUILink);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.ActiveStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "This user is not found!");
    }
    const isValidToken = jwtToken_1.jwtToken.verifyToken(token, config_1.default.jwt.access_token_secret);
    if (!isValidToken) {
        throw new apiErrors_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden!");
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    // Update user's password
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userData.id },
        data: {
            password: newHashedPassword,
        },
    });
    return updatedUser;
});
exports.AuthServices = {
    loginUserIntoDB,
    registerUserIntoDB,
    forgotPassword,
    resetPassword,
};
