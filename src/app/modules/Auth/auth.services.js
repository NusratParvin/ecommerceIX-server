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
// const registerUserIntoDB = async (req: Request): Promise<User> => {
//   const userExists = await prisma.user.findUnique({
//     where: { email: req.body.email, status: ActiveStatus.ACTIVE },
//   });
//   if (userExists)
//     throw new ApiError(StatusCodes.UNAUTHORIZED, "Email is in use");
//   const file = req.file as TFile;
//   if (file) {
//     const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
//     req.body.profilePhoto = uploadToCloudinary?.secure_url;
//   }
//   const hashedPassword = await bcrypt.hash(req.body.password, 12);
//   req.body.password = hashedPassword;
//   const result = await prisma.user.create({
//     data: req.body,
//   });
//   return result;
// };
const registerUserIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the email is already in use
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
exports.AuthServices = {
    loginUserIntoDB,
    registerUserIntoDB,
};
