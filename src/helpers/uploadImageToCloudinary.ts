// import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import multer from "multer";
// import path from "path";
// import config from "../config";
// import { TCloudinaryResponse, TFile } from "../app/interfaces/fileUpload";

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

import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as cloudinary,
} from "cloudinary";
import { Readable } from "stream";
import multer from "multer";

// Correct your interfaces if needed
interface TFile {
  buffer?: Buffer;
  originalname: string;
  fieldname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path?: string;
  size: number;
}

interface TCloudinaryResponse {
  public_id: string;
  secure_url: string;
  [key: string]: any; // Add this to match Cloudinary response fields
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dvkpou1bp",
  api_key: "834873476572536",
  api_secret: "Kftim-fEAqaq5zp3AgneopCY9Bw",
});

// Upload image to Cloudinary using a stream
const uploadImageToCloudinary = async (
  file: TFile
): Promise<TCloudinaryResponse> => {
  if (!file.buffer) {
    throw new Error(
      "File buffer is missing. Ensure you are using memoryStorage."
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(new Error("Failed to upload image to Cloudinary."));
        } else if (result) {
          console.log("Cloudinary Upload Success:", result);
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        } else {
          reject(new Error("Unknown error during upload."));
        }
      }
    );

    // Check if the buffer exists before piping
    if (file.buffer) {
      Readable.from(file.buffer).pipe(uploadStream);
    } else {
      reject(new Error("File buffer is undefined."));
    }
  });
};

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

const uploadMulter = multer({ storage });

export const fileUploader = {
  uploadMulter,
  uploadImageToCloudinary,
};
