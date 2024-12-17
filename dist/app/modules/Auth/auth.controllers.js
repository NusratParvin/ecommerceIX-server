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
exports.AuthControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const auth_services_1 = require("./auth.services");
// const registerUser = catchAsync(async (req: Request, res: Response) => {
//   console.log(req.file);
//   const result = await AuthServices.registerUserIntoDB(req);
//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     success: true,
//     message: "User Created successfully!",
//     data: result,
//   });
// });
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    const result = yield auth_services_1.AuthServices.loginUserIntoDB(req.body);
    const { refreshToken, accessToken } = result;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        },
    });
}));
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.file);
    const result = yield auth_services_1.AuthServices.registerUserIntoDB(req);
    // Check if a token exists in the result
    if (result.token) {
        const { token: accessToken } = result;
        // Set the access token as an HTTP-only cookie
        res.cookie("accessToken", accessToken, {
            // secure: true, // Set to true in production
            // httpOnly: true,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: "Vendor registered successfully!",
            data: { accessToken },
        });
    }
    else {
        // If no token (for USER registration)
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: "User registered successfully!",
            data: result.user,
        });
    }
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("forgot");
    yield auth_services_1.AuthServices.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Check your email!",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || "";
    // const token = req.headers.authorization?.split(" ")[1] || "";
    console.log(token);
    const { email, newPassword } = req.body;
    const payload = { email, newPassword };
    yield auth_services_1.AuthServices.resetPassword(payload, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Password Reset!",
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield auth_services_1.AuthServices.changePassword(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Password Changed successfully",
        data: result,
    });
}));
exports.AuthControllers = {
    loginUser,
    registerUser,
    resetPassword,
    forgotPassword,
    changePassword,
};
