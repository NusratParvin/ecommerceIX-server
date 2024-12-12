"use strict";
// import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import multer from "multer";
// import path from "path";
// import config from "../config";
// import { TCloudinaryResponse, TFile } from "../app/interfaces/fileUpload";
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
// cloudinary.config({
//   // cloud_name: config.cloudinary_cloud_name,
//   cloud_name: "dvkpou1bp",
//   // api_key: config.cloudinary_api_key,
//   api_key: "834873476572536",
//   // api_secret: config.cloudinary_api_secret,
//   api_secret: "Kftim-fEAqaq5zp3AgneopCY9Bw",
// });
// const uploadImageToCloudinary = async (
//   file: TFile
// ): Promise<TCloudinaryResponse | undefined> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file.path,
//       (error: Error, result: TCloudinaryResponse) => {
//         if (error) {
//           reject(error);
//         } else {
//           // Delete file only if upload succeeds
//           fs.unlinkSync(file.path);
//           resolve(result);
//         }
//       }
//     );
//   });
// };
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const uploadPath = path.join(process.cwd(), "uploads");
// //     // Dynamically create the uploads directory if it doesn't exist
// //     fs.mkdirSync(uploadPath, { recursive: true });
// //     cb(null, uploadPath);
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueName = `${Date.now()}-${file.originalname}`;
// //     cb(null, uniqueName);
// //   },
// // });
// const storage = multer.memoryStorage();
// const uploadMulter = multer({ storage: storage });
// export const fileUploader = {
//   uploadMulter,
//   uploadImageToCloudinary,
// };
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const multer_1 = __importDefault(require("multer"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: "dvkpou1bp",
    api_key: "834873476572536",
    api_secret: "Kftim-fEAqaq5zp3AgneopCY9Bw",
});
// Upload image to Cloudinary using a stream
const uploadImageToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file.buffer) {
        throw new Error("File buffer is missing. Ensure you are using memoryStorage.");
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "uploads" }, (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error);
                reject(new Error("Failed to upload image to Cloudinary."));
            }
            else if (result) {
                console.log("Cloudinary Upload Success:", result);
                resolve({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                });
            }
            else {
                reject(new Error("Unknown error during upload."));
            }
        });
        // Check if the buffer exists before piping
        if (file.buffer) {
            stream_1.Readable.from(file.buffer).pipe(uploadStream);
        }
        else {
            reject(new Error("File buffer is undefined."));
        }
    });
});
// Configure Multer to use memory storage
const storage = multer_1.default.memoryStorage();
const uploadMulter = (0, multer_1.default)({ storage });
exports.fileUploader = {
    uploadMulter,
    uploadImageToCloudinary,
};
