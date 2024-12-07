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
exports.fileUploader = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    // cloud_name: config.cloudinary_cloud_name,
    cloud_name: "dvkpou1bp",
    // api_key: config.cloudinary_api_key,
    api_key: "834873476572536",
    // api_secret: config.cloudinary_api_secret,
    api_secret: "Kftim-fEAqaq5zp3AgneopCY9Bw",
});
const uploadImageToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                // Delete file only if upload succeeds
                fs_1.default.unlinkSync(file.path);
                resolve(result);
            }
        });
    });
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(process.cwd(), "uploads");
        // Dynamically create the uploads directory if it doesn't exist
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const uploadMulter = (0, multer_1.default)({ storage: storage });
exports.fileUploader = {
    uploadMulter,
    uploadImageToCloudinary,
};
