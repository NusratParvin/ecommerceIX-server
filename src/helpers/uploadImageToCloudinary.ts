import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
import path from "path";
import config from "../config";
import { TCloudinaryResponse, TFile } from "../app/interfaces/fileUpload";

cloudinary.config({
  // cloud_name: config.cloudinary_cloud_name,
  cloud_name: "dvkpou1bp",
  // api_key: config.cloudinary_api_key,
  api_key: "834873476572536",
  // api_secret: config.cloudinary_api_secret,
  api_secret: "Kftim-fEAqaq5zp3AgneopCY9Bw",
});

const uploadImageToCloudinary = async (
  file: TFile
): Promise<TCloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: TCloudinaryResponse) => {
        if (error) {
          reject(error);
        } else {
          // Delete file only if upload succeeds
          fs.unlinkSync(file.path);
          resolve(result);
        }
      }
    );
  });
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");

    // Dynamically create the uploads directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadMulter = multer({ storage: storage });
export const fileUploader = {
  uploadMulter,
  uploadImageToCloudinary,
};
