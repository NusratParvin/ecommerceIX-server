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
const config_1 = __importDefault(require("../../config"));
const http_status_codes_1 = require("http-status-codes");
const jwtToken_1 = require("../../helpers/jwtToken");
const apiErrors_1 = __importDefault(require("../errors/apiErrors"));
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // console.log(req.headers);
            const token = req.headers.authorization;
            // console.log(token);
            if (!token) {
                throw new apiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
            }
            const verifiedUser = jwtToken_1.jwtToken.verifyToken(token, config_1.default.jwt.access_token_secret);
            req.user = verifiedUser;
            // console.log(req.user, "auth");
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new apiErrors_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden!");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.default = auth;
